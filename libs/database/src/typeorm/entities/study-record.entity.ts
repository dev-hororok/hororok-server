import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
  DeleteDateColumn,
  RelationId,
} from 'typeorm';
import { Member } from './member.entity';
import { StudyCategory } from './study-category.entity';
import { IsDate, IsNotEmpty, IsString } from 'class-validator';

@Entity()
export class StudyRecord {
  @PrimaryGeneratedColumn({ type: 'bigint' })
  study_record_id: number;

  @ManyToOne(() => Member, (member) => member.study_records, {
    nullable: false,
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'member_id' })
  member: Member;

  @RelationId((self: StudyRecord) => self.member)
  @IsString()
  @IsNotEmpty()
  member_id: string;

  @ManyToOne(
    () => StudyCategory,
    (studyCategory) => studyCategory.study_records,
  )
  @JoinColumn({ name: 'study_category_id' })
  study_category: StudyCategory;

  @Column({ type: 'varchar', length: 20, nullable: true })
  @IsString()
  status: string | null; // Completed, Incompleted

  @Column()
  @IsDate()
  @IsNotEmpty()
  start_time: Date;

  @Column({ nullable: true })
  @IsDate()
  end_time: Date | null;

  @DeleteDateColumn()
  @IsDate()
  deleted_at!: Date | null;
}
