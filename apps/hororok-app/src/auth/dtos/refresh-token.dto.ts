import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class RefreshTokenOuputDto {
  @IsString()
  @IsNotEmpty()
  access_token: string;

  @IsString()
  @IsNotEmpty()
  refresh_token: string;

  @IsNumber()
  @IsNotEmpty()
  expiresIn: number;
}
