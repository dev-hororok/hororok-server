import { Expose } from 'class-transformer';
import { Member } from './member';
import { StudyCategory } from './study-category';

export class StudyRecord {
  study_record_id: number;
  member?: Member;
  study_category?: StudyCategory;
  status: string | null; // Completed, Incompleted
  start_time: Date;
  end_time: Date | null;

  @Expose({ groups: ['admin'] })
  deleted_at: Date;
}
