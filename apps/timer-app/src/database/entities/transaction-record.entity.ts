import { IsNumber, IsString } from 'class-validator';
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { CommonEntity } from './common.entity';
import { TransactionRecord } from '../domain/transaction';
import { MemberEntity } from './member.entity';

@Entity({
  name: 'transaction_record',
})
export class TransactionRecordEntity
  extends CommonEntity
  implements TransactionRecord
{
  @PrimaryGeneratedColumn({ type: 'bigint' })
  transaction_record_id: number;

  @Column({ type: 'varchar', length: 20 })
  @IsString()
  transaction_type: string; // Purchase, Sell, Reward

  @Column()
  @IsNumber()
  amount: number;

  @Column()
  @IsNumber()
  count: number;

  @Column()
  @IsNumber()
  balance_after_transaction: number;

  @Column()
  @IsString()
  notes: string;

  @ManyToOne(() => MemberEntity, (member) => member.transaction_records, {
    nullable: false,
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'member_id' })
  member?: MemberEntity;
}
