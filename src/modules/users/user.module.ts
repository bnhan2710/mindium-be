import { Module } from '@nestjs/common';
import { MongoUserRepository } from './infrastructure/adapters/persistence/mongodb/mongo-user.repository';
import {
	UserModel,
	UserSchema,
} from './infrastructure/adapters/persistence/schema/user.schema';
import { USER_DI_TOKENS } from './user.di-tokens';
import { MongooseModule } from '@nestjs/mongoose';
import { UserController } from './presentation/controllers/user.controller';
import { GetUserProfileQueryHandler } from './application/queries/handlers/get-user-profile.handler';
import { GetFollowerQueryHandler } from './application/queries/handlers/get-follower.handler';
import { GetFollowingQueryHandler } from './application/queries/handlers/get-folllowing.handler';

const QueryHandlers = [GetUserProfileQueryHandler,GetFollowerQueryHandler,GetFollowingQueryHandler];

const Repositories = [
	{
		provide: USER_DI_TOKENS.USER_REPOSITORY,
		useClass: MongoUserRepository,
	},
];

@Module({
	imports: [MongooseModule.forFeature([{ name: UserModel.name, schema: UserSchema }])],
	providers: [...QueryHandlers, ...Repositories, MongoUserRepository],
	exports: [...Repositories, MongoUserRepository],
	controllers: [UserController],
})
export class UserModule {}
