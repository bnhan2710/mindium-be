import { Global, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { EnvironmentKeyFactory } from './environment-key.factory';
@Global()
@Module({
	imports: [
		ConfigModule.forRoot({
			isGlobal: true,
		}),
	],
	providers: [EnvironmentKeyFactory],
	exports: [EnvironmentKeyFactory, ConfigModule],
})
export class ConfigsModule {}
