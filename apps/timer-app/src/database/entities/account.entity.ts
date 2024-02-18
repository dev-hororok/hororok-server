import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { AuthProvidersEnum } from '../../auth/auth-providers.enum';
import { RoleEntity } from './role.entity';
import { CommonEntity } from './common.entity';
import { Exclude, Expose } from 'class-transformer';
import { Account } from '../domain/account';
import { MemberEntity } from './member.entity';

@Entity({
  name: 'account',
})
export class AccountEntity extends CommonEntity implements Account {
  @PrimaryGeneratedColumn('uuid')
  account_id: string;

  @Column({ type: String, unique: true, nullable: true })
  email: string | null;

  @Column({ nullable: true })
  @Exclude({ toPlainOnly: true })
  password?: string;

  @Column({ default: AuthProvidersEnum.email })
  @Expose({ groups: ['me', 'admin'] })
  provider: string;

  @Index()
  @Column({ type: String, nullable: true })
  @Expose({ groups: ['me', 'admin'] })
  social_id?: string | null;

  @ManyToOne(() => RoleEntity, {
    eager: true,
  })
  @JoinColumn({ name: 'role_id' })
  role?: RoleEntity | null;

  @OneToOne(() => MemberEntity, (member) => member.account, {
    nullable: true,
  })
  member?: MemberEntity | null;
}
