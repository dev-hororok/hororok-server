import { Type } from 'class-transformer';
import { IsEmail, IsNotEmpty, IsOptional, MinLength } from 'class-validator';
import { RoleDto } from '../../roles/dtos/role.dto';

export class CreateAccountDto {
  @IsNotEmpty()
  @IsEmail()
  email: string | null;

  @MinLength(6)
  password?: string;

  provider?: string;

  social_id?: string | null;

  @IsOptional()
  @Type(() => RoleDto)
  role?: RoleDto | null;
}
