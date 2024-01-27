import { Injectable } from '@nestjs/common';

@Injectable()
export class HororokAppService {
  getHello(): string {
    return 'Hororok-app';
  }
}
