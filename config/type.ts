import { TypeOrmModuleOptions } from '@nestjs/typeorm';

export interface IConfig {
  xlbServerUrl?: string;
  database?: TypeOrmModuleOptions & {
    type?: string;
    host?: string;
    port?: number;
    username?: string;
    password?: string;
    database?: string;
    entities?: string[];
    synchronize?: boolean;
  };
  jwt?: {
    secret?: string;
    expiresIn?: string;
  };
  secret?: {
    passwordSecret?: string;
    username?: string;
    password?: string;
  };
}
