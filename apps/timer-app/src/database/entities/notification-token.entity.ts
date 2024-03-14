import { IsNumber, IsString } from 'class-validator';
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { NotificationToken } from '../domain/notification-token';
import { MemberEntity } from './member.entity';

@Entity({
  name: 'notification_token',
})
export class NotificationTokenEntity implements NotificationToken {
  @PrimaryGeneratedColumn()
  @IsNumber()
  notification_token_id: number;

  @Column()
  @IsString()
  notification_token: string;

  @Column({
    default: 'Active',
  })
  @IsString()
  status: string; // Active, Inactive

  @Column()
  @IsString()
  device_type: string;

  @ManyToOne(() => MemberEntity, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'member_id', referencedColumnName: 'member_id' })
  member?: MemberEntity;

  @Column()
  last_used_at: Date;
}
