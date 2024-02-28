import { IsNotEmpty } from 'class-validator';

export class AuthKakaoLoginDto {
  @IsNotEmpty()
  code: string;
}
