import { registerAs } from '@nestjs/config';
import { IsString } from 'class-validator';
import { validateConfig } from '../../utils/validate-config';
import { KakaoConfig } from './auth-kakao-config.type';

class EnvironmentVariablesValidator {
  @IsString()
  KAKAO_REST_API_KEY: string;

  @IsString()
  KAKAO_CLIENT_SECRET: string;
}

export default registerAs<KakaoConfig>('kakao', () => {
  validateConfig(process.env, EnvironmentVariablesValidator);

  return {
    restApiKey: process.env.KAKAO_REST_API_KEY,
    clientSecret: process.env.KAKAO_CLIENT_SECRET,
  };
});
