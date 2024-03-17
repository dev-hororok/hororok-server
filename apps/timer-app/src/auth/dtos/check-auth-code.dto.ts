import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class CheckResetPasswordCodeDto {
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsNotEmpty()
  code: string;
}
