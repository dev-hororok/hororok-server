import { IsEmail, IsNotEmpty, MinLength } from 'class-validator';

export class AuthEmailRegisterDto {
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @MinLength(6)
  @IsNotEmpty()
  password: string;
}
