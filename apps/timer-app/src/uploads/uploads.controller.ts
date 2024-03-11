import {
  Controller,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { RoleEnum } from '../roles/roles.enum';
import { Roles } from '../roles/roles.decorator';
import { UploadsService } from './uploads.service';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller('uploads')
@Roles(RoleEnum.admin)
export class UploadsController {
  constructor(private readonly uploadsService: UploadsService) {}

  @Post('file')
  @UseInterceptors(FileInterceptor('file'))
  async uploadFile(@UploadedFile() file: Express.MulterS3.File) {
    return this.uploadsService.uploadFile(file);
  }
}
