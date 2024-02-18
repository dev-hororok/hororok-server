import { Exclude, Expose } from 'class-transformer';
import { RoleEntity } from '../entities/role.entity';
import { Member } from './member';

export class Account {
  account_id: string;

  email: string | null;

  @Exclude({ toPlainOnly: true })
  password?: string;

  @Expose({ groups: ['me', 'admin'] })
  provider: string;

  @Expose({ groups: ['me', 'admin'] })
  social_id?: string | null;

  role?: RoleEntity | null;

  member?: Member | null;

  created_at: Date;
  updated_at: Date;
  deleted_at: Date;
}
