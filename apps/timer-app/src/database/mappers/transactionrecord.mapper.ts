import { TransactionRecord } from '../domain/transaction-record';
import { TransactionRecordEntity } from '../entities/transaction-record.entity';
import { MemberMapper } from './member.mapper';

export class TransactionRecordMapper {
  static toDomain(raw: TransactionRecordEntity): TransactionRecord {
    const transactionRecord = new TransactionRecord();

    transactionRecord.transaction_record_id = raw.transaction_record_id;
    transactionRecord.transaction_type = raw.transaction_type;
    transactionRecord.amount = raw.amount;
    transactionRecord.count = raw.count;
    transactionRecord.balance_after_transaction = raw.balance_after_transaction;
    transactionRecord.notes = raw.notes;

    if (raw.member) {
      transactionRecord.member = MemberMapper.toDomain(raw.member);
    }

    transactionRecord.created_at = raw.created_at;
    transactionRecord.updated_at = raw.updated_at;
    transactionRecord.deleted_at = raw.deleted_at;
    return transactionRecord;
  }
}
