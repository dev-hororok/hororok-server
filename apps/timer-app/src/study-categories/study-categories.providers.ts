import { StudyCategory } from '@app/database/typeorm/entities/study-category.entity';
import { StudyRecord } from '@app/database/typeorm/entities/study-record.entity';
import { DataSource } from 'typeorm';

export const StudyCategoriesProviders = [
  {
    provide: 'STUDY_CATEGORIES_REPOSITORY',
    useFactory: (dataSource: DataSource) =>
      dataSource.getRepository(StudyCategory),
    inject: ['DATA_SOURCE'],
  },
  {
    provide: 'STUDY_RECORD_REPOSITORY',
    useFactory: (dataSource: DataSource) =>
      dataSource.getRepository(StudyRecord),
    inject: ['DATA_SOURCE'],
  },
];
