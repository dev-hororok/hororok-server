import { NestFactory } from '@nestjs/core';
import { TimerAppModule } from './timer-app.module';
import { CustomExceptionFilter, Interceptor } from '@app/config';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(TimerAppModule);

  app.useGlobalPipes(new ValidationPipe({ transform: true }));

  app.setGlobalPrefix('timer-api');
  app.useGlobalInterceptors(new Interceptor());
  app.useGlobalFilters(new CustomExceptionFilter());
  app.enableCors({
    origin: [
      'https://hororok-app.vercel.app',
      'https://monta-pwa.vercel.app',
      'http://localhost:3000',
      'http://localhost:5173',
    ],
    credentials: true,
    exposedHeaders: ['Authorization'],
  });
  const PORT = process.env.SERVER_PORT || 4000;
  await app.listen(PORT);
}
bootstrap();
