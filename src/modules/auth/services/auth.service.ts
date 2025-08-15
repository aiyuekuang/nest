// src/modules/auth/auth.service.ts
import { Inject, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { MailerService } from '@nestjs-modules/mailer';

import config from '../../../config';
import { decrypt } from '../../../utils/common';
import { CacheService } from '../../../common/services/cache.service';
import { UnauthorizedException, NotFoundException } from '../../../common/exceptions/custom.exception';
import { ApiResponseDto } from '../../../common/dto/api-response.dto';
import { UserService } from '../../user/services/user.service';
import { UpdateUserReqDto } from '../../user/dto/req/update-user-req.dto';
import { User } from '../../user/entities/user.entity';
import { LoginDto } from '../dto/req/login.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly cacheService: CacheService,
    private readonly usersService: UserService,
    private readonly jwtService: JwtService,
    private readonly mailerService: MailerService
  ) {}

  /**
   * 用户登录
   * @param loginUserDto 登录数据传输对象
   * @returns 登录结果
   */
  async login(loginUserDto: LoginDto): Promise<ApiResponseDto<{ access_token: string }>> {
    // 参数的密码解密
    let paramsPassword = decrypt(loginUserDto.password, config().password.secret);

    // 根据用户名查找密码
    let password: User = await this.usersService.findByUsernameWithPassword(loginUserDto.username);
    let user: User = await this.usersService.findByUsername(loginUserDto.username);

    if (!password || !user) {
      throw new UnauthorizedException('用户名或密码错误');
    }

    // 数据库的密码解密
    let dataPassword = decrypt(password.password, config().password.secret);

    if (dataPassword != paramsPassword) {
      throw new UnauthorizedException('用户名或密码错误');
    }

    // 生成 JWT token 并返回
    const payload = {
      id: user.id,
      username: user.username,
    };
    let token = await this.jwtService.signAsync(payload);

    // 将 token 存入缓存，有效期为 24 小时
    await this.cacheService.set(
      `${token}-${loginUserDto.username}`, 
      user, 
      { ttl: 1000 * 60 * 60 * 24 }
    );

    return ApiResponseDto.success({ access_token: token }, '登录成功');
  }

  /**
   * 用户登出
   * @param req 请求对象
   * @returns 登出结果
   */
  async logout(req: any): Promise<ApiResponseDto<{ message: string }>> {
    const [type, tokenStr] = req.headers.authorization?.split(' ') ?? [];
    
    if (type === 'Bearer' && tokenStr) {
      const tokenKey = `${tokenStr}-*`;
      const userKeys = await this.cacheService.keys(tokenKey);
      
      if (userKeys && userKeys.length > 0) {
        await this.cacheService.del(userKeys[0]);
        return ApiResponseDto.success({ message: '用户已登出' }, '登出成功');
      }
    }
    
    return ApiResponseDto.success({ message: '用户已登出' }, '登出成功');
  }

  /**
   * 忘记密码
   * @param username 用户名
   * @returns 发送邮件结果
   */
  async forgotPassword(username: string): Promise<ApiResponseDto<{ message: string }>> {
    const user = await this.usersService.findByUsername(username);
    
    if (!user) {
      throw new NotFoundException('用户不存在');
    }

    if (!user.email) {
      throw new NotFoundException('用户邮箱不存在');
    }

    // 获取一个6位随机验证码
    let verificationCode = Math.random().toString().slice(-6);
    
    // 将验证码存入缓存，有效期为 10 分钟
    await this.cacheService.set(verificationCode, user, { ttl: 1000 * 60 * 10 });

    // 发送找回密码邮件
    await this.mailerService.sendMail({
      to: user.email,
      subject: "找回密码",
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <title>验证码</title>
        </head>
        <body>
          <p>您好，</p>
          <p>您的验证码是：${verificationCode}</p>
          <p>请在10分钟内使用此验证码。</p>
          <p>如果您没有请求此操作，请忽略此邮件。</p>
          <p>谢谢，<br/>您的团队</p>
        </body>
        </html>
      `,
    });

    return ApiResponseDto.success({ message: '找回密码邮件已发送' }, '邮件发送成功');
  }

  /**
   * 重置密码
   * @param resetPasswordDto 重置密码数据传输对象
   * @returns 重置结果
   */
  async resetPassword(resetPasswordDto: any): Promise<ApiResponseDto<{ message: string }>> {
    const { verificationCode, newPassword } = resetPasswordDto;

    // 从缓存中获取用户信息
    const user = await this.cacheService.get(verificationCode);
    
    if (!user) {
      throw new UnauthorizedException('验证码无效或已过期');
    }

    // 加密新密码
    const encryptedPassword = encrypt(newPassword, config().password.secret);

    // 更新用户密码
    await this.usersService.update(user.id, { password: encryptedPassword });

    // 删除验证码缓存
    await this.cacheService.del(verificationCode);

    return ApiResponseDto.success({ message: '密码重置成功' }, '密码重置成功');
  }

  /**
   * 刷新token
   * @param req 请求对象
   * @returns 新的token
   */
  async refreshToken(req: any): Promise<ApiResponseDto<{ access_token: string }>> {
    const [type, tokenStr] = req.headers.authorization?.split(' ') ?? [];
    
    if (type !== 'Bearer' || !tokenStr) {
      throw new UnauthorizedException('无效的token');
    }

    const tokenKey = `${tokenStr}-*`;
    const userKeys = await this.cacheService.keys(tokenKey);
    
    if (!userKeys || userKeys.length === 0) {
      throw new UnauthorizedException('token已过期');
    }

    const user = await this.cacheService.get(userKeys[0]);
    
    if (!user) {
      throw new UnauthorizedException('用户信息不存在');
    }

    // 生成新的 JWT token
    const payload = {
      id: user.id,
      username: user.username,
    };
    const newToken = await this.jwtService.signAsync(payload);

    // 删除旧token，设置新token
    await this.cacheService.del(userKeys[0]);
    await this.cacheService.set(
      `${newToken}-${user.username}`, 
      user, 
      { ttl: 1000 * 60 * 60 * 24 }
    );

    return ApiResponseDto.success({ access_token: newToken }, 'token刷新成功');
  }
}

// 辅助函数：加密密码
function encrypt(plaintext: string, secretKey: string): string {
  if (!plaintext) {
    return '';
  }
  const CryptoJS = require('crypto-js');
  return CryptoJS.AES.encrypt(plaintext, secretKey).toString();
}
