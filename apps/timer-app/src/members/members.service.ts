import { JWTPayload } from '@app/auth';
import { Member } from '@app/database/typeorm/entities/member.entity';
import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import * as crypto from 'crypto';
import { AccountRole } from '@app/database/common/enums/account-role.enum';
import { TimerAppMemberRole } from '@app/database/typeorm/enums/timer-app-member-role.enum';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class MembersService {
  constructor(
    @InjectRepository(Member)
    private memberRepository: Repository<Member>,
  ) {}

  async findAll(): Promise<Member[]> {
    return this.memberRepository.find();
  }

  async findOne(id: string): Promise<Member> {
    return this.memberRepository.findOne({ where: { member_id: id } });
  }

  async findOneByAccountId(accountId: string): Promise<Member> {
    return this.memberRepository.findOne({ where: { account_id: accountId } });
  }

  async create(jwtToken: JWTPayload): Promise<Member> {
    const newMember = this.memberRepository.create({
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
    return this.memberRepository.save(newMember);
  }

  async update(id: string, Member: Partial<Member>): Promise<Member> {
    await this.memberRepository.update(id, Member);
    return this.memberRepository.findOne({ where: { member_id: id } });
  }

  async delete(id: string): Promise<void> {
    await this.memberRepository.delete(id);
  }
}
