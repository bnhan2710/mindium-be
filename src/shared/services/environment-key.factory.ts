import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtModuleOptions } from '@nestjs/jwt';
import { isBooleanString } from 'class-validator';

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

	getJwtConfig(): JwtModuleOptions {
		return {
			secret: this.getString('JWT_SECRET'),
		};
	}

	getSaltRounds(): number {
		return this.getNumber('SALT_ROUNDS');
	}

	getAccessTokenExpiration(): string {
		return this.getString('ACCESS_TOKEN_EXPIRATION');
	}

	getRefreshTokenExpiration(): string {
		return this.getString('REFRESH_TOKEN_EXPIRATION');
	}

	getMongodbURI(): string {
		return this.getString('MONGO_URI');
	}

	getMongodbDbName(): string {
		return this.getString('MONGO_DB_NAME');
	}

	getGoogleClientId(): string {
		return this.getString('GOOGLE_CLIENT_ID');
	}

	getGoogleClientSecret(): string {
		return this.getString('GOOGLE_CLIENT_SECRET');
	}

	getGoogleRedirectUrl(): string {
		return this.getString('GOOGLE_REDIRECT_URL');
	}
}
