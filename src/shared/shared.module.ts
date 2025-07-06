import { Global, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { DigestService, EnvironmentKeyFactory } from './services';
import { CqrsModule } from '@nestjs/cqrs';
@Global()
@Module({
	imports: [
		ConfigModule.forRoot({
			isGlobal: true,
		}),
        CqrsModule.forRoot({
        }),
	],
	providers: [DigestService, EnvironmentKeyFactory],
	exports: [DigestService, EnvironmentKeyFactory, ConfigModule, CqrsModule],
})
export class SharedModule {}
