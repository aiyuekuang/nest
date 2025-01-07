import { IConfig } from "./type";

const config: IConfig = {
  password: {
    secret: "zt_secret"
  },
  jwt: {
    secret: "zt_secret",
    expiresIn: "1d"
  },
  mail: {
    host: "smtp.qq.com",
    port: 465,
    secure: true,
    auth: {
      user: "2092186738@qq.com",
      pass: "xxlxzxonfccrebgf", // 授权码,不是邮箱密码
    }
  }
}
  export default config;
