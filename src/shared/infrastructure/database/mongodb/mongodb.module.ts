import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { EnvironmentKeyFactory } from '@libs/config/environment-key.factory';

@Module({
	imports: [
		MongooseModule.forRootAsync({
			inject: [EnvironmentKeyFactory],
			useFactory: (environmentKeyFactory: EnvironmentKeyFactory) => ({
				uri: environmentKeyFactory.getMongoDbConfig().uri,
				dbName: environmentKeyFactory.getMongoDbConfig().dbName,
			}),
		}),
	],
	exports: [MongooseModule],
})
export class MongoDbModule {}
