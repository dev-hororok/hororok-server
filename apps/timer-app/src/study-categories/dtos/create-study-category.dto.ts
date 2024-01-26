import { IsNotEmpty, IsString } from 'class-validator';

export class CreateStudyCategoryInputDto {
  @IsString()
  @IsNotEmpty()
  subject: string;
}
