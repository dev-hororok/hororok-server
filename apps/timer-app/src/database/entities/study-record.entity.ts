import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
  DeleteDateColumn,
} from 'typeorm';
import { IsDate, IsNotEmpty, IsString } from 'class-validator';
import { MemberEntity } from './member.entity';
import { StudyCategoryEntity } from './study-category.entity';
import { StudyRecord } from '../domain/study-record';

@Entity({
  name: 'study_record',
})
export class StudyRecordEntity implements StudyRecord {
  @PrimaryGeneratedColumn({ type: 'bigint' })
  study_record_id: number;

  @ManyToOne(() => MemberEntity, (member) => member.study_records, {
    nullable: false,
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'member_id' })
  member?: MemberEntity;

  @ManyToOne(
    () => StudyCategoryEntity,
    (studyCategory) => studyCategory.study_records,
  )
  @JoinColumn({ name: 'study_category_id' })
  study_category?: StudyCategoryEntity;

  @Column({ type: 'varchar', length: 20, nullable: true })
  @IsString()
  status: string | null; // Completed, Incompleted

  @Column({ type: 'datetime' })
  @IsDate()
  @IsNotEmpty()
  start_time: Date;

  @Column({ type: 'datetime', nullable: true })
  @IsDate()
  end_time!: Date | null;

  @DeleteDateColumn()
  @IsDate()
  deleted_at: Date;
}
