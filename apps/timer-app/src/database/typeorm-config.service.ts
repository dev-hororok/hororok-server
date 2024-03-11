import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { TypeOrmModuleOptions, TypeOrmOptionsFactory } from '@nestjs/typeorm';
import { AllConfigType } from '../config/config.type';
import { AccountEntity } from './entities/account.entity';
import { CharacterInventoryEntity } from './entities/character-inventory.entity';
import { CharacterEntity } from './entities/character.entity';
import { ItemInventoryEntity } from './entities/item-inventory.entity';
import { ItemEntity } from './entities/item.entity';
import { MemberEntity } from './entities/member.entity';
import { PaletteEntity } from './entities/palette.entity';
import { StudyRecordEntity } from './entities/study-record.entity';
import { StudyStreakEntity } from './entities/study-streak.entity';
import { TransactionRecordEntity } from './entities/transaction-record.entity';
import { RoleEntity } from './entities/role.entity';

@Injectable()
export class TypeOrmConfigService implements TypeOrmOptionsFactory {
  constructor(private configService: ConfigService<AllConfigType>) {}

  createTypeOrmOptions(): TypeOrmModuleOptions {
    return {
      type: this.configService.get('database.type', { infer: true }),
      host: this.configService.get('database.host', { infer: true }),
      port: this.configService.get('database.port', { infer: true }),
      username: this.configService.get('database.username', { infer: true }),
      password: this.configService.get('database.password', { infer: true }),
      database: this.configService.get('database.name', { infer: true }),
      synchronize: this.configService.get('database.synchronize', {
        infer: true,
      }),

      logging:
        this.configService.get('app.nodeEnv', { infer: true }) ===
        'development',

      entities: [
        AccountEntity,
        CharacterInventoryEntity,
        CharacterEntity,
        ItemInventoryEntity,
        ItemEntity,
        MemberEntity,
        PaletteEntity,
        RoleEntity,
        StudyRecordEntity,
        StudyStreakEntity,
        TransactionRecordEntity,
      ],
      migrations: [__dirname + '/migrations/**/*{.ts,.js}'],
    } as TypeOrmModuleOptions;
  }
}
