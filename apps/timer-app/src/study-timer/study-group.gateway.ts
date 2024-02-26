import { ConfigService } from '@nestjs/config';
import {
  WebSocketGateway,
  SubscribeMessage,
  WebSocketServer,
  ConnectedSocket,
  MessageBody,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import Redis from 'ioredis';
import { Server, Socket } from 'socket.io';
import { v4 as uuidv4 } from 'uuid';
import { JwtService } from '@nestjs/jwt';
import { ForbiddenException } from '@nestjs/common';

import { AllConfigType } from '../config/config.type';
import { MembersService } from '../members/services/members.service';
import { JwtPayloadType } from '../auth/strategies/types/jwt-payload';
import { Member } from '../database/domain/member';
import { RoleEnum } from '../roles/roles.enum';
import { InjectRedis } from '@nestjs-modules/ioredis';

interface MemberInfo {
  member_id: Member['member_id'];
  image_url: Member['image_url'];
  nickname: Member['nickname'];
  joinedAtUTC: string;
}

// (string)  group:{groupId}:count      - 현재 그룹 인원 (number)
// (set)     group:{groupId}:members    - 그룹에 참여중인 멤버의 id 배열 (string[])
// (string)  member:{memberId}:group   - 해당 멤버가 참여중인 그룹
// (hash)    member:{memberId}          - 멤버정보(MemberInfo)

@WebSocketGateway()
export class StudyGroupGateway implements OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  constructor(
    private configService: ConfigService<AllConfigType>,
    private readonly jwtService: JwtService,
    private readonly membersService: MembersService,
    @InjectRedis() private readonly redis: Redis,
  ) {}

  async onApplicationShutdown() {
    await this.redis.quit();
  }

  // 연결이 종료되면 client의 memberId를 조회하여 그룹에서 나가고,
  // 그룹에 남은 인원이 있으면 그룹에 memberLeft 이벤트를 broadcast
  async handleDisconnect(client: Socket) {
    // client.data에서 memberId 추출
    const memberId = client.data.memberId;
    if (!memberId) {
      console.log(`멤버: ${memberId} 을 찾을 수 없습니다.`);
      return;
    }

    const groupId = await this.findGroupByMemberId(memberId);
    if (!groupId) {
      console.log(`멤버: ${memberId} 가 속한 그룹이 없습니다.`);
      return;
    }

    await this.removeMemberFromGroup(memberId, groupId);
    await this.redis.del(`member:${memberId}`);

    console.log(`member ${memberId}가 ${groupId}방에서 퇴장`);
  }

  @SubscribeMessage('removeAllData')
  async removeAllGroup(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: { jwtToken: string },
  ) {
    const decoded = this.jwtService.verify<JwtPayloadType>(data.jwtToken, {
      secret: this.configService.get('auth.secret', { infer: true }),
    });
    if (decoded.role?.role_id !== RoleEnum.admin) {
      throw new ForbiddenException('권한 없음');
    }
    const groupCounts = await this.redis.keys('group:*:count');
    for (const groupKey of groupCounts) {
      await this.redis.del(groupKey);
    }
    const groupMembers = await this.redis.keys('group:*:members');
    for (const groupMemberKey of groupMembers) {
      await this.redis.del(groupMemberKey);
    }
    const memberGroups = await this.redis.keys('member:*:group');
    for (const memberGroupKey of memberGroups) {
      await this.redis.del(memberGroupKey);
    }
    const members = await this.redis.keys('member:*');
    for (const member of members) {
      await this.redis.del(member);
    }

    console.log('모든 studyGroup 데이터 제거완료');
    console.log(
      `groupCounts: [${groupCounts}]\ngroupMembers: [${groupMembers}]\nmemberGroups: [${memberGroups}]\nmembers: [${members}]`,
    );
  }

  // jwtToken으로 멤버를 조회하여 8명 미만인 그룹에 참여
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
      client.data.memberId = member.member_id; // 그룹에서 나갈때 사용

      let groupId = await this.findAvailableGroup();
      if (!groupId) {
        groupId = await this.createGroupWithFirstMember(member.member_id);
      } else {
        await this.addMemberToGroup(member.member_id, groupId);
      }
      client.join(groupId);
      const joinedAtUTC = new Date().toISOString(); // 입장 시간

      // 멤버 정보를 Redis에 저장
      await this.saveMemberInfo(member.member_id, {
        image_url: member.image_url || '',
        nickname: member.nickname,
        joinedAtUTC,
      });

      console.log(`member ${member.member_id}가 ${groupId}방에 입장`);

      // 새 멤버 정보를 그룹의 모든 기존 멤버들에게 방송
      this.server.to(groupId).emit('newMember', {
        member_id: member.member_id,
        image_url: member.image_url,
        nickname: member.nickname,
        joinedAtUTC,
      });

      // 새 멤버에게 현재 그룹의 모든 유저 목록을 발송
      const members = await this.redis.smembers(`group:${groupId}:members`);
      const membersInfo = await this.getMembersInfo(members);

      client.emit('groupInfo', {
        groupId,
        members: membersInfo,
      });
    } catch (error) {
      client.disconnect();
    }
  }

  // 8명 미만인 그룹 찾기
  private async findAvailableGroup(): Promise<string | null> {
    const groupCounts = await this.redis.keys('group:*:count');
    for (const countKey of groupCounts) {
      const membersCount = (await this.redis.get(countKey)) || '0';
      if (parseInt(membersCount, 10) < 8) {
        return countKey.split(':')[1];
      }
    }
    return null;
  }

  // 새 그룹 생성(uuid) 및 멤버 추가
  private async createGroupWithFirstMember(memberId: string): Promise<string> {
    const groupId = uuidv4();
    console.log(`${groupId}방이 새로 생성`);
    await this.addMemberToGroup(memberId, groupId);

    return groupId;
  }

  // 그룹에 멤버 추가
  private async addMemberToGroup(
    memberId: string,
    groupId: string,
  ): Promise<void> {
    // 멤버가 참여한 그룹 ID를 저장
    await this.redis.set(`member:${memberId}:group`, groupId);
    await this.redis.sadd(`group:${groupId}:members`, memberId);
    await this.redis.incr(`group:${groupId}:count`); // incr은 해당 키가 없으면 자동으로 0을 할당 후 1을 증가시킴
  }

  // 그룹에서 멤버 제거 및 memberLeft broadcast
  private async removeMemberFromGroup(
    memberId: string,
    groupId: string,
  ): Promise<void> {
    await this.redis.srem(`group:${groupId}:members`, memberId);
    const membersCount = await this.redis.decr(`group:${groupId}:count`);
    if (membersCount <= 0) {
      await this.redis.del(`group:${groupId}:members`);
      await this.redis.del(`group:${groupId}:count`);
    } else {
      this.server.to(groupId).emit('memberLeft', { memberId });
    }
  }

  // 멤버 정보 저장
  private async saveMemberInfo(
    memberId: string,
    memberInfo: Omit<MemberInfo, 'member_id'>,
  ): Promise<void> {
    await this.redis.hset(`member:${memberId}`, memberInfo);
  }

  // 멤버가 참여중인 그룹 조회
  private async findGroupByMemberId(memberId: string): Promise<string | null> {
    return await this.redis.get(`member:${memberId}:group`);
  }

  // 멤버리스트 정보 조회 (string[] => MemberInfo[])
  private async getMembersInfo(members: string[]): Promise<MemberInfo[]> {
    return Promise.all(
      members.map(async (memberId) => {
        const info: Record<string, string> = await this.redis.hgetall(
          `member:${memberId}`,
        );
        return {
          member_id: memberId,
          image_url: info.image_url || '',
          nickname: info.nickname || '',
          joinedAtUTC: info.joinedAtUTC,
        };
      }),
    );
  }
}
