import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { NestExpressApplication } from '@nestjs/platform-express';
import { SwaggerOptionsInit } from './commons/functions/swagger-options-init';
import { webPushInit } from './commons/functions/initalize-web-push';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(
    AppModule
  );
  webPushInit();
  SwaggerOptionsInit(app);

  const port: number = parseInt(`${process.env.PORT}`) || 3000;

  await app.listen(port);
}

bootstrap().then(() => {

});
