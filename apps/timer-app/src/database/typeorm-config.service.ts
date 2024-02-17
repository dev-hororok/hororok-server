import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { TypeOrmModuleOptions, TypeOrmOptionsFactory } from '@nestjs/typeorm';
import { AllConfigType } from '../config/config.type';
import { Account } from './entities/account.entity';
import { CharacterInventory } from './entities/character-inventory.entity';
import { Character } from './entities/character.entity';
import { ItemInventory } from './entities/item-inventory.entity';
import { Item } from './entities/item.entity';
import { Member } from './entities/member.entity';
import { Palette } from './entities/palette.entity';
import { StudyCategory } from './entities/study-category.entity';
import { StudyRecord } from './entities/study-record.entity';
import { StudyStreak } from './entities/study-streak.entity';
import { TransactionRecord } from './entities/transaction-record.entity';
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
        this.configService.get('app.nodeEnv', { infer: true }) !== 'production',

      entities: [
        Account,
        CharacterInventory,
        Character,
        ItemInventory,
        Item,
        Member,
        Palette,
        RoleEntity,
        StudyCategory,
        StudyRecord,
        StudyStreak,
        TransactionRecord,
      ],
      migrations: [__dirname + '/migrations/**/*{.ts,.js}'],
    } as TypeOrmModuleOptions;
  }
}
