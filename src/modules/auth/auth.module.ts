import { Module } from "@nestjs/common";
import { JwtModule } from "@nestjs/jwt";
import { PassportModule } from "@nestjs/passport";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { AuthService } from "./services/auth.service";
import { UserModule } from "../user/module";
import { AuthController } from "./controller/auth.controller";
import { MailerModule,MailerService } from "@nestjs-modules/mailer";

@Module({
  imports: [
    UserModule,
    PassportModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get("jwt").secret,
        signOptions: {
          expiresIn: configService.get("jwt").expiresIn
        }
      })
    })
  ],
  controllers: [AuthController],
  providers: [AuthService],
  exports: []
})
export class AuthModule {
}
