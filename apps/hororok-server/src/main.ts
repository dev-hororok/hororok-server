import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe({ transform: true }));

  const PORT = process.env.PORT || 3000;
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
