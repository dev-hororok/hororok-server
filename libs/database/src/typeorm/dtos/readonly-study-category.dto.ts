import { IsNotEmpty, IsString } from 'class-validator';

export class ReadOnlyStudyCategoryDto {
  @IsString()
  @IsNotEmpty()
  subject: string;
}
