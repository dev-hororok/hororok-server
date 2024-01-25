import { Public } from '@app/auth';
import { Controller, Get } from '@nestjs/common';

@Controller()
export class AppController {
  constructor() {}

  @Public()
  @Get()
  ping(): string {
    return 'ping';
  }
}
