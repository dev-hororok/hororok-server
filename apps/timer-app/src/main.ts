import { NestFactory, Reflector } from '@nestjs/core';
import { TimerAppModule } from './timer-app.module';
import { ClassSerializerInterceptor, ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AllConfigType } from './config/config.type';
import { RedisIoAdapter } from './config/redis-io.adapter';
import { CustomSuccessInterceptor } from './config/custom-success-interceptor';
import { CustomExceptionFilter } from './config/custom-exception-filter';

async function bootstrap() {
  const app = await NestFactory.create(TimerAppModule);

  const configService = app.get(ConfigService<AllConfigType>);

  const redisIoAdapter = new RedisIoAdapter(app);
  await redisIoAdapter.connectToRedis();

  app.useWebSocketAdapter(redisIoAdapter);

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // DTO에 정의된 필드만 받아들임
      forbidNonWhitelisted: true, // 정의되지 않은 필드가 포함되어 있으면 요청을 거부
      transform: true,
    }),
  );
  app.setGlobalPrefix(
    configService.getOrThrow('app.apiPrefix', { infer: true }),
  );

  app.useGlobalInterceptors(new CustomSuccessInterceptor());
  app.useGlobalFilters(new CustomExceptionFilter());
  app.useGlobalInterceptors(new ClassSerializerInterceptor(app.get(Reflector)));
  app.enableCors({
    origin: [
      'https://pomodak.com',
      'https://monta-pwa.vercel.app',
      'http://localhost:5173',
      'http://192.168.1.208:5173',
    ],
    credentials: true,
    allowedHeaders: ['Authorization', 'Content-Type'],
  });

  const PORT = process.env.SERVER_PORT || 4000;
  await app.listen(PORT);
}
bootstrap();
