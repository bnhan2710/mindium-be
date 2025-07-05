import { Module } from '@nestjs/common';
import { IUserRepository } from './domain/ports/repositories/user.repository';
import { MongoUserRepository } from './infrastructure/adapters/persistence/mongo-user.repository';
import { UserModel, UserSchema } from './infrastructure/adapters/persistence/schema/user.schema';
import { DI_TOKENS } from './di-tokens';
import { MongooseModule } from '@nestjs/mongoose';

const Repositories = [
  {
    provide: DI_TOKENS.USER_REPOSITORY,
    useClass: MongoUserRepository,
  },
];

@Module({
    imports: [
        MongooseModule.forFeature([
            { name: UserModel.name, schema: UserSchema },
        ]),
    ],
    providers: [
        ...Repositories,
        MongoUserRepository,
    ],
    exports: [
        ...Repositories,
        MongoUserRepository,
    ],
    controllers: [],
})
export class UserModule {}
