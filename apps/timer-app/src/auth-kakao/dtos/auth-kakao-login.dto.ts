import { IsNotEmpty } from 'class-validator';

export class AuthKakaoLoginDto {
  @IsNotEmpty()
  code: string;
}

export class V2AuthKakaoLoginDto {
  @IsNotEmpty()
  access_token: string;
}
