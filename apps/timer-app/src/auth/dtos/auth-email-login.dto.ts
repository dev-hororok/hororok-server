import { IsEmail, IsNotEmpty, MinLength } from 'class-validator';

export class AuthEmailLoginDto {
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @MinLength(6)
  @IsNotEmpty()
  password: string;
}
