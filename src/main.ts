import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { NestExpressApplication } from '@nestjs/platform-express';
import { SwaggerOptionsInit } from './commons/functions/swagger-options-init';
import { webPushInit } from './commons/functions/initalize-web-push';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(
    AppModule,
    {
      cors: true,
    },
  );
  webPushInit();
  SwaggerOptionsInit(app);
  app.enableCors({
    origin: true,
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
  });
  app.use(function(req, res, next) { //allow cross origin requests
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'POST, HEAD, PUT, OPTIONS, DELETE, GET');
    res.header('Access-Control-Allow-Headers', '*');
    next();
  });
  const port: number = parseInt(`${process.env.PORT}`) || 3000;

  await app.listen(port);
}

bootstrap().then(() => {

});
