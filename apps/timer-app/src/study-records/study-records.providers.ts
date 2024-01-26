import { StudyRecord } from '@app/database/typeorm/entities/study-record.entity';
import { DataSource } from 'typeorm';

export const StudyRecordsProviders = [
  {
    provide: 'STUDY_RECORD_REPOSITORY',
    useFactory: (dataSource: DataSource) =>
      dataSource.getRepository(StudyRecord),
    inject: ['DATA_SOURCE'],
  },
];
