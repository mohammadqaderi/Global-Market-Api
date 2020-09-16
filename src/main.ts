import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { NestExpressApplication } from '@nestjs/platform-express';
import { SwaggerOptionsInit } from './swagger-options';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(
    AppModule, {
      cors: true,
    },
  );
  app.enableCors();
  SwaggerOptionsInit(app);

  await app.listen(3000);
}

bootstrap();
