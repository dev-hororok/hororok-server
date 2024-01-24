import { IsNumber, IsString } from 'class-validator';
import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';
import { CommonEntity } from './common.entity';

@Entity()
export class Probability extends CommonEntity {
  @PrimaryGeneratedColumn({ type: 'bigint' })
  probability_id: number;

  @Column({ type: 'varchar', length: 10 })
  @IsString()
  egg_grade: string;

  @Column({ type: 'varchar', length: 10 })
  @IsString()
  character_grade: string;

  @Column()
  @IsNumber()
  odds: number;
}
