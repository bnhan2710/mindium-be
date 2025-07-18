import { Module } from '@nestjs/common';
import { AuthController } from './presentation/http/controllers/auth.controller';
import { AUTH_TOKENS } from './auth.tokens';
import { USER_TOKENS } from '@modules/users/user.tokens';
import { GoogleIdentityBroker } from './infrastructure/adapters/security/oauth/google-identity-broker';
import { ExchangeTokenCommandHandler } from './application/commands/handlers/exchange-token.command-handler';
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
import { AuthService } from './domain/services/authentication-domain.service';
import { JwtModule } from '@nestjs/jwt';

const commandHandlers = [
	ExchangeTokenCommandHandler,
	LogoutCommandHandler,
	RefreshTokenCommandHanlder,
];

const repositories = [
	{
		provide: USER_TOKENS.USER_REPOSITORY,
		useClass: MongoUserRepository,
	},
	{
		provide: AUTH_TOKENS.SESSION_REPOSITORY,
		useClass: MongoSessionRepository,
	},
];

const authProviders = [
	{
		provide: AUTH_TOKENS.TOKEN_PORT,
		useClass: TokenAdapter,
	},
	{
		provide: AUTH_TOKENS.OAUTH_PROVIDER,
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
