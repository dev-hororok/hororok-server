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

  @Expose({ groups: ['me', 'admin'] })
  created_at: Date;
  @Expose({ groups: ['admin'] })
  updated_at: Date;
  @Expose({ groups: ['admin'] })
  deleted_at: Date;
}
