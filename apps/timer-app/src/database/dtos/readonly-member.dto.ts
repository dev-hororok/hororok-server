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
  image_url: string | null;

  @IsNumber()
  active_record_id: number | null;
}
