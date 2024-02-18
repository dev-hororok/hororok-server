import { Member } from './member';

export class TransactionRecord {
  transaction_record_id: number;
  transaction_type: string; // Purchase, Sell, Reward
  amount: number;
  count: number;
  balance_after_transaction: number;
  notes: string;
  member?: Member;

  created_at: Date;
  updated_at: Date;
  deleted_at: Date;
}
