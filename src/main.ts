import {NestFactory, Reflector } from '@nestjs/core';
import { AppModule } from './app.module';
import { NestExpressApplication } from '@nestjs/platform-express';
import { commonConfig } from '@shared/config/common.config';
import { Logger, VersioningType } from '@nestjs/common';
import * as morgan from 'morgan';

async function bootstrap() {
  const app =  await NestFactory.create<NestExpressApplication>(AppModule);
  const reflector = app.get(Reflector);

  app.enableCors({
    origin: commonConfig.corsOrigin,
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    preflightContinue: false,
    credentials: true,
  });

  app.setGlobalPrefix('api')
  app.enableVersioning({
    type: VersioningType.URI,
    defaultVersion: commonConfig.apiVersion,
  })

  app.use(morgan('combined'));

  const PORT = commonConfig.PORT;
   await app.listen(PORT , ()=>{
    Logger.log(`Server is listening on PORT: ${PORT}`)
    })
}

bootstrap();
