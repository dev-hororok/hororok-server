import { Injectable } from '@nestjs/common';

@Injectable()
export class TimerAppService {
  getHello(): string {
    return 'Hello World!';
  }
}
