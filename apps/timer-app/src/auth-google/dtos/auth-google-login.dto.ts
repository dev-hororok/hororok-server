import { IsNotEmpty } from 'class-validator';

export class AuthGoogleLoginDto {
  @IsNotEmpty()
  code: string;
}

export class V2AuthGoogleLoginDto {
  @IsNotEmpty()
  idToken: string;
}
