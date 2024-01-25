import { AccountRole } from '@app/database/common/enums/account-role.enum';
import { IsEmail, IsEnum, IsNotEmpty, IsString, IsUUID } from 'class-validator';

export class ReadOnlyAccountDto {
  @IsUUID()
  @IsNotEmpty()
  account_id: string;

  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsString()
  profile_url: string;

  @IsString()
  @IsNotEmpty()
  name: string;

  @IsEnum(AccountRole)
  @IsNotEmpty()
  role: AccountRole;
}
