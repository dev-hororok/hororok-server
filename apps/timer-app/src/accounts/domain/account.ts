import { Exclude, Expose } from 'class-transformer';
import { Role } from '../../roles/domain/role';

export class Account {
  account_id: string;

  @Expose({ groups: ['me', 'admin'] })
  email: string | null;

  @Exclude({ toPlainOnly: true })
  password?: string;

  @Expose({ groups: ['me', 'admin'] })
  provider: string;

  @Expose({ groups: ['me', 'admin'] })
  social_id?: string | null;

  role?: Role | null;
  created_at: Date;
  updated_at: Date;
  deleted_at: Date;
}
