import { NestFactory, Reflector } from '@nestjs/core';
import { AppModule } from './app.module';
import { NestExpressApplication } from '@nestjs/platform-express';
import { Logger, ValidationPipe, VersioningType } from '@nestjs/common';
import { setupSwagger } from '@libs/api-docs/swagger';
import { GlobalExceptionFilter } from '@libs/common/exceptions/exception.filter';
import * as morgan from 'morgan';
import { TransformInterceptor } from '@libs/common/interceptors/transform.interceptor';
import { EnvironmentKeyFactory } from '@libs/config/environment-key.factory';

async function bootstrap() {
	const app = await NestFactory.create<NestExpressApplication>(AppModule);

	const commonConfig = app.get(EnvironmentKeyFactory).getCommonConfig();

	app.enableCors({
		origin: commonConfig.corsOrigin,
		methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
		preflightContinue: false,
		credentials: true,
	});

	const reflector = app.get(Reflector);
	// app.useGlobalInterceptors(new TransformInterceptor(reflector));
	app.useGlobalFilters(new GlobalExceptionFilter());
	app.useGlobalPipes(new ValidationPipe());
	app.setGlobalPrefix('api');
	app.enableVersioning({
		type: VersioningType.URI,
		defaultVersion: commonConfig.apiVersion,
	});

	setupSwagger(app);

	app.use(morgan('combined'));

	const PORT = commonConfig.port;
	await app.listen(PORT, () => {
		Logger.log(`Server is listening on PORT: ${PORT}`);
	});
}

bootstrap();
