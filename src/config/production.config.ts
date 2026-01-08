import { join } from 'path';
import { IConfig } from './type';

const config: IConfig = {
  // 数据库配置
  database: {
    type: 'mysql',
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT || '3306', 10),
    username: process.env.DB_USERNAME || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_DATABASE || 'nest',
    entities: [join(process.cwd(), '**', '*.entity.js')],
    synchronize: false, // 生产环境必须设置为false，使用数据库迁移管理
    logging: false, // 生产环境关闭SQL日志
    // namingStrategy: new SnakeNamingStrategy(),
    extra: {
      connectionLimit: 10, // 连接池大小
    },
  },
  redis: {
    type: 'redis',
    host: process.env.REDIS_HOST || 'localhost',
    port: parseInt(process.env.REDIS_PORT || '6379', 10),
    password: process.env.REDIS_PASSWORD || '',
  },
};

export default config;
