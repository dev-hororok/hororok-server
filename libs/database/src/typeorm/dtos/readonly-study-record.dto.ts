import {
  IsDate,
  IsNotEmpty,
  IsNumber,
  IsObject,
  IsString,
} from 'class-validator';
import { ReadOnlyStudyCategoryDto } from './readonly-study-category.dto';

export class ReadOnlyStudyRecordDto {
  @IsNumber()
  @IsNotEmpty()
  study_record_id: number;

  @IsNumber()
  @IsNotEmpty()
  duration: number;

  @IsString()
  @IsNotEmpty()
  member_id: string;

  @IsString()
  status: string | null;

  @IsDate()
  @IsNotEmpty()
  start_time: Date;

  @IsDate()
  end_time: Date | null;

  @IsObject()
  study_category: ReadOnlyStudyCategoryDto | null;
}
