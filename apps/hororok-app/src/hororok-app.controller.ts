import { Body, Controller, Get, Post } from '@nestjs/common';
import { HororokAppService } from './hororok-app.service';

@Controller()
export class HororokAppController {
  constructor(private readonly hororokAppService: HororokAppService) {}

  @Get()
  getHello(): string {
    return this.hororokAppService.getHello();
  }

  @Post()
  test(@Body() body) {
    console.log(body);
    return body;
  }
}
