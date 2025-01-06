import path, { join } from 'path';
import { IConfig } from './type';

const config: IConfig = {

  jwt: {
    secret: 'zzh_milk',
    expiresIn: '1d',
  },

};

export default config;
