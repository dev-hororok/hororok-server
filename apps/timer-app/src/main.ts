import { NestFactory } from '@nestjs/core';
import { TimerAppModule } from './timer-app.module';
import { Interceptor } from '@app/config';

async function bootstrap() {
  const app = await NestFactory.create(TimerAppModule);

  app.useGlobalInterceptors(new Interceptor());

  const PORT = process.env.TIMER_APP_PORT || 4001;
  await app.listen(PORT);
}
bootstrap();
