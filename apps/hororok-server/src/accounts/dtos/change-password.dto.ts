import { IsNotEmpty, IsString, MaxLength, MinLength } from 'class-validator';

export class ChangePasswordDto {
  @IsString()
  @MinLength(4)
  @MaxLength(100)
  @IsNotEmpty()
  password: string;
}
