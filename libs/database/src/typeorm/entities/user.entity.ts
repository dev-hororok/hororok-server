import { CommonEntity } from '@app/database/typeorm/entities/common.entity';
import { IsString } from 'class-validator';
import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class User extends CommonEntity {
  @PrimaryGeneratedColumn('uuid')
  user_id: string;

  @Column({ type: 'varchar', length: 100 })
  @IsString()
  nickname: string;
}
