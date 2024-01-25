import { IsNotEmpty, IsNumber, IsObject, IsString } from 'class-validator';
import { ReadOnlyAccountDto } from '../../../../../libs/database/src/mongoose/dtos/readonly-account.dto';

export class LoginOuputDto {
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
