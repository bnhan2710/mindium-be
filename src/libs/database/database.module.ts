import { MongoDbModule } from '@shared/infrastructure/database/mongodb/mongodb.module';
import { Module } from '@nestjs/common';

@Module({
	imports: [MongoDbModule],
	exports: [MongoDbModule],
})
export class DatabaseModule {}
