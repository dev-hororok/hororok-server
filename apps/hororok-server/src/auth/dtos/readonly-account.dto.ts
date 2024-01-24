import { AccountRole } from '@app/database/common/enums/account-role.enum';
import {
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUUID,
} from 'class-validator';

export class ReadOnlyAccountDto {
  @IsUUID()
  @IsNotEmpty()
  id: string;

  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsOptional()
  profile_url: string;

  @IsString()
  @IsNotEmpty()
  name: string;

  @IsEnum(AccountRole)
  @IsNotEmpty()
  role: AccountRole;
}
