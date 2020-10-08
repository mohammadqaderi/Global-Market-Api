import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { NestExpressApplication } from '@nestjs/platform-express';
import { SwaggerOptionsInit } from './commons/functions/swagger-options-init';
import { webPushInit } from './commons/functions/initalize-web-push';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(
    AppModule, {
      cors: true,
    },
  );
  webPushInit();
  app.enableCors({
    origin: true,
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    credentials: true,
  });
  SwaggerOptionsInit(app);
  app.use(function (req, res, next) { //allow cross origin requests
    res.header("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Methods", "POST, PUT, OPTIONS, DELETE, GET");
    res.header("Access-Control-Allow-Origin", req.headers.origin);
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    res.header("Access-Control-Allow-Credentials", true);
    next();
  });
  app.use((req, res, next) => {
    res.header("Access-Control-Allow-Methods", "GET,HEAD,OPTIONS,POST,PUT, DELETE");
    res.header(
      "Access-Control-Allow-Header",
      "Origin, X-Requested-With, Content-Type, Accept"
    );
    res.header("Access-Control-Allow-Origin", "*");
    next();
  });
  const port: number = parseInt(`${process.env.PORT}`) || 3000;

  await app.listen(port);
}

bootstrap().then(() => {

});
