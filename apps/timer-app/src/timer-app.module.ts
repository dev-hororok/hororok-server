import { Module } from '@nestjs/common';
import { TimerAppController } from './timer-app.controller';
import { TimerAppService } from './timer-app.service';
import { DatabaseModule } from '@app/database';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    DatabaseModule,
  ],
  controllers: [TimerAppController],
  providers: [TimerAppService],
})
export class TimerAppModule {}
