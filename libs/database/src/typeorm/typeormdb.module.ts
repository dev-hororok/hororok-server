import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Member } from '../typeorm/entities/member.entity';
import { CharacterInventory } from '../typeorm/entities/character-inventory.entity';
import { Character } from '../typeorm/entities/character.entity';
import { Palette } from '../typeorm/entities/palette.entity';
import { StudyCategory } from '../typeorm/entities/study-category.entity';
import { StudyRecord } from '../typeorm/entities/study-record.entity';
import { StudyStreak } from '../typeorm/entities/study-streak.entity';
import { TransactionRecord } from '../typeorm/entities/transaction-record.entity';
import { Item } from './entities/item.entity';
import { ItemInventory } from './entities/item-inventory.entity';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],

      useFactory: async (config: ConfigService) => ({
        type: 'mysql',
        host: config.get('DB_HOST'),
        port: config.get('DB_PORT'),
        username: config.get('DB_USER'),
        password: config.get('DB_PASSWORD'),
        database: config.get('DB_NAME'),
        entities: [
          CharacterInventory,
          Character,
          Item,
          ItemInventory,
          Member,
          Palette,
          StudyCategory,
          StudyRecord,
          StudyStreak,
          TransactionRecord,
        ],
        synchronize: false,
        logging: false,
      }),
    }),
  ],
})
export class TypeormDBModule {}
