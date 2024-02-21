import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindOptionsWhere, QueryRunner, Repository } from 'typeorm';
import { MemberRepository } from '../member.repository.interface';
import { MemberEntity } from 'apps/timer-app/src/database/entities/member.entity';
import { Member } from 'apps/timer-app/src/database/domain/member';
import { EntityCondition } from 'apps/timer-app/src/utils/types/entity-condition.type';
import { MemberMapper } from 'apps/timer-app/src/database/mappers/member.mapper';
import { NullableType } from 'apps/timer-app/src/utils/types/nullable.type';
import { Account } from 'apps/timer-app/src/database/domain/account';

@Injectable()
export class TypeOrmMemberRepository implements MemberRepository {
  constructor(
    @InjectRepository(MemberEntity)
    private memberRepository: Repository<MemberEntity>,
  ) {}

  /** queryRunner 여부에 따라 member Repository를 생성 */
  private getRepository(queryRunner?: QueryRunner): Repository<MemberEntity> {
    return queryRunner
      ? queryRunner.manager.getRepository(MemberEntity)
      : this.memberRepository;
  }

  async findAll(
    options?: EntityCondition<Member>,
    queryRunner?: QueryRunner | undefined,
  ): Promise<Member[]> {
    const repository = this.getRepository(queryRunner);

    const entities = await repository.find({
      where: options as FindOptionsWhere<MemberEntity>,
    });

    return entities.map((n) => MemberMapper.toDomain(n));
  }
  async findOne(
    options?: EntityCondition<Member>,
    queryRunner?: QueryRunner | undefined,
  ): Promise<NullableType<Member>> {
    const repository = this.getRepository(queryRunner);

    const entity = await repository.findOne({
      where: options as FindOptionsWhere<MemberEntity>,
    });

    return entity ? MemberMapper.toDomain(entity) : null;
  }

  async findOneById(
    id: Member['member_id'],
    queryRunner?: QueryRunner | undefined,
  ): Promise<NullableType<Member>> {
    const repository = this.getRepository(queryRunner);

    const entity = await repository.findOne({
      where: {
        member_id: id,
      },
    });

    return entity ? MemberMapper.toDomain(entity) : null;
  }

  async findOneByAccountId(
    accountId: Account['account_id'],
    queryRunner?: QueryRunner | undefined,
  ): Promise<NullableType<Member>> {
    const repository = this.getRepository(queryRunner);

    const entity = await repository.findOne({
      where: {
        account: {
          account_id: accountId,
        },
      },
    });

    return entity ? MemberMapper.toDomain(entity) : null;
  }

  async create(
    accountId: string,
    data: Omit<
      Member,
      'member_id' | 'created_at' | 'updated_at' | 'deleted_at'
    >,
    queryRunner?: QueryRunner | undefined,
  ): Promise<Member> {
    const repository = this.getRepository(queryRunner);
    const newEntity = await repository.save(
      repository.create({
        account: {
          account_id: accountId,
        },
        ...data,
      }),
    );
    return MemberMapper.toDomain(newEntity);
  }

  async update(
    id: Member['member_id'],
    payload: Partial<Member>,
    queryRunner?: QueryRunner,
  ): Promise<NullableType<Member>> {
    const repository = this.getRepository(queryRunner);
    const entity = await repository.findOne({
      where: { member_id: id },
      relations: { account: true }, // account-member 캐시 초기화를 위함
    });

    if (!entity) {
      throw new NotFoundException('멤버를 찾을 수 없습니다.');
    }

    const updatedEntity = await repository.save(
      repository.create(
        MemberMapper.toPersistence({
          ...MemberMapper.toDomain(entity),
          ...payload,
        }),
      ),
    );

    return MemberMapper.toDomain(updatedEntity);
  }

  async softDelete(
    id: Account['account_id'],
    queryRunner?: QueryRunner,
  ): Promise<void> {
    const repository = this.getRepository(queryRunner);
    await repository.softDelete(id);
  }
}
