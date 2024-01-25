import { ConfigService } from '@nestjs/config';
import mongoose from 'mongoose';
import { DataSource } from 'typeorm';
import { Member } from '../typeorm/entities/member.entity';
import { CharacterInventory } from '../typeorm/entities/character-inventory.entity';
import { Character } from '../typeorm/entities/character.entity';
import { EggInventory } from '../typeorm/entities/egg-inventory.entity';
import { Egg } from '../typeorm/entities/egg.entity';
import { Palette } from '../typeorm/entities/palette.entity';
import { Probability } from '../typeorm/entities/probability.entity';
import { Statistic } from '../typeorm/entities/statistic.entity';
import { StreakColorChangePermission } from '../typeorm/entities/streak-color-change-permission.entity';
import { StudyCategory } from '../typeorm/entities/study-category.entity';
import { StudyRecord } from '../typeorm/entities/study-record.entity';
import { StudyStreak } from '../typeorm/entities/study-streak.entity';
import { TransactionRecord } from '../typeorm/entities/transaction-record.entity';

export const databaseProviders = [
  {
    provide: 'DATA_SOURCE',
    inject: [ConfigService],
    useFactory: async (configService: ConfigService) => {
      const dataSource = new DataSource({
        type: 'mysql',
        host: configService.get('DB_HOST'),
        port: configService.get('DB_PORT'),
        username: configService.get('DB_USER'),
        password: configService.get('DB_PASSWORD'),
        database: configService.get('DB_NAME'),
        entities: [
          CharacterInventory,
          Character,
          EggInventory,
          Egg,
          Member,
          Palette,
          Probability,
          Statistic,
          StreakColorChangePermission,
          StudyCategory,
          StudyRecord,
          StudyStreak,
          TransactionRecord,
        ],
        synchronize: false,
        logging: true,
      });

      return dataSource.initialize();
    },
  },
  {
    provide: 'DATABASE_CONNECTION',
    useFactory: async (
      configService: ConfigService,
    ): Promise<typeof mongoose> =>
      await mongoose.connect(configService.get<string>('MONGODB_URL')),
    inject: [ConfigService],
  },
];
