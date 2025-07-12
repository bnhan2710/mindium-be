import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { NestExpressApplication } from '@nestjs/platform-express';
import { commonConfig } from 'src/configs/common.config';
import { Logger, ValidationPipe, VersioningType } from '@nestjs/common';
import { setupSwagger } from 'src/configs/swagger';
import { GlobalExceptionFilter } from '@shared/common/exceptions/exception.filter';
import * as morgan from 'morgan';

async function bootstrap() {
	const app = await NestFactory.create<NestExpressApplication>(AppModule);

	app.enableCors({
		origin: commonConfig.corsOrigin,
		methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
		preflightContinue: false,
		credentials: true,
	});

	app.useGlobalFilters(new GlobalExceptionFilter());
	app.useGlobalPipes(new ValidationPipe());
	app.setGlobalPrefix('api');
	app.enableVersioning({
		type: VersioningType.URI,
		defaultVersion: commonConfig.apiVersion,
	});

	setupSwagger(app);

	app.use(morgan('combined'));

	const PORT = commonConfig.PORT;
	await app.listen(PORT, () => {
		Logger.log(`Server is listening on PORT: ${PORT}`);
	});
}

bootstrap();
