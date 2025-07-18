import { Module } from '@nestjs/common';
import { MongoUserRepository } from './infrastructure/adapters/persistence/mongodb/mongo-user.repository';
import {
	UserModel,
	UserSchema,
} from './infrastructure/adapters/persistence/schema/user.schema';
import { USER_TOKENS } from './user.tokens';
import { MongooseModule } from '@nestjs/mongoose';
import { UserController } from './presentation/http/controllers/user.controller';
import { GetUserProfileQueryHandler } from './application/queries/handlers/get-user-profile.query-handler';
import { GetFollowerQueryHandler } from './application/queries/handlers/get-follower.query-handler';
import { GetFollowingQueryHandler } from './application/queries/handlers/get-folllowing.query-handler';
import { CreateUserCommandHandler } from './application/commands/handlers/create-user.command.handler';

const QueryHandlers = [
	GetUserProfileQueryHandler,
	GetFollowerQueryHandler,
	GetFollowingQueryHandler,
];

const CommandHandlers = [CreateUserCommandHandler];

const Repositories = [
	{
		provide: USER_TOKENS.USER_REPOSITORY,
		useClass: MongoUserRepository,
	},
];

@Module({
	imports: [MongooseModule.forFeature([{ name: UserModel.name, schema: UserSchema }])],
	providers: [
		...CommandHandlers,
		...QueryHandlers,
		...Repositories,
		MongoUserRepository,
	],
	exports: [...Repositories, MongoUserRepository],
	controllers: [UserController],
})
export class UserModule {}
