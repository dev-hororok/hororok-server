import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

export class CreateStudyRecordInputDto {
  @IsString()
  @IsNotEmpty()
  member_id: string;

  @IsNumber()
  @IsOptional()
  category_id: number;
}
