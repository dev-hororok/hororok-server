import { Module } from '@nestjs/common';
import { TimerAppController } from './timer-app.controller';
import { TimerAppService } from './timer-app.service';

@Module({
  imports: [],
  controllers: [TimerAppController],
  providers: [TimerAppService],
})
export class TimerAppModule {}
