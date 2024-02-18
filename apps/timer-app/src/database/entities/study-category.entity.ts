import { IsString } from 'class-validator';
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  OneToMany,
  JoinColumn,
  DeleteDateColumn,
} from 'typeorm';
import { StudyCategory } from '../domain/study-category';
import { MemberEntity } from './member.entity';
import { StudyRecordEntity } from './study-record.entity';

@Entity({
  name: 'study_category',
})
export class StudyCategoryEntity implements StudyCategory {
  @PrimaryGeneratedColumn({ type: 'bigint' })
  study_category_id: number;

  @Column({ type: 'varchar', length: 50 })
  @IsString()
  subject: string;

  @Column({ type: 'varchar', length: 7, default: '#000000' })
  @IsString()
  color: string;

  @ManyToOne(() => MemberEntity, (member) => member.study_categories, {
    nullable: false,
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'member_id' })
  member?: MemberEntity;

  @OneToMany(
    () => StudyRecordEntity,
    (studyRecord) => studyRecord.study_category,
  )
  study_records?: StudyRecordEntity[];

  @DeleteDateColumn()
  deleted_at: Date;
}
