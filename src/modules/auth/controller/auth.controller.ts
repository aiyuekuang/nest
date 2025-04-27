// src/modules/auth/auth.controller.ts
import { Body, Controller, Post, Req } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { LoginDto } from '../dto/req/login.dto';
import { ForgotPasswordDto } from '../dto/req/forgot-password.dto';
import { ResetPasswordDto } from '../dto/req/reset-password.dto';
import { AuthService } from '../services/auth.service';
import { SkipAuth } from '../../../decorators/skip-auth.decorator';
import { OldPasswordDto } from '../dto/req/change-password.dto';
import { reqUser } from '../../../utils/nameSpace';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  @SkipAuth()
  @ApiOperation({ summary: '用户登录' })
  @ApiResponse({ status: 201, description: '用户登录成功。' })
  async login(@Body() loginDto: LoginDto) {
    // 调用 AuthService 的 login 方法进行用户登录
    return this.authService.login(loginDto);
  }

  @Post('logout')
  @ApiOperation({ summary: '用户登出' })
  @ApiResponse({ status: 201, description: '用户登出成功。' })
  async logout(@Req() req) {
    // 调用 AuthService 的 logout 方法进行用户登出
    return this.authService.logout(req);
  }

  @SkipAuth()
  @Post('sendEmail')
  @ApiOperation({ summary: '用邮箱找回密码' })
  @ApiResponse({ status: 201, description: '找回密码邮件已发送。' })
  async forgotPassword(@Body() forgotPasswordDto: ForgotPasswordDto) {
    // 调用 AuthService 的 forgotPassword 方法发送找回密码邮件
    return this.authService.forgotPassword(forgotPasswordDto.username);
  }

  @SkipAuth()
  @Post('resetPassword')
  @ApiOperation({ summary: '修改密码' })
  @ApiResponse({ status: 201, description: '密码修改成功。' })
  async resetPassword(@Body() resetPasswordDto: ResetPasswordDto) {
    // 调用 AuthService 的 resetPassword 方法进行密码修改
    return this.authService.resetPassword(resetPasswordDto);
  }

  // 修改密码
  @Post('changePassword')
  @ApiOperation({ summary: '网页中修改密码' })
  @ApiResponse({ status: 201, description: '密码修改成功。' })
  async changePassword(@Body() resetPasswordDto: OldPasswordDto, @Req() req) {
    // 获取用户信息
    const user = req[reqUser];
    // 调用 AuthService 的 resetPassword 方法进行密码修改
    return this.authService.changePassword(resetPasswordDto, user);
  }
}
