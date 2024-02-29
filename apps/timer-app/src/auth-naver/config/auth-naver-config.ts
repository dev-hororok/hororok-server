import { registerAs } from '@nestjs/config';
import { IsString } from 'class-validator';
import { validateConfig } from '../../utils/validate-config';
import { NaverConfig } from './auth-naver-config.type';

class EnvironmentVariablesValidator {
  @IsString()
  NAVER_CLIENT_ID: string;

  @IsString()
  NAVER_CLIENT_SECRET: string;
}

export default registerAs<NaverConfig>('naver', () => {
  validateConfig(process.env, EnvironmentVariablesValidator);

  return {
    clientId: process.env.NAVER_CLIENT_ID,
    clientSecret: process.env.NAVER_CLIENT_SECRET,
  };
});
