import { ConfigService } from '@nestjs/config';
import {
  WebSocketGateway,
  SubscribeMessage,
  WebSocketServer,
  ConnectedSocket,
  MessageBody,
} from '@nestjs/websockets';
import Redis from 'ioredis';
import { Server, Socket } from 'socket.io';
import { AllConfigType } from '../config/config.type';
import { v4 as uuidv4 } from 'uuid';
import { MembersService } from '../members/services/members.service';

interface MemberInfo {
  image_url: string;
  nickname: string;
}

@WebSocketGateway()
export class StudyGroupGateway {
  @WebSocketServer()
  server: Server;
  private redisClient: Redis;

  constructor(
    private configService: ConfigService<AllConfigType>,
    private readonly membersService: MembersService,
  ) {
    this.redisClient = new Redis({
      host: this.configService.get('redis.host', { infer: true }),
      port: this.configService.get('redis.port', { infer: true }),
    });
  }

  @SubscribeMessage('joinGroup')
  async handleJoinGroup(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: { memberId: string },
  ) {
    const member = await this.membersService.findOneByIdOrFail(data.memberId);
    // 멤버 정보를 Redis에 저장
    await this.saveMemberInfo(member.member_id, {
      image_url: member.image_url || '',
      nickname: member.nickname,
    });

    let groupId = await this.findAvailableGroup();
    if (!groupId) {
      groupId = await this.createGroupWithFirstMember(member.member_id);
    } else {
      await this.redisClient.sadd(`group:${groupId}:members`, member.member_id);
    }
    const members = await this.redisClient.smembers(`group:${groupId}:members`);
    client.join(groupId);

    // 새 멤버 정보를 그룹의 모든 기존 멤버들에게 방송
    this.server.to(groupId).emit('newMember', {
      memberId: member.member_id,
      image_url: member.image_url,
      nickname: member.nickname,
    });

    // 새 멤버에게만 현재 그룹의 모든 유저 목록을 발송
    const membersInfo = await Promise.all(
      members.map(async (memberId) => {
        const info = await this.redisClient.hgetall(`member:${memberId}`);
        return { memberId, ...info };
      }),
    );

    client.emit('groupInfo', {
      groupId,
      members: membersInfo,
    });
  }

  // 8명 미만인 그룹 찾기
  private async findAvailableGroup(): Promise<string | null> {
    const groups = await this.redisClient.keys('group:*:members');
    for (const groupKey of groups) {
      const membersCount = await this.redisClient.scard(groupKey);
      if (membersCount < 8) {
        return groupKey.split(':')[1];
      }
    }
    return null;
  }

  // 새 그룹을 만들면서 멤버 추가
  private async createGroupWithFirstMember(memberId: string): Promise<string> {
    const newGroupId = `group:${uuidv4()}`;
    await this.redisClient.sadd(`${newGroupId}:members`, memberId); // 첫 번째 멤버와 함께 새 그룹 생성
    return newGroupId.split(':')[1];
  }

  // 멤버 정보를 Redis에 저장하는 메서드
  private async saveMemberInfo(
    memberId: string,
    memberInfo: MemberInfo,
  ): Promise<void> {
    await this.redisClient.hset(`member:${memberId}`, memberInfo);
  }
}
