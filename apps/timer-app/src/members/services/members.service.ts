import { JWTPayload } from '@app/auth';
import { Member } from '@app/database/typeorm/entities/member.entity';
import { Inject, Injectable } from '@nestjs/common';
import {
  FindManyOptions,
  FindOneOptions,
  QueryRunner,
  Repository,
} from 'typeorm';
import * as crypto from 'crypto';
import { AccountRole } from '@app/database/common/enums/account-role.enum';
import { TimerAppMemberRole } from '@app/database/typeorm/enums/timer-app-member-role.enum';
import { InjectRepository } from '@nestjs/typeorm';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';

@Injectable()
export class MembersService {
  constructor(
    @InjectRepository(Member)
    private memberRepository: Repository<Member>,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
  ) {}

  async findAll(options?: FindManyOptions<Member>): Promise<Member[]> {
    return this.memberRepository.find(options);
  }

  async findOne(
    options: FindOneOptions<Member>,
    queryRunner?: QueryRunner,
  ): Promise<Member | null> {
    const cacheKey = `member_${JSON.stringify(options)}`;
    let member = await this.cacheManager.get<Member | null>(cacheKey);

    if (member) {
      console.log('캐시에서 조회', cacheKey);
      return member;
    }

    if (queryRunner) {
      member = await queryRunner.manager.findOne(Member, options);
    } else {
      member = await this.memberRepository.findOne(options);
    }
    await this.cacheManager.set(cacheKey, member, 300);

    return member;
  }

  async create(
    jwtToken: JWTPayload,
    queryRunner?: QueryRunner,
  ): Promise<Member> {
    const repository = queryRunner
      ? queryRunner.manager.getRepository(Member)
      : this.memberRepository;

    const newMember = repository.create({
      account_id: jwtToken.sub,
      email: jwtToken.email,
      nickname: crypto.randomBytes(10).toString('hex'),
      image_url: '',
      point: 0,
      role:
        jwtToken.role === AccountRole.ADMIN
          ? TimerAppMemberRole.ADMIN
          : TimerAppMemberRole.USER,
    });
    await this.memberRepository.insert(newMember);
    return newMember;
  }

  async update(
    id: string,
    member: Partial<Member>,
    queryRunner?: QueryRunner,
  ): Promise<boolean> {
    const repository = queryRunner
      ? queryRunner.manager.getRepository(Member)
      : this.memberRepository;
    const result = await repository.update(id, member);
    return result.affected ? 0 < result.affected : false;
  }

  async delete(id: string): Promise<void> {
    await this.memberRepository.delete(id);
  }
}
