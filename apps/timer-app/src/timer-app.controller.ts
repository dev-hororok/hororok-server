import { Public } from '@app/auth';
import { Body, Controller, Get, Req } from '@nestjs/common';

@Controller()
export class TimerAppController {
  constructor() {}

  @Public()
  @Get()
  getHello(@Body() body, @Req() req): string {
    console.log(req, body);
    return 'Timer App Ping';
  }

  @Get('me')
  getCurrentMember() {
    return null;
  }
}
