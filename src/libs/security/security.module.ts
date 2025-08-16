import { Global, Module } from '@nestjs/common';
import { DigestService } from '../services';
import { JwtModule } from '@nestjs/jwt';
import { EnvironmentKeyFactory } from '@libs/config/environment-key.factory';
@Global()
@Module({
	imports: [
		JwtModule.registerAsync({
			useFactory: (envFactory: EnvironmentKeyFactory) => ({
				secret: envFactory.getAuthConfig().jwtSecret,
				signOptions: {
					expiresIn: envFactory.getAuthConfig().accessTokenExpiration,
				},
			}),
			inject: [EnvironmentKeyFactory],
		}),
	],
	providers: [DigestService],
	exports: [DigestService, JwtModule],
})
export class SecurityModule {}
