import { Module } from '@nestjs/common';
import { HororokAppController } from './hororok-app.controller';
import { HororokAppService } from './hororok-app.service';
import { APP_GUARD } from '@nestjs/core';
import { JwtAuthGuard, RolesGuard } from '@app/auth';

@Module({
  imports: [],
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
