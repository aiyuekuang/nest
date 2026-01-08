import { Module, MiddlewareConsumer, NestModule } from '@nestjs/common';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CacheModule } from '@nestjs/cache-manager';
import { MailerModule } from '@nestjs-modules/mailer';
import { ThrottlerModule } from '@nestjs/throttler';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { redisStore } from 'cache-manager-redis-yet';
import { join } from 'path';

import configuration from '../config';
import { ResponseInterceptor } from '../interceptor/response.interceptor';
import { RequestContextMiddleware } from '../common/middleware/request-context.middleware';
import { UserListener } from '../common/listeners/user.listener';
import { LoggerModule } from '../logger/logger.module';
import { AuthGuard } from '../guard/authGuard';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { CommonModule } from '../common/common.module';
import { RedisModule } from '../common/redis.module';
import { HealthModule } from './health/health.module';
import { AuditModule } from './audit/audit.module';
import { TaskModule } from './task/task.module';
import { UploadModule } from './upload/upload.module';

@Module({
  imports: [
    // 配置模块（带环境变量验证）
    ConfigModule.forRoot({
      load: [configuration],
      isGlobal: true,
      // 临时禁用验证来调试
      // validationSchema,
    }),

    // 事件模块
    EventEmitterModule.forRoot(),

    // 邮件模块配置
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
          },
        },
        defaults: {
          from: configService.get('mail').auth.user,
        },
      }),
    }),

    // Redis缓存模块配置  
    CacheModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      isGlobal: true,
      useFactory: async (configService: ConfigService) => {
        const redisHost = configService.get<string>('REDIS_HOST') || 'localhost';
        const redisPort = configService.get<number>('REDIS_PORT') || 6379;
        const redisPassword = configService.get<string>('REDIS_PASSWORD') || undefined;
        
        try {
          const store = await redisStore({
            socket: {
              host: redisHost,
              port: redisPort,
            },
            password: redisPassword,
          });

          return { 
            store,
            ttl: 1000 * 60 * 60 * 24, // 默认 24 小时
          };
        } catch (error: any) {
          console.error('Redis 连接失败:', error.message);
          throw error;
        }
      },
    }),

    // API限流模块配置
    ThrottlerModule.forRoot([
      {
        ttl: parseInt(process.env.THROTTLE_TTL || '60000', 10),
        limit: parseInt(process.env.THROTTLE_LIMIT || '10', 10),
      },
    ]),

    // 数据库模块
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: 'mysql' as const,
        host: configService.get<string>('DB_HOST', 'localhost'),
        port: configService.get<number>('DB_PORT', 3306),
        username: configService.get<string>('DB_USERNAME', 'root'),
        password: configService.get<string>('DB_PASSWORD', ''),
        database: configService.get<string>('DB_DATABASE', 'nest'),
        entities: [join(__dirname, '..', 'modules', '**', '**', '*.entity.{ts,js}')],
        synchronize: true,
        logging: configService.get<string>('DB_LOGGING', 'false') === 'true',
      }),
    }),

    // 业务模块
    RedisModule,
    LoggerModule,
    AuthModule,
    UserModule,
    CommonModule,
    HealthModule,
    AuditModule,
    TaskModule,
    UploadModule,
  ],
  providers: [
    AuthGuard,
    UserListener,
    {
      provide: APP_INTERCEPTOR,
      useClass: ResponseInterceptor,
    },
  ],
  exports: [],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(RequestContextMiddleware).forRoutes('*');
  }
}
