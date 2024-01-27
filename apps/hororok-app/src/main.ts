import { NestFactory } from '@nestjs/core';
import { HororokAppModule } from './hororok-app.module';
import { ValidationPipe } from '@nestjs/common';
import { CustomExceptionFilter, Interceptor } from '@app/config';

async function bootstrap() {
  const app = await NestFactory.create(HororokAppModule);
  app.useGlobalPipes(new ValidationPipe());

  app.setGlobalPrefix('hororok-api');
  app.useGlobalInterceptors(new Interceptor());
  app.useGlobalFilters(new CustomExceptionFilter());
  app.enableCors();

  const PORT = process.env.SERVER_PORT || 4000;
  await app.listen(PORT);
}
bootstrap();
