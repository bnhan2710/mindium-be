import { Global, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { DigestService, EnvironmentKeyFactory } from './services';

@Global()
@Module({
	imports: [
		ConfigModule.forRoot({
			isGlobal: true,
		}),
	],
	providers: [DigestService, EnvironmentKeyFactory],
	exports: [DigestService, EnvironmentKeyFactory, ConfigModule],
})
export class SharedModule {}
