import { Injectable, NotFoundException } from '@nestjs/common';
import { QueryRunner } from 'typeorm';
import * as crypto from 'crypto';
import { JwtPayloadType } from '../../auth/strategies/types/jwt-payload';
import { Member } from '../../database/domain/member';
import { EntityCondition } from '../../utils/types/entity-condition.type';
import { MemberRepository } from '../repositories/member.repository.interface';
import { NullableType } from '../../utils/types/nullable.type';
import { STATUS_MESSAGES } from '../../utils/constants';

@Injectable()
export class MembersService {
  constructor(private readonly membersRepository: MemberRepository) {}

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

  async findOneById(memberId: string, queryRunner?: QueryRunner) {
    const member = await this.membersRepository.findOneById(
      memberId,
      queryRunner,
    );

    return member;
  }
  async findOneByIdOrFail(memberId: string, queryRunner?: QueryRunner) {
    const member = await this.findOneById(memberId, queryRunner);
    if (!member) {
      throw new NotFoundException(STATUS_MESSAGES.MEMBER.MEMBER_NOT_FOUND);
    }
    return member;
  }
  async findOneByAccountId(accountId: string, queryRunner?: QueryRunner) {
    const member = await this.membersRepository.findOneByAccountId(
      accountId,
      queryRunner,
    );

    return member;
  }
  async findOneByAccountIdOrFail(accountId: string, queryRunner?: QueryRunner) {
    const member = await this.findOneByAccountId(accountId, queryRunner);
    if (!member) {
      throw new NotFoundException(STATUS_MESSAGES.MEMBER.MEMBER_NOT_FOUND);
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
        status_message: '',
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
    id: Member['member_id'],
    member: Partial<Member>,
    queryRunner?: QueryRunner,
  ): Promise<NullableType<Member>> {
    const result = await this.membersRepository.update(id, member, queryRunner);
    return result;
  }

  async softDelete(
    id: Member['member_id'],
    queryRunner?: QueryRunner,
  ): Promise<void> {
    await this.membersRepository.softDelete(id, queryRunner);
  }

  /** 유저의 현재 공부중인 테이블 필드를 비워줌 */
  async clearActiveRecordId(
    id: Member['member_id'],
    queryRunner?: QueryRunner,
  ): Promise<NullableType<Member>> {
    const result = await this.membersRepository.update(
      id,
      {
        active_record_id: null,
      },
      queryRunner,
    );
    return result;
  }

  /** 유저의 activeRecord 필드를 업데이트 시켜줌 */
  async updateActiveRecordId(
    id: Member['member_id'],
    activeRecordId: number,
    queryRunner?: QueryRunner,
  ): Promise<NullableType<Member>> {
    const result = await this.membersRepository.update(
      id,
      {
        active_record_id: activeRecordId,
      },
      queryRunner,
    );
    return result;
  }
}
