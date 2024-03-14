import { registerAs } from '@nestjs/config';
import { IsString } from 'class-validator';
import { validateConfig } from '../../utils/validate-config';
import { NotificationConfig } from './notification-config.type';

class EnvironmentVariablesValidator {
  @IsString()
  VAPID_PUBILC_KEY: string;

  @IsString()
  VAPID_SECRET_KEY: string;
}

export default registerAs<NotificationConfig>('notification', () => {
  validateConfig(process.env, EnvironmentVariablesValidator);

  return {
    vapidPublicKey: process.env.VAPID_PUBILC_KEY,
    vapidSecretKey: process.env.VAPID_SECRET_KEY,
  };
});
