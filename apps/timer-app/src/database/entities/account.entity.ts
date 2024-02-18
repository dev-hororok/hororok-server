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
import { Member } from './member.entity';

@Entity()
export class Account extends CommonEntity {
  @PrimaryGeneratedColumn('uuid')
  account_id: string;

  @Column({ type: String, unique: true, nullable: true })
  email: string | null;

  @Column({ nullable: true })
  password?: string;

  @Column({ default: AuthProvidersEnum.email })
  provider: string;

  @Index()
  @Column({ type: String, nullable: true })
  social_id?: string | null;

  @ManyToOne(() => RoleEntity, {
    eager: true,
  })
  @JoinColumn({ name: 'role_id' })
  role?: RoleEntity | null;

  @OneToOne(() => Member, (member) => member.account, {
    nullable: true,
  })
  member?: Member;
}
