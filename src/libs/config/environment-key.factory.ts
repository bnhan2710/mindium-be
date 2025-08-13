import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtModuleOptions } from '@nestjs/jwt';
import { isBooleanString } from 'class-validator';
import { RabbitMQConfig } from './rabbitmq.config';

@Injectable()
export class EnvironmentKeyFactory {
	constructor(private readonly configService: ConfigService) {}

	private getNumber(key: string): number {
		const value = Number(this.get(key));

		if (isNaN(value)) {
			throw new Error(key + ' environment variable is not a number');
		}

		return value;
	}

	private getBoolean(key: string): boolean {
		const value = this.get(key).toLowerCase();

		if (!isBooleanString(value)) {
			throw new Error(`${key} environment variable is not a boolean`);
		}

		return value === 'true';
	}

	private getString(key: string): string {
		const value = this.get(key);

		return value.replace(/\\n/g, '\n');
	}

	private get(key: string): string {
		const value = this.configService.get(key);

		if (!value) {
			throw new Error(`Missing key: ${key} in environment setup`);
		}

		return value;
	}

	getCommonConfig(): Record<string, any> {
		return {
			port: this.configService.get('PORT') || 8000,
			corsOrigin: this.configService.get('CORS_ORIGIN') || '*',
			apiVersion: this.configService.get('API_VERSION') || 'v1',
			nodeEnv: this.configService.get('NODE_ENV') || 'development',
		};
	}
	getMongoDbConfig(): { uri: string; dbName: string } {
		return {
			uri: this.getString('MONGO_URI'),
			dbName: this.getString('MONGO_DB_NAME') || 'medium-clone',
		};
	}

	getAuthConfig(): {
		jwtSecret: string;
		accessTokenExpiration: string;
		refreshTokenExpiration: string;
		saltRounds: number;

	} {
		return {
			jwtSecret: this.getString('JWT_SECRET'),
			accessTokenExpiration: this.getString('ACCESS_TOKEN_EXPIRATION'),
			refreshTokenExpiration: this.getString('REFRESH_TOKEN_EXPIRATION'),
			saltRounds: this.getNumber('SALT_ROUNDS'),
		};
	}

	getGoogleOAuthConfig(): {
		clientId: string;
		clientSecret: string;
		redirectUrl: string;
		clientUrl: string;
	} {
		return {
			clientId: this.getString('GOOGLE_OAUTH_CLIENT_ID'),
			clientSecret: this.getString('GOOGLE_OAUTH_CLIENT_SECRET'),
			redirectUrl: this.getString('GOOGLE_OAUTH_REDIRECT_URL'),
			clientUrl: this.getString('CLIENT_URL')
		};
	}


	getRabbitMQConfig(): RabbitMQConfig {
		return {
			url: this.getString('RABBITMQ_URL'),
			queue: this.getString('RABBITMQ_QUEUE') || 'blog-system-queue',
			exchange: this.getString('RABBITMQ_EXCHANGE') || 'blog-system-exchange',
			routingKey: this.getString('RABBITMQ_ROUTING_KEY') || 'blog.events',
			prefetch: this.getNumber('RABBITMQ_PREFETCH') || 10,
		};
	}

}
