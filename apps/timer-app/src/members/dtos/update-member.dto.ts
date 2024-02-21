import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class UpdateMemberInputDto {
  @IsOptional()
  @IsNotEmpty()
  @IsString()
  nickname?: string;

  @IsString()
  @IsOptional()
  image_url?: string;

  @IsOptional()
  @IsString()
  status_message?: string;
}
