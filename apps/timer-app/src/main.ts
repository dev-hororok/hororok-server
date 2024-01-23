import { NestFactory } from '@nestjs/core';
import { TimerAppModule } from './timer-app.module';
import { CustomExceptionFilter, Interceptor } from '@app/config';

async function bootstrap() {
  const app = await NestFactory.create(TimerAppModule);

  app.useGlobalInterceptors(new Interceptor());
  app.useGlobalFilters(new CustomExceptionFilter());

  const PORT = process.env.TIMER_APP_PORT || 4001;
  await app.listen(PORT);
}
bootstrap();
