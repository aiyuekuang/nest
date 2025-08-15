import { Module } from '@nestjs/common';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CacheModule } from '@nestjs/cache-manager';
import { MailerModule } from '@nestjs-modules/mailer';
import { RedisClientOptions } from 'redis';
import { redisStore } from 'cache-manager-redis-yet';

import configuration from '../config';
import { ResponseInterceptor } from '../interceptor/response.interceptor';
import { LoggerModule } from '../logger/logger.module';
import { AuthGuard } from '../guard/authGuard';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { CommonModule } from '../common/common.module';

@Module({
  imports: [
    MailerModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        transport: {
          isGlobal: true,
          host: configService.get('mail').host,
          port: configService.get('mail').port,
          auth: {
            user: configService.get('mail').auth.user,
            pass: configService.get('mail').auth.pass,
            secret: configService.get('mail').auth.secret,
          },
        },
        defaults: {
          from: '2092186738@qq.com',
        },
      })
    }),
    CacheModule.registerAsync<RedisClientOptions>({
      imports: [ConfigModule],
      inject: [ConfigService],
      isGlobal: true,
      useFactory: async (configService: ConfigService) => {
        const store = await redisStore({
          socket: {
            host: configService.get('redis').host,
            port: +configService.get('redis').port,
          },
          password: configService.get('redis').password,
          ttl: 1000 * 60 * 60, // 1 hour
        });

        return { store };
      },
    }),
    UserModule,
    ConfigModule.forRoot({
      load: [configuration],
      isGlobal: true,
    }),
    TypeOrmModule.forRoot(configuration().database),
    LoggerModule,
    AuthModule,
    CommonModule,
  ],
  providers: [
    AuthGuard,
    {
      provide: APP_INTERCEPTOR,
      useClass: ResponseInterceptor,
    },
  ],
})
export class AppModule {}
