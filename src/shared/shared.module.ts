import { Global, Module } from '@nestjs/common';
import { DigestService } from './services';
import { CqrsModule } from '@nestjs/cqrs';
@Global()
@Module({
	imports: [
		CqrsModule.forRoot({}),
	],
	providers: [DigestService],
	exports: [DigestService,CqrsModule],
})

export class SharedModule {}
