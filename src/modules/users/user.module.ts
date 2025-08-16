import { Module } from '@nestjs/common';
import { MongoUserRepository } from './infrastructure/persistence/mongodb/mongo-user.repository';
import {
	UserModel,
	UserSchema,
} from './infrastructure/persistence/schema/user.schema';
import { USER_TOKENS } from './user.tokens';
import { CQRSModule } from '@libs/cqrs/cqrs.module';
import { MongooseModule } from '@nestjs/mongoose';
import { UserController } from './presentation/http/controllers/user.controller';
import { GetUserProfileQueryHandler } from './application/queries/handlers/get-user-profile.query-handler';
import { CreateUserCommandHandler } from './application/commands/handlers/create-user.command.handler';
import { CreateUserIfNotExistCommandHandler } from './application/commands/handlers/create-user-if-not-exist.command-handler';
import { GetUserByIdsQueryHandler } from './application/queries/handlers/get-user-by-ids.query-handler';
import { EditProfileCommandHandler } from './application/commands/handlers/edit-profile.command-handler';

const QueryHandlers = [GetUserProfileQueryHandler, GetUserByIdsQueryHandler];

const CommandHandlers = [
	CreateUserCommandHandler,
	CreateUserIfNotExistCommandHandler,
	EditProfileCommandHandler,
];

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
