import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { AuthController } from './controller/auth.controller';
import { AuthService } from './services/auth.service';
import { UserModule } from '../user/user.module';
import { CommonModule } from '../../common/common.module';
import config from '../../config';

@Module({
  imports: [
    UserModule,
    CommonModule,
    PassportModule,
    JwtModule.register({
      secret: config().jwt?.secret || 'default_secret',
      signOptions: { expiresIn: '24h' },
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService],
  exports: [AuthService],
})
export class AuthModule {}
