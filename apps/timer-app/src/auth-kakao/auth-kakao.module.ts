import { Module } from '@nestjs/common';
import { AuthModule } from '../auth/auth.module';
import { AuthKakaoService } from './auth-kakao.service';
import { AuthKakaoController } from './auth-kakao.controller';
import { HttpModule } from '@nestjs/axios';

@Module({
  imports: [AuthModule, HttpModule],
  providers: [AuthKakaoService],
  exports: [AuthKakaoService],
  controllers: [AuthKakaoController],
})
export class AuthKakaoModule {}
