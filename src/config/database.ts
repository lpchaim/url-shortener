import { registerAs } from '@nestjs/config';

import { ConfigKey } from './common';

export const DatabaseConfig = registerAs(ConfigKey.Database, () => ({
  sqlite: {
    file: process.env.DATABASE_SQLITE_FILE,
  },
}));
