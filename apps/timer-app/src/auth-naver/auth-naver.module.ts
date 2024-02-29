import { Module } from '@nestjs/common';
import { AuthModule } from '../auth/auth.module';
import { AuthNaverService } from './auth-naver.service';
import { AuthNaverController } from './auth-naver.controller';
import { HttpModule } from '@nestjs/axios';

@Module({
  imports: [AuthModule, HttpModule],
  providers: [AuthNaverService],
  exports: [AuthNaverService],
  controllers: [AuthNaverController],
})
export class AuthNaverModule {}
