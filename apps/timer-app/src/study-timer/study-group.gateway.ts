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
import { AllConfigType } from '../config/config.type';
import { v4 as uuidv4 } from 'uuid';
import { MembersService } from '../members/services/members.service';
import { JwtService } from '@nestjs/jwt';
import { JwtPayloadType } from '../auth/strategies/types/jwt-payload';

interface MemberInfo {
  image_url: string;
  nickname: string;
}

// (string)  group:{groupId}:count      - 현재 그룹 인원 (number)
// (set)     group:{groupId}:members    - 그룹에 참여중인 멤버의 id 배열 (string[])
// (string)  member:{member_id}:group   - 해당 멤버가 참여중인 그룹
// (hash)    member:{memberId}          - 멤버정보(MemberInfo)

@WebSocketGateway()
export class StudyGroupGateway implements OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;
  private redisClient: Redis;

  constructor(
    private configService: ConfigService<AllConfigType>,
    private readonly jwtService: JwtService,
    private readonly membersService: MembersService,
  ) {
    this.redisClient = new Redis({
      host: this.configService.get('redis.host', { infer: true }),
      port: this.configService.get('redis.port', { infer: true }),
    });
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
  }

  // jwtToken으로 멤버를 조회하여 8명 미만인 그룹에 참여
  //
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

      // 멤버 정보를 Redis에 저장
      await this.saveMemberInfo(member.member_id, {
        image_url: member.image_url || '',
        nickname: member.nickname,
      });

      let groupId = await this.findAvailableGroup();
      if (!groupId) {
        groupId = await this.createGroupWithFirstMember(member.member_id);
      } else {
        await this.addMemberToGroup(member.member_id, groupId);
      }
      client.join(groupId);

      // 멤버가 참여한 그룹 ID를 저장
      await this.redisClient.set(`member:${member.member_id}:group`, groupId);

      // 새 멤버 정보를 그룹의 모든 기존 멤버들에게 방송
      this.server.to(groupId).emit('newMember', {
        memberId: member.member_id,
        image_url: member.image_url,
        nickname: member.nickname,
      });

      // 새 멤버에게만 현재 그룹의 모든 유저 목록을 발송
      const members = await this.redisClient.smembers(
        `group:${groupId}:members`,
      );
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
    const groupCounts = await this.redisClient.keys('group:*:count');
    for (const countKey of groupCounts) {
      const membersCount = (await this.redisClient.get(countKey)) || '0';
      if (parseInt(membersCount, 10) < 8) {
        return countKey.split(':')[1];
      }
    }
    return null;
  }

  // 새 그룹 생성(uuid) 및 멤버 추가
  private async createGroupWithFirstMember(memberId: string): Promise<string> {
    const groupId = `group:${uuidv4()}`;
    await this.addMemberToGroup(memberId, groupId);
    return groupId.split(':')[1];
  }

  // 그룹에 멤버 추가
  private async addMemberToGroup(
    memberId: string,
    groupId: string,
  ): Promise<void> {
    await this.redisClient.sadd(`group:${groupId}:members`, memberId);
    await this.redisClient.incr(`group:${groupId}:count`); // incr은 해당 키가 없으면 자동으로 0을 할당 후 1을 증가시킴
  }

  // 그룹에서 멤버 제거 및 memberLeft broadcast
  private async removeMemberFromGroup(
    memberId: string,
    groupId: string,
  ): Promise<void> {
    await this.redisClient.srem(`group:${groupId}:members`, memberId);
    const membersCount = await this.redisClient.decr(`group:${groupId}:count`);
    if (membersCount <= 0) {
      await this.redisClient.del(`group:${groupId}:members`);
      await this.redisClient.del(`group:${groupId}:count`);
    } else {
      this.server.to(groupId).emit('memberLeft', { memberId });
    }
  }

  // 멤버 정보 저장
  private async saveMemberInfo(
    memberId: string,
    memberInfo: MemberInfo,
  ): Promise<void> {
    await this.redisClient.hset(`member:${memberId}`, memberInfo);
  }

  // 멤버가 참여중인 그룹 조회
  private async findGroupByMemberId(memberId: string): Promise<string | null> {
    return await this.redisClient.get(`member:${memberId}:group`);
  }

  // 멤버리스트 정보 조회 (string[] => MemberInfo[])
  private async getMembersInfo(members: string[]): Promise<MemberInfo[]> {
    return Promise.all(
      members.map(async (memberId) => {
        const info: Record<string, string> = await this.redisClient.hgetall(
          `member:${memberId}`,
        );
        return {
          image_url: info.image_url || '',
          nickname: info.nickname || '',
        };
      }),
    );
  }
}
