import { ReadOnlyAccountDto } from '@app/database/mongodb/dtos/readonly-account.dto';
import { IsNotEmpty, IsNumber, IsObject, IsString } from 'class-validator';

export class LoginOutputDto {
  @IsString()
  @IsNotEmpty()
  access_token: string;

  @IsString()
  @IsNotEmpty()
  refresh_token: string;

  @IsNumber()
  @IsNotEmpty()
  expiresIn: number;

  @IsObject()
  @IsNotEmpty()
  account: ReadOnlyAccountDto;
}
