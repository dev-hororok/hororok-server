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
import { MemberCharacterCollectionMigrateModule } from './temp/member-character-collection-migrate.module';

@Module({
  imports: [
    RoleSeedModule,
    AccountSeedModule,
    MemberSeedModule,
    MemberCharacterCollectionMigrateModule,
    ConfigModule.forRoot({
      isGlobal: true,
      load: [databaseConfig, appConfig],
      envFilePath: ['.env.development'],
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
