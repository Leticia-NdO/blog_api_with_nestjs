if (!process.env.IS_TS_NODE) require('module-alias/register');

import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { config } from 'dotenv';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger'

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  config();
  const options = new DocumentBuilder()
  .setTitle('Blog API with Nest.js')
  .setDescription('RESTful API for publishing, interacting and viewing articles (feed), creating users and following system. ')
  .addBearerAuth(
    { 
      description: `Please enter a valid JWT token (can be obtained with the login or get current user endpoints)`,
      name: 'Authorization',
      bearerFormat: 'Bearer',
      scheme: 'Bearer',
      type: 'http',
      in: 'Header'
    },
    'Authorization',
  )
  .setVersion('1.0')
  .build();
  const document = SwaggerModule.createDocument(app, options);
  SwaggerModule.setup('docs', app, document);
  await app.listen(3000);
}
bootstrap();
