import { GoogleConfig } from '../auth-google/config/auth-google-config.type';
import { KakaoConfig } from '../auth-kakao/config/auth-kakao-config.type';
import { NaverConfig } from '../auth-naver/config/auth-naver-config.type';
import { AuthConfig } from '../auth/config/auth-config.type';
import { DatabaseConfig } from '../database/config/database-config.type';
import { MailConfig } from '../mail/config/mail-config.type';
import { NotificationConfig } from '../notification/config/notification-config.type';
import { UploadConfig } from '../uploads/config/upload-config.type';
import { AppConfig } from './app-config.type';
import { RedisConfig } from './redis-config.type';

export type AllConfigType = {
  app: AppConfig;
  database: DatabaseConfig;
  auth: AuthConfig;
  redis: RedisConfig;
  google: GoogleConfig;
  kakao: KakaoConfig;
  naver: NaverConfig;
  upload: UploadConfig;
  notification: NotificationConfig;
  mail: MailConfig;
};
