import { Connection } from 'mongoose';
import { AccountSchema } from './entities/account.model';

export const accountsProviders = [
  {
    provide: 'ACCOUNT_MODEL',
    useFactory: (connection: Connection) =>
      connection.model('Account', AccountSchema),
    inject: ['DATABASE_CONNECTION'],
  },
];
