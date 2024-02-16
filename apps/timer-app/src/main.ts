import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import { CustomExceptionFilter, Interceptor } from '@app/config';
import { AllConfigType } from './config/config.type';
import { TimerAppModule } from './timer-app.module';

async function bootstrap() {
  const app = await NestFactory.create(TimerAppModule);

  const configService = app.get(ConfigService<AllConfigType>);

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // DTO에 정의된 필드만 받아들임
      forbidNonWhitelisted: true, // 정의되지 않은 필드가 포함되어 있으면 요청을 거부
      transform: true,
    }),
  );

  app.setGlobalPrefix(
    configService.getOrThrow('app.apiPrefix', { infer: true }),
    {
      exclude: ['/'], // 루트경로 제외
    },
  );

  app.useGlobalInterceptors(new Interceptor());
  app.useGlobalFilters(new CustomExceptionFilter());
  app.enableCors();

  await app.listen(configService.getOrThrow('app.port', { infer: true }));
}
bootstrap();
