import { Body, Controller, ForbiddenException, Get } from '@nestjs/common';
import { TimerAppService } from './timer-app.service';
import { TestDto } from './test.dto';

@Controller()
export class TimerAppController {
  constructor(private readonly timerAppService: TimerAppService) {}

  @Get()
  getHello(): string {
    throw new ForbiddenException('테스트');
    return this.timerAppService.getHello();
  }

  @Get('/1')
  getHello2(@Body() testDto: TestDto): string {
    console.log(testDto);
    return this.timerAppService.getHello();
  }

  @Get('/2')
  getHello3(): string {
    return this.timerAppService.getHello();
  }
}
