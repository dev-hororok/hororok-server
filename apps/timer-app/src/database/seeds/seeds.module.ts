import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DataSource, DataSourceOptions } from 'typeorm';
import { TypeOrmConfigService } from '../typeorm-config.service';
import databaseConfig from '../config/database-config';
import appConfig from '../../config/app.config';
import { RoleSeedModule } from './roles/roles.seed.module';
import { AccountSeedModule } from './accounts/accounts.seed.module';
import { MemberSeedModule } from './members/members.seed.module';

@Module({
  imports: [
    RoleSeedModule,
    AccountSeedModule,
    MemberSeedModule,
    ConfigModule.forRoot({
      isGlobal: true,
      load: [databaseConfig, appConfig],
      envFilePath: ['.env'],
    }),
    TypeOrmModule.forRootAsync({
      useClass: TypeOrmConfigService,
      dataSourceFactory: async (options: DataSourceOptions) => {
        return new DataSource(options).initialize();
      },
    }),
  ],
})
export class SeedModule {}
