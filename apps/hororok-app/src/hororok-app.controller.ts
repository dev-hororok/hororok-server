import { Public } from '@app/auth';
import { Controller, Get } from '@nestjs/common';

@Controller()
export class HororokAppController {
  constructor() {}

  @Public()
  @Get()
  ping(): string {
    return 'ping';
  }
}
