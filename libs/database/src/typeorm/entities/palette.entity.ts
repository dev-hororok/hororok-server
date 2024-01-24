import { IsEnum, IsString } from 'class-validator';
import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { StudyStreak } from './study-streak.entity';
import { CommonEntity } from './common.entity';
import { PaletteGrade } from '../enums/palette-grade.enum';

@Entity()
export class Palette extends CommonEntity {
  @PrimaryGeneratedColumn({ type: 'bigint' })
  palette_id: number;

  @Column({
    type: 'enum',
    enum: PaletteGrade,
    default: PaletteGrade.RARE,
  })
  @IsEnum(PaletteGrade)
  grade: PaletteGrade;

  @Column({ type: 'varchar', length: 100 })
  @IsString()
  name: string;

  @Column({ type: 'varchar', length: 16 })
  @IsString()
  light_color: string;

  @Column({ type: 'varchar', length: 16 })
  @IsString()
  normal_color: string;

  @Column({ type: 'varchar', length: 16 })
  @IsString()
  dark_color: string;

  @Column({ type: 'varchar', length: 16 })
  @IsString()
  darker_color: string;

  @OneToMany(() => StudyStreak, (studyStreak) => studyStreak.palette)
  study_streaks: StudyStreak[];
}
