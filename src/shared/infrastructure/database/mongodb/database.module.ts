import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { EnvironmentKeyFactory } from '@configs/environment-key.factory';

@Module({
	imports: [
		MongooseModule.forRootAsync({
			inject: [EnvironmentKeyFactory],
			useFactory: (environmentKeyFactory: EnvironmentKeyFactory) => ({
				uri: environmentKeyFactory.getDbURI(),
				dbName: environmentKeyFactory.getDbName(),
			}),
		}),
	],
	exports: [MongooseModule],
})
export class DatabaseModule {}
