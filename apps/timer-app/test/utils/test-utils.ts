import { Test } from '@nestjs/testing';
import {
  ClassSerializerInterceptor,
  INestApplication,
  ValidationPipe,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';

import { TimerAppModule } from 'apps/timer-app/src/timer-app.module';
import { CustomSuccessInterceptor } from 'apps/timer-app/src/config/custom-success-interceptor';
import { CustomExceptionFilter } from 'apps/timer-app/src/config/custom-exception-filter';

let app: INestApplication;

export const initializeTestApp = async () => {
  if (!app) {
    const moduleRef = await Test.createTestingModule({
      imports: [TimerAppModule],
    }).compile();

    app = moduleRef.createNestApplication();
    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true,
      }),
    );
    app.useGlobalInterceptors(new CustomSuccessInterceptor());
    app.useGlobalFilters(new CustomExceptionFilter());
    app.useGlobalInterceptors(
      new ClassSerializerInterceptor(app.get(Reflector)),
    );
    await app.init();
  }
  return app;
};

export const closeTestApp = async () => {
  if (app) {
    await app.close();
  }
};
