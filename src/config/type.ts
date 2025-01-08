import { TypeOrmModuleOptions } from '@nestjs/typeorm';

export interface IConfig {
  // 项目URL的前缀
  prefix?: string;

  // 数据库配置
  database?: TypeOrmModuleOptions & {
    // 数据库类型
    type?: string;
    // 数据库主机地址
    host?: string;
    // 数据库端口号
    port?: number;
    // 数��库用户名
    username?: string;
    // 数据库密码
    password?: string;
    // 数据库名称
    database?: string;
    // 实体类路径
    entities?: string[];
    // 是否自动同步数据库结构
    synchronize?: boolean;
  };

  // JWT 配置
  jwt?: {
    // JWT 密钥
    secret?: string;
    // JWT 过期时间
    expiresIn?: string;
  };

  // 密码相关的密钥配置
  secret?: {
    // 密码加密密钥
    passwordSecret?: string;
    // 用户名
    username?: string;
    // 密码
    password?: string;
  };

  // Redis 配置
  redis?: {
    // Redis 类型
    type?: string;
    // Redis 主机地址
    host?: string;
    // Redis 端口号
    port?: number;
    // Redis 用户名
    username?: string;
  };

  // 密码配置
  password?: {
    // 密码加密密钥
    secret?: string;
  };

  // 邮件服务配置
  mail?: {
    // 邮件服务器主机地址
    host?: string;
    // 邮件服务器端口号
    port?: number;
    // 是否使用安全连接
    secure?: boolean;
    // 邮件服务器认证信息
    auth?: {
      // 邮件服务器用户名
      user?: string;
      // 邮件服务器授权码
      pass?: string;
    };
  };
}
