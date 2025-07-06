import { Module } from '@nestjs/common';
import { AuthController } from './infrastructure/auth.controller';
import {DI_TOKENS} from './di-tokens';
import { GoogleIdentityBroker } from './infrastructure/adapters/security/oauth/google-identity-broker';
import { ExchangeTokenCommandHandler } from './application/commands/handlers/exchange-token.handler';
import { LogoutCommandHandler } from './application/commands/handlers/logout.command.handler';
import { RefreshTokenCommandHandler } from './application/commands/handlers/refresh-token.command.handler';
import { TokenAdapter } from './infrastructure/adapters/security/token/token.adapter';
import { MongoSessionRepository } from './infrastructure/adapters/persistence/mongo-session.repository';
import { MongooseModule } from '@nestjs/mongoose';
import { SessionModel , SessionSchema } from './infrastructure/adapters/persistence/schema/session.schema';
import { MongoUserRepository } from '@modules/users/infrastructure/adapters/persistence/mongo-user.repository';
import { UserModel, UserSchema } from '@modules/users/infrastructure/adapters/persistence/schema/user.schema';
import { AuthService } from './application/services/auth.service';
import { JwtModule } from '@nestjs/jwt';


const CommandHandlers = [
  ExchangeTokenCommandHandler,
  LogoutCommandHandler,
  RefreshTokenCommandHandler,
];

const Repositories = [
  {
    provide: DI_TOKENS.USER_REPOSITORY,
    useClass: MongoUserRepository,
  },
  {
    provide: DI_TOKENS.SESSION_REPOSITORY,
    useClass: MongoSessionRepository,
  },
];

const AuthProviders = [
  {
    provide: DI_TOKENS.TOKEN_PORT,
    useClass: TokenAdapter, 
  },
  {
    provide: DI_TOKENS.OAUTH_PROVIDER,
    useClass: GoogleIdentityBroker,
  },
];

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: SessionModel.name, schema: SessionSchema },
      { name: UserModel.name, schema: UserSchema },
    ]),
    JwtModule.register({})
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    ...CommandHandlers,
    ...Repositories,
    ...AuthProviders,
  ],
  exports: [
    ...Repositories,
  ]
})
export class AuthModule {}
