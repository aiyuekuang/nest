// src/modules/auth/auth.service.ts
import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { MailerService } from '@nestjs-modules/mailer';

import { PasswordUtil } from '../../../utils/password.util';
import { CryptoUtil } from '../../../utils/crypto.util';
import { CacheService } from '../../../common/services/cache.service';
import {
  UnauthorizedException,
  NotFoundException,
} from '../../../common/exceptions/custom.exception';
import { ApiResponseDto } from '../../../common/dto/api-response.dto';
import { UserService } from '../../user/services/user.service';
import { LoginDto } from '../dto/req/login.dto';
import { LoggerService } from '../../../logger/logger.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly cacheService: CacheService,
    private readonly usersService: UserService,
    private readonly jwtService: JwtService,
    private readonly mailerService: MailerService,
    private readonly logger: LoggerService,
  ) {}

  /**
   * 用户登录
   * @param loginUserDto 登录数据传输对象
   * @returns 登录结果
   */
  async login(
    loginUserDto: LoginDto,
  ): Promise<{ access_token: string }> {
    try {
      // 根据用户名查找用户
      const user = await this.usersService.findByUsername(
        loginUserDto.username,
      );

      if (!user) {
        this.logger.warn(`登录失败：用户不存在 - ${loginUserDto.username}`);
        throw new UnauthorizedException('用户名或密码错误');
      }

      // 解密前端传来的密码
      let plainPassword: string;
      try {
        plainPassword = CryptoUtil.decrypt(loginUserDto.password);
      } catch (err: any) {
        this.logger.warn(
          `登录失败：密码解密失败 - ${loginUserDto.username}: ${err.message}`,
        );
        throw new UnauthorizedException('密码格式错误');
      }

      // 验证密码
      const isPasswordValid = await PasswordUtil.compare(
        plainPassword,
        user.password,
      );

      if (!isPasswordValid) {
        this.logger.warn(`登录失败：密码错误 - ${loginUserDto.username}`);
        throw new UnauthorizedException('用户名或密码错误');
      }

      // 检查用户状态
      if (user.status !== '1') {
        this.logger.warn(`登录失败：用户已被禁用 - ${loginUserDto.username}`);
        throw new UnauthorizedException('用户已被禁用');
      }

      // 生成 JWT token
      const payload = {
        id: user.id,
        username: user.username,
      };
      const token = await this.jwtService.signAsync(payload);

      // 将 token 存入缓存，有效期为 24 小时 (TTL 单位是毫秒)
      const cacheKey = `${token}-${loginUserDto.username}`;
      const ttlMs = 1000 * 60 * 60 * 24; // 24小时
      await this.cacheService.set(cacheKey, user, { ttl: ttlMs });

      this.logger.info(`用户登录成功 - ${loginUserDto.username}`);
      return { access_token: token };
    } catch (err: any) {
      this.logger.error(
        `登录异常 - ${loginUserDto.username}: ${err.message}`,
      );
      throw err;
    }
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
        this.logger.info('用户登出成功');
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
  async forgotPassword(
    username: string,
  ): Promise<ApiResponseDto<{ message: string }>> {
    const user = await this.usersService.findByUsername(username);

    if (!user) {
      throw new NotFoundException('用户不存在');
    }

    if (!user.email) {
      throw new NotFoundException('用户邮箱不存在');
    }

    // 生成6位随机验证码
    const verificationCode = Math.random().toString().slice(-6);

    // 将验证码存入缓存，有效期为 10 分钟
    await this.cacheService.set(verificationCode, user, {
      ttl: 1000 * 60 * 10,
    });

    // 发送找回密码邮件
    await this.mailerService.sendMail({
      to: user.email,
      subject: '找回密码',
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

    this.logger.info(`找回密码邮件已发送 - ${username}`);
    return ApiResponseDto.success(
      { message: '找回密码邮件已发送' },
      '邮件发送成功',
    );
  }

  /**
   * 重置密码
   * @param resetPasswordDto 重置密码数据传输对象
   * @returns 重置结果
   */
  async resetPassword(
    resetPasswordDto: any,
  ): Promise<ApiResponseDto<{ message: string }>> {
    const { verificationCode, newPassword } = resetPasswordDto;

    // 从缓存中获取用户信息
    const user = await this.cacheService.get(verificationCode);

    if (!user) {
      throw new UnauthorizedException('验证码无效或已过期');
    }

    // 解密前端传来的新密码
    let plainPassword: string;
    try {
      plainPassword = CryptoUtil.decrypt(newPassword);
    } catch (err: any) {
      this.logger.warn(`密码重置失败：密码解密失败 - ${user.username}`);
      throw new UnauthorizedException('密码格式错误');
    }

    // 使用bcrypt加密新密码
    const hashedPassword = await PasswordUtil.hash(plainPassword);

    // 更新用户密码
    await this.usersService.update(user.id, { 
      id: user.id,
      password: hashedPassword 
    });

    // 删除验证码缓存
    await this.cacheService.del(verificationCode);

    this.logger.info(`密码重置成功 - ${user.username}`);
    return ApiResponseDto.success({ message: '密码重置成功' }, '密码重置成功');
  }

  /**
   * 修改密码
   * @param changePasswordDto 修改密码数据传输对象
   * @param user 当前用户
   * @returns 修改结果
   */
  async changePassword(
    changePasswordDto: any,
    user: any,
  ): Promise<ApiResponseDto<{ message: string }>> {
    const { password: oldPasswordEncrypted, newPassword: newPasswordEncrypted } =
      changePasswordDto;

    // 获取用户完整信息
    const userInfo = await this.usersService.findOne(user.id);

    // 解密前端传来的旧密码
    let oldPassword: string;
    try {
      oldPassword = CryptoUtil.decrypt(oldPasswordEncrypted);
    } catch (err: any) {
      this.logger.warn(`密码修改失败：旧密码解密失败 - ${user.username}`);
      throw new UnauthorizedException('密码格式错误');
    }

    // 验证旧密码
    const isPasswordValid = await PasswordUtil.compare(
      oldPassword,
      userInfo.password,
    );

    if (!isPasswordValid) {
      throw new UnauthorizedException('旧密码错误');
    }

    // 解密前端传来的新密码
    let newPassword: string;
    try {
      newPassword = CryptoUtil.decrypt(newPasswordEncrypted);
    } catch (err: any) {
      this.logger.warn(`密码修改失败：新密码解密失败 - ${user.username}`);
      throw new UnauthorizedException('密码格式错误');
    }

    // 使用bcrypt加密新密码
    const hashedPassword = await PasswordUtil.hash(newPassword);

    // 更新用户密码
    await this.usersService.update(user.id, { 
      id: user.id,
      password: hashedPassword 
    });

    this.logger.info(`密码修改成功 - ${user.username}`);
    return ApiResponseDto.success({ message: '密码修改成功' }, '密码修改成功');
  }

  /**
   * 刷新token
   * @param req 请求对象
   * @returns 新的token
   */
  async refreshToken(
    req: any,
  ): Promise<ApiResponseDto<{ access_token: string }>> {
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
    await this.cacheService.set(`${newToken}-${user.username}`, user, {
      ttl: 1000 * 60 * 60 * 24,
    });

    this.logger.info(`token刷新成功 - ${user.username}`);
    return ApiResponseDto.success({ access_token: newToken }, 'token刷新成功');
  }
}
