import { registerAs } from '@nestjs/config';

import { ConfigKey } from './common';

export enum Environment {
  Production = 'production',
  Development = 'development',
}

export const AppConfig = registerAs(ConfigKey.App, () => ({
  environment: process.env.ENVIRONMENT || Environment.Production,
}));
