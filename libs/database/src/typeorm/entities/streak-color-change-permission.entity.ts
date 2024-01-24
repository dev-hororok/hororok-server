import { IsNumber } from 'class-validator';
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  OneToOne,
  JoinColumn,
} from 'typeorm';
import { CommonEntity } from './common.entity';
import { Member } from './member.entity';

@Entity()
export class StreakColorChangePermission extends CommonEntity {
  @PrimaryGeneratedColumn({ type: 'bigint' })
  streak_color_change_permission_id: number;

  @Column()
  @IsNumber()
  available_change: number;

  @OneToOne(() => Member, (member) => member.streak_color_change_permission, {
    nullable: false,
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'member_id' })
  member: Member;
}
