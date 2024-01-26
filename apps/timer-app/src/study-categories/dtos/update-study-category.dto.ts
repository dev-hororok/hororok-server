import { IsNotEmpty, IsString } from 'class-validator';

export class UpdateStudyCategoryInputDto {
  @IsString()
  @IsNotEmpty()
  subject: string;
}
