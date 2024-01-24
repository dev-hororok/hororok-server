import { IsNumber } from 'class-validator';
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  OneToOne,
  JoinColumn,
} from 'typeorm';
import { Member } from './member.entity';
import { CommonEntity } from './common.entity';

@Entity()
export class Statistic extends CommonEntity {
  @PrimaryGeneratedColumn({ type: 'bigint' })
  statistic_id: number;

  @Column({ default: 0 })
  @IsNumber()
  total_time: number;

  @Column()
  @IsNumber()
  pay_egg_count: number;

  @OneToOne(() => Member, (member) => member.statistic, {
    onDelete: 'CASCADE',
    nullable: false,
  })
  @JoinColumn({ name: 'member_id' })
  member: Member;
}
