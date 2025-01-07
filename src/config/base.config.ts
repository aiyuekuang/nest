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
      user: "2092186738",
      pass: "zengtao123"
    }
  }
}
  export default config;
