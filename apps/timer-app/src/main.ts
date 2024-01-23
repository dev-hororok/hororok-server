import { NestFactory } from '@nestjs/core';
import { TimerAppModule } from './timer-app.module';

async function bootstrap() {
  const app = await NestFactory.create(TimerAppModule);
  const PORT = process.env.TIMER_APP_PORT || 4001;
  await app.listen(PORT);
}
bootstrap();
