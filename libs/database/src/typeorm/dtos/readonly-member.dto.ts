import {
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsString,
  IsUUID,
} from 'class-validator';
import { TimerAppMemberRole } from '../enums/timer-app-member-role.enum';

export class ReadOnlyMemberDto {
  @IsUUID()
  @IsNotEmpty()
  member_id: string;

  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsNotEmpty()
  nickname: string;

  @IsNumber()
  @IsNotEmpty()
  point: number;

  @IsEnum(TimerAppMemberRole)
  @IsNotEmpty()
  role: TimerAppMemberRole;

  @IsString()
  image_url: string;

  @IsNumber()
  active_record_id: number;
}
