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
import { CreateUserCommandHandler } from './application/commands/handlers/create-user.command.handler';
import { CreateUserIfNotExistCommandHandler } from './application/commands/handlers/create-user-if-not-exist.command-handler';
import { CQRSModule } from '@shared/cqrs/cqrs.module';

const QueryHandlers = [GetUserProfileQueryHandler];

const CommandHandlers = [CreateUserCommandHandler, CreateUserIfNotExistCommandHandler];

const Repositories = [
	{
		provide: USER_TOKENS.REPOSITORY,
		useClass: MongoUserRepository,
	},
];

@Module({
	imports: [
		CQRSModule,
		MongooseModule.forFeature([{ name: UserModel.name, schema: UserSchema }]),
	],
	providers: [
		...CommandHandlers,
		...QueryHandlers,
		...Repositories,
		MongoUserRepository,
	],
	exports: [
		...Repositories,
		MongoUserRepository,
		{
			provide: USER_TOKENS.REPOSITORY,
			useExisting: USER_TOKENS.REPOSITORY,
		},
	],
	controllers: [UserController],
})
export class UserModule {}
