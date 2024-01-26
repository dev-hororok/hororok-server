import { IsDate, IsNotEmpty, IsNumber, IsObject } from 'class-validator';
import { ReadOnlyStudyCategoryDto } from './readonly-study-category.dto';

export class ReadOnlyStudyRecordDto {
  @IsNumber()
  @IsNotEmpty()
  study_record_id: number;

  @IsNumber()
  @IsNotEmpty()
  duration: number;

  @IsDate()
  @IsNotEmpty()
  created_at: Date;

  @IsObject()
  @IsNotEmpty()
  study_category: ReadOnlyStudyCategoryDto;
}
