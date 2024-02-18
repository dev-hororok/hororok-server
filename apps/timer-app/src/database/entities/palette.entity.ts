import { IsString } from 'class-validator';
import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { CommonEntity } from './common.entity';
import { Palette } from '../domain/palette';
import { StudyStreakEntity } from './study-streak.entity';

@Entity({
  name: 'palette',
})
export class PaletteEntity extends CommonEntity implements Palette {
  @PrimaryGeneratedColumn()
  palette_id: number;

  @Column({ type: 'varchar', length: 20 })
  @IsString()
  grade: string;

  @Column({ type: 'varchar', length: 100 })
  @IsString()
  name: string;

  @Column({ type: 'varchar', length: 7 })
  @IsString()
  light_color: string;

  @Column({ type: 'varchar', length: 7 })
  @IsString()
  normal_color: string;

  @Column({ type: 'varchar', length: 7 })
  @IsString()
  dark_color: string;

  @Column({ type: 'varchar', length: 7 })
  @IsString()
  darker_color: string;

  @OneToMany(() => StudyStreakEntity, (studyStreak) => studyStreak.palette)
  study_streaks?: StudyStreakEntity[];
}
