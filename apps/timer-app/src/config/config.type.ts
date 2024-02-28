import { GoogleConfig } from '../auth-google/config/auth-google-config.type';
import { KakaoConfig } from '../auth-kakao/config/auth-kakao-config.type';
import { AuthConfig } from '../auth/config/auth-config.type';
import { DatabaseConfig } from '../database/config/database-config.type';
import { AppConfig } from './app-config.type';
import { RedisConfig } from './redis-config.type';

export type AllConfigType = {
  app: AppConfig;
  database: DatabaseConfig;
  auth: AuthConfig;
  redis: RedisConfig;
  google: GoogleConfig;
  kakao: KakaoConfig;
};
