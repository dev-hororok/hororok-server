import { IsString } from 'class-validator';
import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';
import { DateEntity } from '../common/date.entity';

@Entity()
export class User extends DateEntity {
  @PrimaryGeneratedColumn('uuid')
  user_id: string;

  @Column({ type: 'varchar', length: 100 })
  @IsString()
  nickname: string;
}
