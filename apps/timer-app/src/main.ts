import { NestFactory } from '@nestjs/core';
import { TimerAppModule } from './timer-app.module';

async function bootstrap() {
  const app = await NestFactory.create(TimerAppModule);
  await app.listen(4001);
}
bootstrap();
