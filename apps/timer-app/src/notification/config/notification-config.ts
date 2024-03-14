import { registerAs } from '@nestjs/config';
import { IsString } from 'class-validator';
import { validateConfig } from '../../utils/validate-config';
import { NotificationConfig } from './notification-config.type';

class EnvironmentVariablesValidator {
  @IsString()
  VAPID_PUBLIC_KEY: string;

  @IsString()
  VAPID_SECRET_KEY: string;
}

export default registerAs<NotificationConfig>('notification', () => {
  validateConfig(process.env, EnvironmentVariablesValidator);

  return {
    vapidPublicKey: process.env.VAPID_PUBLIC_KEY,
    vapidSecretKey: process.env.VAPID_SECRET_KEY,
  };
});
