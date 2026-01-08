import { IConfig } from './type';

const config: IConfig = {
  // 项目URL的前缀
  prefix: process.env.API_PREFIX || 'nest',

  // 密码加密配置
  password: {
    secret: process.env.PASSWORD_SECRET || 'zt_secret',
  },

  // JWT配置
  jwt: {
    secret: process.env.JWT_SECRET || 'change_this_in_production_min_32_chars',
    expiresIn: process.env.JWT_EXPIRES_IN || '1d',
  },

  // 邮件配置
  mail: {
    host: process.env.MAIL_HOST || 'smtp.qq.com',
    port: parseInt(process.env.MAIL_PORT || '465', 10),
    secure: true,
    auth: {
      user: process.env.MAIL_USER || '',
      pass: process.env.MAIL_PASSWORD || '', // 授权码,不是邮箱密码
    },
  },
};

export default config;
