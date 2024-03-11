import { Expose } from 'class-transformer';
import { Member } from './member';

export class StudyRecord {
  study_record_id: number;
  member?: Member;
  status: string | null; // Completed, Incompleted
  start_time: Date;
  end_time: Date | null;

  @Expose({ groups: ['admin'] })
  deleted_at: Date;
}
