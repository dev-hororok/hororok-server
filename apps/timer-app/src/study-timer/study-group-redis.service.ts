import { InjectRedis } from '@nestjs-modules/ioredis';
import { Injectable } from '@nestjs/common';
import { Redis } from 'ioredis';
import { v4 as uuidv4 } from 'uuid';
import { type Member } from '../database/domain/member';

// (string)  group:{groupId}:count      - 현재 그룹 인원 (number)
// (set)     group:{groupId}:members    - 그룹에 참여중인 멤버의 id 배열 (string[])
// (string)  member:{memberId}:group   - 해당 멤버가 참여중인 그룹
// (hash)    member:{memberId}          - 멤버정보(MemberInfo)

interface MemberInfo {
  member_id: Member['member_id'];
  image_url: Member['image_url'];
  nickname: Member['nickname'];
  joinedAtUTC: string;
}

@Injectable()
export class StudyGroupRedisService {
  constructor(@InjectRedis() private readonly redis: Redis) {}

  // 그룹에 멤버 추가
  async addMemberToGroup(memberId: string, groupId: string): Promise<void> {
    await this.redis.set(`member:${memberId}:group`, groupId);
    await this.redis.sadd(`group:${groupId}:members`, memberId);
    await this.redis.incr(`group:${groupId}:count`); // incr은 해당 키가 없으면 자동으로 0을 할당 후 1을 증가시킴
  }

  // 그룹에서 멤버 제거하고 남은 멤버 수를 반환
  async removeMemberFromGroup(
    memberId: string,
    groupId: string,
  ): Promise<number> {
    await this.redis.srem(`group:${groupId}:members`, memberId);
    const membersCount = await this.redis.decr(`group:${groupId}:count`);
    if (membersCount <= 0) {
      await this.redis.del(`group:${groupId}:members`);
      await this.redis.del(`group:${groupId}:count`);
      return 0;
    }
    return membersCount;
  }

  // 멤버가 속한 그룹 ID 조회
  async findGroupByMemberId(memberId: string): Promise<string | null> {
    return this.redis.get(`member:${memberId}:group`);
  }

  // 멤버 정보 저장
  async saveMemberInfo(
    memberId: string,
    memberInfo: MemberInfo,
  ): Promise<void> {
    await this.redis.hset(`member:${memberId}`, memberInfo);
  }

  // 특정 그룹의 모든 멤버 정보 조회
  async getMembersInfo(groupId: string) {
    const memberIds = await this.redis.smembers(`group:${groupId}:members`);
    const membersInfoPromises = memberIds.map(async (memberId) => {
      const info = await this.redis.hgetall(`member:${memberId}`);
      return info;
    });

    const membersInfo = await Promise.all(membersInfoPromises);
    // null 값 제거
    const filteredMembersInfo = membersInfo.filter((info) => info !== null);
    return filteredMembersInfo;
  }

  // 스터디 그룹 생성 및 첫 멤버 추가
  async createGroupWithFirstMember(memberId: string): Promise<string> {
    const groupId = uuidv4(); // 새로운 그룹 ID 생성
    await this.addMemberToGroup(memberId, groupId);
    return groupId;
  }

  // maxGroupMembers명 미만인 그룹 찾기
  async findAvailableGroup(maxGroupMembers: number): Promise<string | null> {
    const groupCounts = await this.redis.keys('group:*:count');
    for (const countKey of groupCounts) {
      const membersCount = await this.redis.get(countKey);
      if (membersCount && parseInt(membersCount, 10) < maxGroupMembers) {
        // 'group:xyz:count'에서 'xyz'를 추출
        return countKey.split(':')[1];
      }
    }
    return null;
  }

  // ** 어드민 기능 **

  async getAllGroups(): Promise<{ id: string; memberIds: string[] }[]> {
    const groupKeys = await this.redis.keys('group:*:members');

    const allGroups: { id: string; memberIds: string[] }[] = [];
    for (const countKey of groupKeys) {
      const members = await this.redis.smembers(countKey);
      const groupId = countKey.split(':')[1];
      allGroups.push({ id: groupId, memberIds: members });
    }

    return allGroups;
  }

  // 스터디 그룹과 관련된 모든 데이터 제거
  async removeAllGroupsData(): Promise<void> {
    // group, member 관련 key를 찾아서 삭제
    const groupKeys = await this.redis.keys('group:*');
    const memberKeys = await this.redis.keys('member:*');
    await Promise.all(
      [...groupKeys, ...memberKeys].map((key) => this.redis.del(key)),
    );
  }

  async removeGroupById(id: string): Promise<void> {
    const memberIds = await this.redis.smembers(`group:${id}:members`);

    await Promise.all(
      memberIds.map((memberId) => this.redis.del(`members:${memberId}:group`)),
    );
    await Promise.all(
      memberIds.map((memberId) => this.redis.del(`members:${memberId}`)),
    );

    await this.redis.del(`group:${id}:members`);
    await this.redis.del(`group:${id}:count`);
  }
}
