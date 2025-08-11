import { Global, Module } from '@nestjs/common';
import { DigestService } from './services';
import { JwtModule } from '@nestjs/jwt';
import { EnvironmentKeyFactory } from 'src/libs/environment-key.factory';
@Global()
@Module({
	imports: [
		JwtModule.registerAsync({
			useFactory: (envFactory: EnvironmentKeyFactory) => ({
				secret: envFactory.getJwtConfig().secret,
				signOptions: {
					expiresIn: envFactory.getAccessTokenExpiration(),
				},
			}),
			inject: [EnvironmentKeyFactory],
		}),
	],
	providers: [DigestService],
	exports: [DigestService, JwtModule],
})
export class SharedModule {}
