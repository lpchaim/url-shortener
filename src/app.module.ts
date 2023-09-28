import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService, ConfigType } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';

import { AppConfig, Environment } from './config/app';
import { ConfigKey } from './config/common';
import { DatabaseConfig } from './config/database';
import { UrlModule } from './url/url.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [AppConfig, DatabaseConfig],
      envFilePath: [
        `${__dirname}/.env.production`,
        `${__dirname}/.env.development`,
        `${__dirname}/.env`,
      ],
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        const appConfig = configService.get<ConfigType<typeof AppConfig>>(
          ConfigKey.App,
        );
        const dbConfig = configService.get<ConfigType<typeof DatabaseConfig>>(
          ConfigKey.Database,
        );
        if (dbConfig?.sqlite) {
          return {
            type: 'sqlite',
            database:
              dbConfig.sqlite.file !== ':memory:'
                ? `${__dirname}/${dbConfig.sqlite.file}`
                : dbConfig.sqlite.file,
            entities: [`${__dirname}/**/*.entity{.ts,.js}`],
            synchronize: appConfig?.environment != Environment.Production,
          };
        } else {
          return {};
        }
      },
    }),
    UrlModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
