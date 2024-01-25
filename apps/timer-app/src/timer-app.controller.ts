import { Controller, Get } from '@nestjs/common';
import { TimerAppService } from './timer-app.service';

@Controller()
export class TimerAppController {
  constructor(private readonly timerAppService: TimerAppService) {}

  @Get()
  getHello(): string {
    return this.timerAppService.getHello();
  }

  @Get('me')
  getCurrentMember() {
    return null;
  }
}
