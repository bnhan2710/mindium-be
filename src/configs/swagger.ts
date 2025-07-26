import type { INestApplication } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

import {
	SWAGGER_API_DESCRIPTION,
	SWAGGER_API_PATH,
	SWAGGER_API_TITLE,
	SWAGGER_API_VERSION,
} from '@shared/common/constants';

export function setupSwagger(app: INestApplication): void {
	const documentBuilder = new DocumentBuilder()
		.setTitle(SWAGGER_API_TITLE)
		.setDescription(SWAGGER_API_DESCRIPTION)
		.setVersion(SWAGGER_API_VERSION)
		.addBearerAuth(
			{
				type: 'http',
				scheme: 'Bearer',
				bearerFormat: 'JWT',
				in: 'header',
			},
			'access_token',
		)
		.addSecurityRequirements('access_token');

	const document = SwaggerModule.createDocument(app, documentBuilder.build());
	SwaggerModule.setup(SWAGGER_API_PATH, app, document, {
		swaggerOptions: {
			persistAuthorization: true,
		},
	});
}
