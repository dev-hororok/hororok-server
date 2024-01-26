import { Statistic } from '@app/database/typeorm/entities/statistic.entity';
import { DataSource } from 'typeorm';

export const StatisticsProviders = [
  {
    provide: 'STATISTIC_REPOSITORY',
    useFactory: (dataSource: DataSource) => dataSource.getRepository(Statistic),
    inject: ['DATA_SOURCE'],
  },
];
