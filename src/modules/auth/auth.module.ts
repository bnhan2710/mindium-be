import { Module } from '@nestjs/common';
import { AuthController } from './presentation/http/controllers/auth.controller';
import { AUTH_DI_TOKENS } from './auth.di-tokens';
import { USER_DI_TOKENS } from '@modules/users/user.di-tokens';
import { GoogleIdentityBroker } from './infrastructure/adapters/security/oauth/google-identity-broker';
import { LoginCommandHandler } from './application/commands/handlers/login.command-handler';
import { LogoutCommandHandler } from './application/commands/handlers/logout.command-handler';
import { RefreshTokenCommandHanlder } from './application/commands/handlers/refresh-token.command-hanlder';
import { TokenAdapter } from './infrastructure/adapters/security/token/token.adapter';
import { MongoSessionRepository } from './infrastructure/adapters/persistence/mongodb/mongo-session.repository';
import { MongooseModule } from '@nestjs/mongoose';
import {
	SessionModel,
	SessionSchema,
} from './infrastructure/adapters/persistence/schema/session.schema';
import { MongoUserRepository } from '@modules/users/infrastructure/adapters/persistence/mongodb/mongo-user.repository';
import {
	UserModel,
	UserSchema,
} from '@modules/users/infrastructure/adapters/persistence/schema/user.schema';
import { AuthService } from './application/services/authentication-application.service';
import { JwtModule } from '@nestjs/jwt';

const commandHandlers = [
	LoginCommandHandler,
	LogoutCommandHandler,
	RefreshTokenCommandHanlder,
];

const repositories = [
	{
		provide: USER_DI_TOKENS.USER_REPOSITORY,
		useClass: MongoUserRepository,
	},
	{
		provide: AUTH_DI_TOKENS.SESSION_REPOSITORY,
		useClass: MongoSessionRepository,
	},
];

const authProviders = [
	{
		provide: AUTH_DI_TOKENS.TOKEN_PORT,
		useClass: TokenAdapter,
	},
	{
		provide: AUTH_DI_TOKENS.OAUTH_PROVIDER,
		useClass: GoogleIdentityBroker,
	},
];

@Module({
	imports: [
		MongooseModule.forFeature([
			{ name: SessionModel.name, schema: SessionSchema },
			{ name: UserModel.name, schema: UserSchema },
		]),
		JwtModule.register({}),
	],
	controllers: [AuthController],
	providers: [AuthService, ...commandHandlers, ...repositories, ...authProviders],
	exports: [...repositories, AuthService],
})
export class AuthModule {}
