// src/modules/auth/auth.service.ts
import { Inject, Injectable } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { UserService } from "../../user/services/user.service";
import { MailerService } from "@nestjs-modules/mailer";
import { Cache, CACHE_MANAGER } from "@nestjs/cache-manager";
import { LoginDto } from "../dto/req/login.dto";
import { User } from "../../user/entities/user.entity";
import { decrypt } from "../../../utils/common";
import config from "../../../config";

@Injectable()
export class AuthService {
  constructor(
    @Inject(CACHE_MANAGER) private cache: Cache,
    private readonly usersService: UserService,
    private readonly jwtService: JwtService,
    private readonly mailerService: MailerService
  ) {
  }

  async login(loginUserDto: LoginDto) {

    // 参数的密码解密
    let paramsPassword = decrypt(loginUserDto.password, config().password.secret);

    let user: User = await this.usersService.findByUsername(loginUserDto.username);

    // 数据库的密码解密
    let dataPassword = decrypt(user.password, config().password.secret);

    if (dataPassword != paramsPassword) {
      return { message: "用户名或密码错误" };
    }

    // 生成 JWT token 并返回
    const payload = {
      username: user.username,
      password: user.password
    };
    let token = await this.jwtService.signAsync(payload);

    // 将 token 存入缓存，有效期为 24 小时
    await this.cache.set(token + "-" + loginUserDto.username, user, 1000 * 60 * 60 * 24);

    return {
      access_token: token
    };
  }

  async logout() {
    // 处理用户登出逻辑
    // 这里可以实现 token 的黑名单机制
    return { message: "用户已登出" };
  }

  async forgotPassword(email: string) {
    // 生成重置密码的 token
    const token = this.jwtService.sign({ email });

    // 发送找回密码邮件
    await this.mailerService.sendMail({
      to: email,
      subject: "找回密码",
      template: "./forgot-password", // 邮件模板
      context: { token } // 模板上下文
    });

    return { message: "找回密码邮件已发送" };
  }

  async resetPassword(token: string, newPassword: string) {
    // 验证 token 并获取用户信息
    const decoded = this.jwtService.verify(token);
    const user = await this.usersService.findByEmail(decoded.email);

    // 更新用户密码
    user.password = newPassword;
    await this.usersService.update(user.id, user);

    return { message: "密码修改成功" };
  }
}
