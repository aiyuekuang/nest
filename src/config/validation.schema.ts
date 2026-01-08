import * as Joi from 'joi';

/**
 * 环境变量验证Schema
 * 使用Joi验证所有必需的环境变量
 */
export const validationSchema = Joi.object({
  // 应用配置
  NODE_ENV: Joi.string()
    .valid('development', 'production', 'test')
    .default('development'),
  PORT: Joi.number().default(3010),
  API_PREFIX: Joi.string().default('nest'),

  // 数据库配置
  DB_HOST: Joi.string().required(),
  DB_PORT: Joi.number().default(3306),
  DB_USERNAME: Joi.string().required(),
  DB_PASSWORD: Joi.string().required(),
  DB_DATABASE: Joi.string().required(),
  DB_LOGGING: Joi.boolean().default(false),

  // Redis配置
  REDIS_HOST: Joi.string().required(),
  REDIS_PORT: Joi.number().default(6379),
  REDIS_PASSWORD: Joi.string().allow('').default(''),
  REDIS_DB: Joi.number().default(0),

  // JWT配置
  JWT_SECRET: Joi.string().min(32).required(),
  JWT_EXPIRES_IN: Joi.string().default('7d'),

  // 密码加密配置
  PASSWORD_SECRET: Joi.string().min(16).required(),

  // 邮件配置
  MAIL_HOST: Joi.string().default('smtp.qq.com'),
  MAIL_PORT: Joi.number().default(465),
  MAIL_USER: Joi.string().email().default('test@example.com'),
  MAIL_PASSWORD: Joi.string().default('test_password'),

  // CORS配置
  CORS_ORIGIN: Joi.string().default('http://localhost:8000'),

  // API限流配置
  THROTTLE_TTL: Joi.number().default(60000),
  THROTTLE_LIMIT: Joi.number().default(10),

  // 日志配置
  LOG_LEVEL: Joi.string()
    .valid('error', 'warn', 'info', 'debug')
    .default('info'),
  LOG_FILE_PATH: Joi.string().default('./logs/app.log'),
});
