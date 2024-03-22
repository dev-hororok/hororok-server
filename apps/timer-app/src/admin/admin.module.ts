import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { StudyTimerModule } from '../study-timer/study-timer.module';
import { StudyGroupAdminGateway } from './gateways/study-group-admin.gateway';

@Module({
  imports: [JwtModule.register({}), StudyTimerModule],
  controllers: [],
  providers: [StudyGroupAdminGateway],
})
export class AdminModule {}
