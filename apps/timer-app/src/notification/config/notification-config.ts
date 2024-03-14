import { registerAs } from '@nestjs/config';
import { IsString } from 'class-validator';
import { validateConfig } from '../../utils/validate-config';
import { NotificationConfig } from './notification-config.type';

class EnvironmentVariablesValidator {
  @IsString()
  FIREBASE_PUBLIC_KEY: string;
  @IsString()
  FIREBASE_PROJECT_ID: string;
  @IsString()
  FIREBASE_PRIVATE_KEY: string;
  @IsString()
  FIREBASE_CLIENT_EMAIL: string;
}

export default registerAs<NotificationConfig>('notification', () => {
  validateConfig(process.env, EnvironmentVariablesValidator);

  return {
    publicKey: process.env.FIREBASE_PUBLIC_KEY,
    projectId: process.env.FIREBASE_PROJECT_ID,
    privateKey: process.env.FIREBASE_PRIVATE_KEY,
    clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
  };
});
