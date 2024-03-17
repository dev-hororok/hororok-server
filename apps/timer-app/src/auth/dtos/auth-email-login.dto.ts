import {
  IsEmail,
  IsNotEmpty,
  IsString,
  Matches,
  MaxLength,
  MinLength,
} from 'class-validator';

export class AuthEmailLoginDto {
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsString()
  @MinLength(8, {
    message: 'Password is too short. It must be at least 8 characters long.',
  })
  @MaxLength(20, {
    message: 'Password is too long. It must be at most 20 characters long.',
  })
  @Matches(/((?=.*\d)(?=.*[a-z])(?=.*[\W]).{8,20})/, {
    message:
      'Password must include at least one lowercase letter, one number, and one special character.',
  })
  password: string;
}
