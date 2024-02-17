import { IsNumber, IsString } from 'class-validator';
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { CommonEntity } from './common.entity';
import { Member } from './member.entity';

@Entity()
export class TransactionRecord extends CommonEntity {
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

  @ManyToOne(() => Member, (member) => member.transaction_records, {
    nullable: false,
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'member_id' })
  member: Member;
}
