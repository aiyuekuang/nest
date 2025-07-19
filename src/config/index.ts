import development from './development.config';
import production from './production.config';
import { IConfig } from './type';
import baseConfig from './base.config';

const configs: { development: IConfig; production: IConfig } = {
  development: development,
  production: production,
};

const env = process.env.NODE_ENV || 'development';

export default () => ({ ...baseConfig, ...configs[env] });
