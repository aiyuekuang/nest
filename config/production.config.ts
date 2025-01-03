import { join } from "path";
import { IConfig } from "./type";

const config: IConfig = {
  xlbServerUrl: "https://hxl-api.xlbsoft.com",

  // 数据库配置
  database: {
    type: "mysql",
    host: "pc-bp1w4u30y344jc1b7.rwlb.rds.aliyuncs.com",
    port: 3306,
    username: "xlbplatfrom",
    password: "xlbplatfrom@88888",
    database: "xlbplatform",
    entities: [join(process.cwd(), "**", "*.entity.js")],
    synchronize: true // 在开发环境下可以使用，生产环境需要手动管理数据库结构变化
  },
};

export default config;
