import {
  IsEmail,
  IsNotEmpty,
  IsNumber,
  IsString,
  IsUUID,
} from 'class-validator';

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

  @IsString()
  @IsNotEmpty()
  role: string;

  @IsString()
  image_url: string;

  @IsNumber()
  active_record_id: number;
}
