import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as process from 'process';
import type { NestExpressApplication } from '@nestjs/platform-express';
// const ngrok = require('@ngrok/ngrok');

async function bootstrap() {
  // const app = await NestFactory.create(AppModule);
  const app = await NestFactory.create<NestExpressApplication>(AppModule, {
    rawBody: true,
  });

  // (async function () {
  //   // Establish connectivity
  //   const listener = await ngrok.forward({
  //     addr: 3000,
  //     authtoken_from_env: true,
  //   });

  //   // Output ngrok url to console
  //   console.log(`Ingress established at: ${listener.url()}`);
  // })();

  await app.listen(process.env.PORT);
}
bootstrap();
