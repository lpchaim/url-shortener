import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const config = new DocumentBuilder()
    .setTitle('URL Shortener')
    .setDescription('A simple URL shortening service')
    .setVersion('0.0.1')
    .setLicense('GPLv3', 'https://www.gnu.org/licenses/gpl-3.0.html')
    .addTag('url', 'URL endpoints')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  await app.listen(3000, '0.0.0.0');
}
bootstrap();
