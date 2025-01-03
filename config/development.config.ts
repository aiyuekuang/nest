import path, { join } from 'path';
import { IConfig } from './type';

const config: IConfig = {
  xlbServerUrl: 'https://test-api.xlbsoft.com',

  // 数据库配置
  database: {
    type: 'mysql',
    host: 'localhost',
    port: 3306,
    username: 'root',
    password: 'zengtao123',
    database: 'nest',
    entities: [join(process.cwd(), '**', '*.entity.js')],
    synchronize: true, // 在开发环境下可以使用，生产环境需要手动管理数据库结构变化
  },
};

export default config;