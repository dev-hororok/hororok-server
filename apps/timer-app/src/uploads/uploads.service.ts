import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AllConfigType } from '../config/config.type';

@Injectable()
export class UploadsService {
  constructor(private readonly configService: ConfigService<AllConfigType>) {}

  uploadFile(file: Express.MulterS3.File) {
    return `${this.configService.getOrThrow('upload.awsS3Url', {
      infer: true,
    })}/${file.key}`;
  }
}
