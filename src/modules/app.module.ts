import { Module } from "@nestjs/common";
import { UserModule } from "./user/module";
import configuration from "../config";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { TypeOrmModule } from "@nestjs/typeorm";
import { APP_INTERCEPTOR } from "@nestjs/core";
import { ResponseInterceptor } from "../interceptor/response.interceptor";
import { LoggerModule } from "../logger/logger.module";
import { CacheModule } from "@nestjs/cache-manager";
import { RedisClientOptions } from "redis";
import { redisStore } from "cache-manager-redis-yet";
import { AuthModule } from "./auth/auth.module";
import { MailerModule } from "@nestjs-modules/mailer";
import { AuthGuard } from "../guard/authGuard";
import { UserService } from "./user/services/user.service";


@Module({
  imports: [
    MailerModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        transport: {
          isGlobal: true,
          host: configService.get("mail").host,
          port: configService.get("mail").port,
          auth: {
            user: configService.get("mail").auth.user,
            pass: configService.get("mail").auth.pass
          }
        },
        defaults: {
          from: "\"No Reply\" <noreply@example.com>"
        }
      })
    }),
    CacheModule.registerAsync<RedisClientOptions>({
      imports: [ConfigModule],
      inject: [ConfigService],
      isGlobal: true,
      useFactory: async (configService: ConfigService) => {
        const store = await redisStore({
          socket: {
            host: configService.get("redis").host,
            port: +configService.get("redis").port
          },
          ttl: 1000 * 60 * 60 // 1 hour
        });

        return { store };
      }
    }),
    UserModule,
    ConfigModule.forRoot({
      load: [configuration],
      isGlobal: true
    }),
    TypeOrmModule.forRoot(configuration().database),
    LoggerModule,
    AuthModule
  ],
  providers: [
    AuthGuard,
    {
      provide: APP_INTERCEPTOR,
      useClass: ResponseInterceptor
    }
  ]
})
export class AppModule {
}
