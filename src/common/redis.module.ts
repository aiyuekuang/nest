import { Module, Global } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { createClient } from 'redis';

// Redis client 的 provider token
export const REDIS_CLIENT = 'REDIS_CLIENT';

@Global()
@Module({
  imports: [ConfigModule],
  providers: [
    {
      provide: REDIS_CLIENT,
      useFactory: async (configService: ConfigService) => {
        const redisHost = configService.get<string>('REDIS_HOST') || 'localhost';
        const redisPort = configService.get<number>('REDIS_PORT') || 6379;
        const redisPassword = configService.get<string>('REDIS_PASSWORD') || undefined;
        
        const client = createClient({
          socket: {
            host: redisHost,
            port: redisPort,
          },
          password: redisPassword,
        });
        
        await client.connect();
        return client;
      },
      inject: [ConfigService],
    },
  ],
  exports: [REDIS_CLIENT],
})
export class RedisModule {}
