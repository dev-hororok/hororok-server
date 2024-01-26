import { StudyStreak } from '@app/database/typeorm/entities/study-streak.entity';
import { DataSource } from 'typeorm';

export const StreaksProviders = [
  {
    provide: 'STREAK_REPOSITORY',
    useFactory: (dataSource: DataSource) =>
      dataSource.getRepository(StudyStreak),
    inject: ['DATA_SOURCE'],
  },
];
