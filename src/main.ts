if (!process.env.IS_TS_NODE) require('module-alias/register');

import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { config } from 'dotenv';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  config();
  await app.listen(3000);
}
bootstrap();
