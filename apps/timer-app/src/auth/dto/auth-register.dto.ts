import { IsEmail, IsNotEmpty, MinLength } from 'class-validator';

export class AuthRegisterLoginDto {
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @MinLength(6)
  @IsNotEmpty()
  password: string;
}
