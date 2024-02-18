import { Expose } from 'class-transformer';
import { Member } from './member';

export class TransactionRecord {
  transaction_record_id: number;
  transaction_type: string; // Purchase, Sell, Reward
  amount: number;
  count: number;
  balance_after_transaction: number;
  notes: string;
  member?: Member;

  @Expose({ groups: ['admin'] })
  created_at: Date;
  @Expose({ groups: ['admin'] })
  updated_at: Date;
  @Expose({ groups: ['admin'] })
  deleted_at: Date;
}
