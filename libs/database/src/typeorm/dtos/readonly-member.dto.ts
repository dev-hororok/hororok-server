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

  @IsString()
  image_url: string;

  @IsNumber()
  @IsNotEmpty()
  point: number;

  @IsNumber()
  active_record_id: number;
}
