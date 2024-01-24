import { IsNumber } from 'class-validator';
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { CommonEntity } from './common.entity';
import { Member } from './member.entity';
import { StudyCategory } from './study-category.entity';

@Entity()
export class StudyRecord extends CommonEntity {
  @PrimaryGeneratedColumn({ type: 'bigint' })
  study_record_id: number;

  @Column()
  @IsNumber()
  duration: number;

  @ManyToOne(() => Member, (member) => member.study_categories, {
    nullable: false,
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'member_id' })
  member: Member;

  @ManyToOne(
    () => StudyCategory,
    (studyCategory) => studyCategory.study_records,
    { nullable: false },
  )
  @JoinColumn({ name: 'study_category_id' })
  study_category: StudyCategory;
}
