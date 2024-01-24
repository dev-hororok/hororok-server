import { IsEnum, IsNumber, IsString } from 'class-validator';
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { CommonEntity } from './common.entity';
import { Member } from './member.entity';
import { TransactionType } from '../enums/transaction.enum';

@Entity()
export class TransactionRecord extends CommonEntity {
  @PrimaryGeneratedColumn({ type: 'bigint' })
  transaction_record_id: number;

  @Column({
    type: 'enum',
    enum: TransactionType,
  })
  @IsEnum(TransactionType)
  transaction_type: TransactionType;

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
