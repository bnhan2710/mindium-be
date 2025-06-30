import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { EnvironmentKeyFactory } from '@shared/services/environment-key.factory';

@Module({
  imports: [
    MongooseModule.forRootAsync({
      inject: [EnvironmentKeyFactory],
      useFactory: (environmentKeyFactory: EnvironmentKeyFactory) => ({
        uri: environmentKeyFactory.getMongodbURI(),
        dbName: environmentKeyFactory.getMongodbDbName(),
        useNewUrlParser: true,
        useUnifiedTopology: true,
      }),
    }),
  ],
  exports: [MongooseModule],
})
export class DatabaseModule {}
