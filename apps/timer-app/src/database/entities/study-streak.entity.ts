import { IsNumber } from 'class-validator';
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  OneToOne,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { CommonEntity } from './common.entity';
import { StudyStreak } from '../domain/study-streak';
import { MemberEntity } from './member.entity';
import { PaletteEntity } from './palette.entity';

@Entity({
  name: 'study_streak',
})
export class StudyStreakEntity extends CommonEntity implements StudyStreak {
  @PrimaryGeneratedColumn()
  study_streak_id: number;

  @Column()
  @IsNumber()
  current_streak: number;

  @Column()
  @IsNumber()
  longest_streak: number;

  @OneToOne(() => MemberEntity, (member) => member.study_streak, {
    nullable: false,
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'member_id' })
  member?: MemberEntity;

  @ManyToOne(
    () => PaletteEntity,
    (palette) => {
      palette.study_streaks;
    },
  )
  @JoinColumn({ name: 'palette_id' })
  palette?: PaletteEntity;
}
