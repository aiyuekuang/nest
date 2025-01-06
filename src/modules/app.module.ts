import { Module } from "@nestjs/common";
import { UserModule } from "./user/module";
import configuration from "../config";
import { ConfigModule } from "@nestjs/config";
import { TypeOrmModule } from "@nestjs/typeorm";
import { APP_INTERCEPTOR } from "@nestjs/core";
import { ResponseInterceptor } from "../interceptor/response.interceptor";
import { LoggerModule } from "../logger/logger.module";

@Module({
  imports: [
    UserModule,
    ConfigModule.forRoot({
    load: [configuration],
    isGlobal: true
  }),
    TypeOrmModule.forRoot(configuration().database),
    LoggerModule
  ],
  providers: [
    {
      provide: APP_INTERCEPTOR,
      useClass: ResponseInterceptor
    },
  ]
})
export class AppModule {
}
