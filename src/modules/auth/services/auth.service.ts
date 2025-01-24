// src/modules/auth/auth.service.ts
import { Inject, Injectable } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { UserService } from "../../user/services/user.service";
import { MailerService } from "@nestjs-modules/mailer";
import { Cache, CACHE_MANAGER } from "@nestjs/cache-manager";
import { LoginDto } from "../dto/req/login.dto";
import { User } from "../../user/entities/user.entity";
import { decrypt, getAuthToken } from "../../../utils/common";
import config from "../../../config";
import { UpdateUserReqDto } from "../../user/dto/req/update-user-req.dto";
import { reqUser } from "../../../utils/nameSpace";

@Injectable()
export class AuthService {
  constructor(
    @Inject(CACHE_MANAGER) private cache: Cache,
    private readonly usersService: UserService,
    private readonly jwtService: JwtService,
    private readonly mailerService: MailerService
  ) {
  }

  //当我是login的时候，需要能查询出password，所以需要在user.service.ts中添加findByUsername方法中添加select
  async login(loginUserDto: LoginDto) {

    // 参数的密码解密
    let paramsPassword = decrypt(loginUserDto.password, config().password.secret);

    // 根据用户名查找密码
    let password: User = await this.usersService.findByUsernameWithPassword(loginUserDto.username);
    let user: User = await this.usersService.findByUsername(loginUserDto.username);

    // 数据库的密码解密
    let dataPassword = decrypt(password.password, config().password.secret);

    if (dataPassword != paramsPassword) {
      return { message: "用户名或密码错误" };
    }

    // 生成 JWT token 并返回
    const payload = {
      id: user.id,
      username: user.username,
    };
    let token = await this.jwtService.signAsync(payload);

    // 将 token 存入缓存，有效期为 24 小时
    await this.cache.set(token + "-" + loginUserDto.username, user, 1000 * 60 * 60 * 24);

    return {
      access_token: token
    };
  }

  async logout(req) {
    let key = await getAuthToken(req, this.cache);
    if (key) {
      return await this.cache.del(key); // 返回用户信息
    }
    // 处理用户登出逻辑
    // 这里可以实现 token 的黑名单机制
    return { message: "用户已登出" };
  }



  async forgotPassword(username: string) {
    const user = await this.usersService.findByUsername(username);
    // 获取一个6位随机验证码
    let verificationCode = Math.random().toString().slice(-6);
    // 将验证码存入缓存，有效期为 10 分钟
    await this.cache.set(verificationCode, user, 1000 * 60 * 10);
    let email = user.email;

    // 发送找回密码邮件
    await this.mailerService.sendMail({
      to: email,
      subject: "找回密码",
      html: "<!DOCTYPE html>\n" +
        "<html>\n" +
        "<head>\n" +
        "  <title>验证码</title>\n" +
        "</head>\n" +
        "<body>\n" +
        "  <p>您好，</p>\n" +
        "  <p>您的验证码是：" + verificationCode + "</p>\n" +
        "  <p>请在10分钟内使用此验证码。</p>\n" +
        "  <p>如果您没有请求此操作，请忽略此邮件。</p>\n" +
        "  <p>谢谢，<br/>您的团队</p>\n" +
        "</body>\n" +
        "</html>", // 邮件模板
    });

    return { message: "找回密码邮件已发送" };
  }

  async resetPassword(resetPasswordDto) {
    const { verificationCode, newPassword } = resetPasswordDto;

    // 从缓存中获取用户信息
    const user:User = await this.cache.get(verificationCode);

    if(!user){
      return { message: "验证码不正确" };
    }

    // 更新用户密码
    await this.usersService.update(user.id, { password: newPassword });

    return { message: "密码修改成功" };
  }
}
