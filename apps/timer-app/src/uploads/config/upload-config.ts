import { registerAs } from '@nestjs/config';
import { IsString } from 'class-validator';
import { validateConfig } from '../../utils/validate-config';
import { UploadConfig } from './upload-config.type';

class EnvironmentVariablesValidator {
  @IsString()
  ACCESS_KEY_ID: string;

  @IsString()
  SECRET_ACCESS_KEY: string;

  @IsString()
  AWS_S3_BUCKET: string;

  @IsString()
  AWS_S3_URL: string;

  @IsString()
  AWS_S3_REGION: string;
}

export default registerAs<UploadConfig>('upload', () => {
  validateConfig(process.env, EnvironmentVariablesValidator);

  return {
    accessKeyId: process.env.ACCESS_KEY_ID,
    secretAccessKey: process.env.SECRET_ACCESS_KEY,
    awsS3Bucket: process.env.AWS_S3_BUCKET,
    awsS3Url: process.env.AWS_S3_URL,
    awsS3Region: process.env.AWS_S3_REGION,
    maxFileSize: 1024 * 1024, // 1MiB
  };
});
