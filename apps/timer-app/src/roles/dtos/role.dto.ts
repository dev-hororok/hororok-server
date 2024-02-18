import { IsNumber } from 'class-validator';

export class RoleDto {
  @IsNumber()
  role_id: number;
}
