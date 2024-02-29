import { IsNotEmpty } from 'class-validator';

export class AuthNaverLoginDto {
  @IsNotEmpty()
  code: string;
}
