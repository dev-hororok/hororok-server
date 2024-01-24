import { Module } from '@nestjs/common';
import { TimerAppController } from './timer-app.controller';
import { TimerAppService } from './timer-app.service';
import { DatabaseModule } from '@app/database';
import { ConfigModule } from '@nestjs/config';

import * as path from 'path';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: path.resolve(__dirname, '../../../.env'),
    }),
    DatabaseModule,
  ],
  controllers: [TimerAppController],
  providers: [TimerAppService],
})
export class TimerAppModule {}
