import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Exclude, Expose } from 'class-transformer';
import { Account } from '../../../domain/account';
import { RoleEntity } from 'apps/timer-app/src/roles/infrastructure/typeorm/role.entity';
import { CommonEntity } from 'apps/timer-app/src/database/entities/common.entity';
import { AuthProvidersEnum } from 'apps/timer-app/src/auth/auth-providers.enum';
import { Member } from 'apps/timer-app/src/database/entities/member.entity';

@Entity({
  name: 'account',
})
export class AccountEntity extends CommonEntity implements Account {
  @PrimaryGeneratedColumn('uuid')
  account_id: string;

  @Column({ type: String, unique: true, nullable: true })
  @Expose({ groups: ['me', 'admin'] })
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
  role?: RoleEntity | null;

  @OneToOne(() => Member, (member) => member.account, {
    nullable: true,
  })
  @JoinColumn({ name: 'member_id' })
  member?: Member;
}
