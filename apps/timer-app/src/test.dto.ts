import { IsNotEmpty, IsString, MinLength } from 'class-validator';

export class TestDto {
  @IsString()
  @MinLength(4)
  @IsNotEmpty()
  name: string;

  @IsString()
  @MinLength(4)
  @IsNotEmpty()
  email: string;
}
