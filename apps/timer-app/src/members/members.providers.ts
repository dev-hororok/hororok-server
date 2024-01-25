import { Member } from '@app/database/typeorm/entities/member.entity';
import { DataSource } from 'typeorm';

export const MembersProviders = [
  {
    provide: 'MEMBER_REPOSITORY',
    useFactory: (dataSource: DataSource) => dataSource.getRepository(Member),
    inject: ['DATA_SOURCE'],
  },
];
