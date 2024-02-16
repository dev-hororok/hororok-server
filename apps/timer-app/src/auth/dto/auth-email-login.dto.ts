import { IsEmail, IsNotEmpty } from 'class-validator';

export class AuthEmailLoginDto {
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsNotEmpty()
  password: string;
}
