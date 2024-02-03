import { IsOptional, IsString, MaxLength, MinLength } from 'class-validator';

export class EditAccountDto {
  @IsString()
  @MinLength(3)
  @MaxLength(14)
  @IsOptional()
  name?: string;

  @IsString()
  @IsOptional()
  profile_url?: string;
}
