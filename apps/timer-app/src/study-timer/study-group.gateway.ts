import { ConfigService } from '@nestjs/config';
import {
  WebSocketGateway,
  SubscribeMessage,
  WebSocketServer,
  ConnectedSocket,
  MessageBody,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { JwtService } from '@nestjs/jwt';
import { ForbiddenException, Logger } from '@nestjs/common';

import { AllConfigType } from '../config/config.type';
import { MembersService } from '../members/services/members.service';
import { JwtPayloadType } from '../auth/strategies/types/jwt-payload';
import { RoleEnum } from '../roles/roles.enum';
import { StudyGroupRedisService } from './study-group-redis.service';

const MAX_GROUP_MEMBERS = 9;

@WebSocketGateway({ namespace: 'study-group' })
export class StudyGroupGateway implements OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  private readonly logger = new Logger(StudyGroupGateway.name);

  constructor(
    private configService: ConfigService<AllConfigType>,
    private readonly jwtService: JwtService,
    private readonly membersService: MembersService,
    private readonly studyGroupRedisService: StudyGroupRedisService,
  ) {}

  async onApplicationShutdown() {
    this.logger.log('Redis connection closed.');
  }

  // 연결이 종료되면 client의 memberId를 조회하여 그룹에서 나가고,
  // 그룹에 남은 인원이 있으면 그룹에 memberLeft 이벤트를 broadcast
  async handleDisconnect(client: Socket) {
    const memberId = client.data.memberId;
    if (!memberId) {
      this.logger.warn(`Member: ${memberId} not found.`);
      return;
    }

    const groupId =
      await this.studyGroupRedisService.findGroupByMemberId(memberId);
    if (!groupId) {
      this.logger.warn(`Member: ${memberId} does not belong to any group.`);
      return;
    }

    // 멤버 제거와 동시에 남은 멤버 수를 확인
    const membersCount =
      await this.studyGroupRedisService.removeMemberFromGroup(
        memberId,
        groupId,
      );

    if (membersCount > 0) {
      // 남은 멤버가 있으면 `memberLeft` 이벤트 방송
      this.server.to(groupId).emit('memberLeft', { memberId });
      this.logger.log(
        `Member ${memberId} left group ${groupId}, notifying remaining members.`,
      );
    } else {
      // 남은 멤버가 없으면 추가 처리 없음
      this.logger.log(
        `Member ${memberId} left group ${groupId}, no members left.`,
      );
    }
  }

  // jwtToken으로 멤버를 조회하여 MAX_GROUP_MEMBERS명 미만인 그룹에 참여
  @SubscribeMessage('joinGroup')
  async handleJoinGroup(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: { jwtToken: string },
  ) {
    try {
      const decoded = this.jwtService.verify<JwtPayloadType>(data.jwtToken, {
        secret: this.configService.get('auth.secret', { infer: true }),
      });
      const member = await this.membersService.findOneByAccountIdOrFail(
        decoded.sub,
      );
      client.data.memberId = member.member_id;

      let groupId =
        await this.studyGroupRedisService.findAvailableGroup(MAX_GROUP_MEMBERS);
      if (!groupId) {
        groupId = await this.studyGroupRedisService.createGroupWithFirstMember(
          member.member_id,
        );
      } else {
        await this.studyGroupRedisService.addMemberToGroup(
          member.member_id,
          groupId,
        );
      }
      client.join(groupId);
      const joinedAtUTC = new Date().toISOString();
      await this.studyGroupRedisService.saveMemberInfo(member.member_id, {
        ...member,
        joinedAtUTC,
      });
      // 해당 그룹 내 새 멤버 입장 이벤트 발송
      this.server.to(groupId).emit('newMember', {
        member_id: member.member_id,
        image_url: member.image_url,
        nickname: member.nickname,
        joinedAtUTC,
      });
      this.logger.log(`Member ${member.member_id} joined group ${groupId}.`);

      const membersInfo =
        await this.studyGroupRedisService.getMembersInfo(groupId);
      client.emit('groupInfo', { groupId, members: membersInfo });
    } catch (e) {
      this.handleError(client, e);
    }
  }

  // ** 어드민 기능 **

  // 어드민 접속
  @SubscribeMessage('adminLogin')
  async handleAdminLogin(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: { jwtToken: string },
  ) {
    try {
      const decoded = this.jwtService.verify<JwtPayloadType>(data.jwtToken, {
        secret: this.configService.get('auth.secret', { infer: true }),
      });
      if (decoded.role?.role_id !== RoleEnum.admin) {
        throw new ForbiddenException();
      }

      const initalState = await this.loadInitalState();

      this.logger.log('All study group data removed.');
      client.emit('initalState', initalState);
    } catch (e) {
      this.handleError(client, e);
    }
  }

  // 모든 그룹 폭파
  @SubscribeMessage('adminRemoveAllData')
  async handleRemoveAllGroup(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: { jwtToken: string },
  ) {
    try {
      const decoded = this.jwtService.verify<JwtPayloadType>(data.jwtToken, {
        secret: this.configService.get('auth.secret', { infer: true }),
      });
      if (decoded.role?.role_id !== RoleEnum.admin) {
        throw new ForbiddenException();
      }
      // 전체 방에 폭파 이벤트 발송
      const groups = await this.studyGroupRedisService.getAllGroups();
      groups.map((group) =>
        this.server.to(group.id).emit('explodeGroup', 'explode group'),
      );
      // 모든 그룹 데이터 삭제
      await this.studyGroupRedisService.removeAllGroupsData();
      this.logger.log('All study group data removed.');
    } catch (e) {
      this.handleError(client, e);
    }
  }

  // 특정 그룹 폭파
  @SubscribeMessage('adminRemoveGroup')
  async handleRemoveGroupById(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: { jwtToken: string; groupId: string },
  ) {
    try {
      const decoded = this.jwtService.verify<JwtPayloadType>(data.jwtToken, {
        secret: this.configService.get('auth.secret', { infer: true }),
      });
      if (decoded.role?.role_id !== RoleEnum.admin) {
        throw new ForbiddenException();
      }

      await this.studyGroupRedisService.removeGroupById(data.groupId);
      this.server.to(data.groupId).emit('explodeGroup', 'explode group');
      this.logger.log(`Remove studyGroup: ${data.groupId}`);
    } catch (e) {
      this.handleError(client, e);
    }
  }

  private async loadInitalState() {
    const groups = await this.studyGroupRedisService.getAllGroups(); // 모든 그룹 리스트 (groupId - count)

    return {
      groups,
    };
  }

  // 에러 핸들링
  private handleError(client: Socket, error: Error) {
    this.logger.error(error.message);
    client.emit('error', { message: error.message });
    client.disconnect();
  }
}
