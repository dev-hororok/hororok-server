import { IsDate, IsNotEmpty, IsString } from 'class-validator';

export class CreateStudyRecordInputDto {
  @IsDate()
  @IsNotEmpty()
  start_time: Date;

  @IsString()
  @IsNotEmpty()
  member_id: string;
}
