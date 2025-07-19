import { Global, Module } from '@nestjs/common';
import { DigestService } from './services';
@Global()
@Module({
	providers: [DigestService],
	exports: [DigestService],
})
export class SharedModule {}
