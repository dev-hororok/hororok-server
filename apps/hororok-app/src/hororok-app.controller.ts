import { Body, Controller, Get, Post } from '@nestjs/common';
import { HororokAppService } from './hororok-app.service';
import { Public } from '@app/auth';

@Controller()
export class HororokAppController {
  constructor(private readonly hororokAppService: HororokAppService) {}

  @Public()
  @Get()
  getHello(): string {
    return this.hororokAppService.getHello();
  }

  @Public()
  @Post()
  test(@Body() body) {
    console.log(body);
    return body;
  }
}
