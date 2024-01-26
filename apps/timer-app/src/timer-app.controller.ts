import { Controller, Get } from '@nestjs/common';

@Controller()
export class TimerAppController {
  constructor() {}

  @Get()
  getHello(): string {
    return 'Timer App Ping';
  }

  @Get('me')
  getCurrentMember() {
    return null;
  }
}
