import { Type } from 'class-transformer';
import { IsEmail, IsOptional, MinLength } from 'class-validator';
import { CreateAccountDto } from './create-account.dto';
import { RoleDto } from '../../roles/dtos/role.dto';
import { PartialType } from '@nestjs/mapped-types';

export class UpdateAccountDto extends PartialType(CreateAccountDto) {
  @IsOptional()
  @IsEmail()
  email?: string | null;

  @IsOptional()
  @MinLength(6)
  password?: string;

  provider?: string;

  socialId?: string | null;

  @IsOptional()
  @Type(() => RoleDto)
  role?: RoleDto | null;
}
