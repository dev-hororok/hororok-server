import { Module } from '@nestjs/common';
import { HororokAppController } from './hororok-app.controller';
import { HororokAppService } from './hororok-app.service';
import { APP_GUARD } from '@nestjs/core';
import { JwtAuthGuard, RolesGuard, SharedAuthModule } from '@app/auth';
import { DatabaseModule } from '@app/database';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    DatabaseModule,
    SharedAuthModule,
  ],
  controllers: [HororokAppController],
  providers: [
    HororokAppService,
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
    {
      provide: APP_GUARD,
      useClass: RolesGuard,
    },
  ],
})
export class HororokAppModule {}
