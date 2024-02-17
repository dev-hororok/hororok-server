import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class ReadOnlyStudyCategoryDto {
  @IsNumber()
  @IsNotEmpty()
  study_category_id: number;

  @IsString()
  @IsNotEmpty()
  subject: string;
}
