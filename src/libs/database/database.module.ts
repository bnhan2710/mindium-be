import { MongoDbModule } from './mongodb/mongodb.module';
import { Module } from '@nestjs/common';

@Module({
	imports: [MongoDbModule],
	exports: [MongoDbModule],
})
export class DatabaseModule {}
