import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class UpdateMemberInputDto {
  @IsOptional()
  @IsNotEmpty()
  @IsString()
  nicknmae: string;

  @IsString()
  @IsOptional()
  image_url: string;
}
