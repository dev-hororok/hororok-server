import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { QueryRunner } from 'typeorm';
import * as crypto from 'crypto';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';
import { JwtPayloadType } from '../../auth/strategies/types/jwt-payload';
import { Member } from '../../database/domain/member';
import { EntityCondition } from '../../utils/types/entity-condition.type';
import { MemberRepository } from '../repositories/member.repository.interface';
import { NullableType } from '../../utils/types/nullable.type';

@Injectable()
export class MembersService {
  constructor(
    private readonly membersRepository: MemberRepository,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
  ) {}

  async findAll(
    options?: EntityCondition<Member>,
    queryRunner?: QueryRunner,
  ): Promise<Member[]> {
    return this.membersRepository.findAll(options, queryRunner);
  }

  async findOne(
    options?: EntityCondition<Member>,
    queryRunner?: QueryRunner,
  ): Promise<Member | null> {
    return this.membersRepository.findOne(options, queryRunner);
  }

  /** 캐싱: `member_${memberId}` */
  async findOneById(memberId: string, queryRunner?: QueryRunner) {
    const cacheKey = `member_${memberId}`;
    const cache = await this.getCachedMember(cacheKey);
    if (cache) return cache;

    const member = await this.membersRepository.findOneById(
      memberId,
      queryRunner,
    );
    if (member) {
      await this.setCachedMember(cacheKey, member, 3000);
    }

    return member;
  }
  /** 캐싱: `member_${memberId}` */
  async findOneByIdOrFail(memberId: string, queryRunner?: QueryRunner) {
    const member = await this.findOneById(memberId, queryRunner);
    if (!member) {
      throw new NotFoundException('유저가 존재하지 않습니다.');
    }
    return member;
  }
  /** 캐싱: account-member_${accountId} */
  async findOneByAccountId(accountId: string, queryRunner?: QueryRunner) {
    const cacheKey = `account-member_${accountId}`;
    const cache = await this.getCachedMember(cacheKey);
    if (cache) return cache;

    const member = await this.membersRepository.findOneByAccountId(
      accountId,
      queryRunner,
    );
    if (member) {
      await this.setCachedMember(cacheKey, member, 3000);
    }

    return member;
  }
  /** 캐싱: account-member_${accountId} */
  async findOneByAccountIdOrFail(accountId: string, queryRunner?: QueryRunner) {
    const member = await this.findOneByAccountId(accountId, queryRunner);
    if (!member) {
      throw new NotFoundException('유저가 존재하지 않습니다.');
    }
    return member;
  }

  async create(
    jwtPayload: JwtPayloadType,
    queryRunner?: QueryRunner,
  ): Promise<Member> {
    const newMember = this.membersRepository.create(
      jwtPayload.sub,
      {
        email: jwtPayload.email || '',
        nickname: crypto.randomBytes(10).toString('hex'),
        image_url: '',
        point: 500,
        active_record_id: null,
      },
      queryRunner,
    );
    return newMember;
  }

  async update(
    id: string,
    member: Partial<Member>,
    queryRunner?: QueryRunner,
  ): Promise<NullableType<Member>> {
    const result = await this.membersRepository.update(id, member, queryRunner);
    await this.cacheManager.del(`member_${id}`);
    return result;
  }

  async delete(id: string, queryRunner?: QueryRunner): Promise<void> {
    await this.cacheManager.del(`member_${id}`);
    await this.membersRepository.softDelete(id, queryRunner);
  }

  /** 유저의 현재 공부중인 테이블 필드를 비워줌 */
  async clearActiveRecordId(
    memberId: string,
    queryRunner?: QueryRunner,
  ): Promise<NullableType<Member>> {
    const result = await this.membersRepository.update(
      memberId,
      {
        active_record_id: null,
      },
      queryRunner,
    );
    await this.cacheManager.del(`member_${memberId}`);
    return result;
  }

  /** 유저의 activeRecord 필드를 업데이트 시켜줌 */
  async updateActiveRecordId(
    memberId: string,
    activeRecordId: number,
    queryRunner?: QueryRunner,
  ): Promise<NullableType<Member>> {
    const result = await this.membersRepository.update(
      memberId,
      {
        active_record_id: activeRecordId,
      },
      queryRunner,
    );
    await this.cacheManager.del(`member_${memberId}`);
    return result;
  }

  // **** 캐시관련 ****

  private async getCachedMember(key: string): Promise<Member | null> {
    const cachedMember = await this.cacheManager.get<Member>(key);
    if (cachedMember) {
      console.log('캐시에서 조회:', key);
      return cachedMember;
    }
    return null;
  }

  private async setCachedMember(
    key: string,
    member: Member,
    ttl: number = 3000,
  ): Promise<void> {
    await this.cacheManager.set(key, member, ttl);
  }

  /** 해당 캐시키에 새 멤버로 값을 업데이트 */
  async updateMemberCache(key: string, member: Member) {
    await this.cacheManager.set(key, member);
  }
}
