import { IoAdapter } from '@nestjs/platform-socket.io';
import { ServerOptions } from 'socket.io';
import { createAdapter } from '@socket.io/redis-adapter';
import { createClient, RedisClientOptions } from 'redis';
import { INestApplication, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AllConfigType } from './config.type';

export class RedisIoAdapter extends IoAdapter {
  private logger = new Logger(RedisIoAdapter.name);
  private adapterConstructor: ReturnType<typeof createAdapter>;

  constructor(
    private app: INestApplication,
    private configService: ConfigService,
  ) {
    super(app);
  }

  async connectToRedis(): Promise<void> {
    const redisEnv = this.configService.get<AllConfigType>('redis', {
      infer: true,
    });

    const redisOptions: RedisClientOptions = {
      url: `redis://${redisEnv.host}:${redisEnv.port}`,
    };

    const pubClient = createClient(redisOptions);
    const subClient = pubClient.duplicate();

    pubClient.on('error', (err) =>
      this.logger.error(`Redis pubClient Error: ${err.message}`),
    );
    subClient.on('error', (err) =>
      this.logger.error(`Redis subClient Error: ${err.message}`),
    );

    await Promise.all([pubClient.connect(), subClient.connect()]);

    this.adapterConstructor = createAdapter(pubClient, subClient);
  }

  createIOServer(port: number, options?: ServerOptions): any {
    const server = super.createIOServer(port, {
      ...options,
      cors: {
        origin: [
          'https://pomodak.com',
          'https://monta-pwa.vercel.app',
          'http://localhost:5173',
          'http://192.168.1.208:5173',
        ],
        credentials: true,
        allowedHeaders: ['Authorization', 'Content-Type'],
      },
    });
    server.adapter(this.adapterConstructor);
    return server;
  }
}
