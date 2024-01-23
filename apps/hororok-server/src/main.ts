import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { Interceptor } from '@app/config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe({ transform: true }));

  app.useGlobalInterceptors(new Interceptor());

  const PORT = process.env.HOROROK_SERVER_PORT || 4000;
  app.enableCors({
    origin: [
      'https://hororok-app.vercel.app',
      'http://localhost:3000',
      'http://localhost:5173',
      'https://monta-pwa.vercel.app',
    ],
    credentials: true,
    exposedHeaders: ['Authorization'],
  });
  await app.listen(PORT);
}
bootstrap();
