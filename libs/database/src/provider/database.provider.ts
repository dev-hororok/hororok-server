import { ConfigService } from '@nestjs/config';
import { DataSource } from 'typeorm';

const dataSource = {
  provide: 'DATA_SOURCE',
  inject: [ConfigService],
  useFactory: async (config: ConfigService) => {
    const dataSource = new DataSource({
      type: 'mysql',
      host: config.get('DB_HOST'),
      port: config.get('DB_PORT'),
      username: config.get('DB_USER'),
      password: config.get('DB_PASSWORD'),
      database: config.get('DB_NAME'),
      entities: [__dirname + '/../**/*.entity{.ts,.js}'],
      synchronize: false,
      logging: true,
    });

    return dataSource.initialize();
  },
};

export default dataSource;
