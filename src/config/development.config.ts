import { join } from "path";
import { IConfig } from "./type";
import { SnakeNamingStrategy } from "typeorm-naming-strategies";

const config: IConfig = {
  // 数据库配置
  database: {
    type: "mysql",
    host: "192.168.31.77",
    port: 3306,
    username: "root",
    password: "zengtao123",
    database: "nest",
    entities: [join(__dirname, "..", "modules", "**", "**", "*.entity.{ts,js}")],
    synchronize: true, // 在开发环境下可以使用，生产环境需要手动管理数据库结构变化
    // namingStrategy: new SnakeNamingStrategy(),
  },
  redis: {
    type: "redis",
    host: "192.168.31.77",
    port: 6379
  }
};

export default config;
