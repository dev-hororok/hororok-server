import { AccountSchema } from '@app/database/mongoose/entities/account.model';
import { Connection } from 'mongoose';

export const accountsProviders = [
  {
    provide: 'ACCOUNT_MODEL',
    useFactory: (connection: Connection) =>
      connection.model('Account', AccountSchema),
    inject: ['DATABASE_CONNECTION'],
  },
];
