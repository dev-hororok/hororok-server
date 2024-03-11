import { BadRequestException, Module } from '@nestjs/common';
import { UploadsController } from './uploads.controller';
import { UploadsService } from './uploads.service';
import { MulterModule } from '@nestjs/platform-express';
import { ConfigService } from '@nestjs/config';
import { AllConfigType } from '../config/config.type';
import { S3Client } from '@aws-sdk/client-s3';
import { STATUS_MESSAGES } from '../utils/constants';
import multerS3 from 'multer-s3';
import { randomStringGenerator } from '@nestjs/common/utils/random-string-generator.util';

@Module({
  imports: [
    MulterModule.registerAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService<AllConfigType>) => {
        const s3 = new S3Client({
          region: configService.getOrThrow('upload.awsS3Region', {
            infer: true,
          }),
          credentials: {
            accessKeyId: configService.getOrThrow('upload.accessKeyId', {
              infer: true,
            }),
            secretAccessKey: configService.getOrThrow(
              'upload.secretAccessKey',
              {
                infer: true,
              },
            ),
          },
        });

        return {
          fileFilter: (req, file, cb) => {
            if (!file.originalname.match(/\.(jpg|jpeg|png|gif)$/i)) {
              return cb(
                new BadRequestException(
                  STATUS_MESSAGES.UPLOAD.INVALID_FILE_TYPE,
                ),
                false,
              );
            }
            cb(null, true);
          },
          storage: multerS3({
            s3: s3,
            bucket: configService.getOrThrow('upload.awsS3Bucket', {
              infer: true,
            }),
            contentType: multerS3.AUTO_CONTENT_TYPE,
            key: (req, file, cb) => {
              cb(
                null,
                `${randomStringGenerator()}.${file.originalname
                  .split('.')
                  .pop()
                  ?.toLowerCase()}`,
              );
            },
          }),
          limits: {
            fileSize: configService.getOrThrow('upload.maxFileSize', {
              infer: true,
            }),
          },
        };
      },
    }),
  ],
  controllers: [UploadsController],
  providers: [UploadsService, ConfigService],
})
export class UploadModule {}
