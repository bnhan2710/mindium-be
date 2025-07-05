import { Module } from '@nestjs/common';
import { AuthController } from './infrastructure/auth.controller';
import {DI_TOKENS} from './di-tokens';
import { GoogleIdentityBroker } from './infrastructure/adapters/security/oauth/google-identity-broker';
import { ExchangeTokenCommandHandler } from './application/commands/handlers/exchange-token.handler';
import { AuthService } from './domain/services/auth.service';
import { MongoSessionRepository } from './infrastructure/adapters/persistence/mongo-session.repository';
import { MongooseModule } from '@nestjs/mongoose';
import { SessionModel , SessionSchema } from './infrastructure/adapters/persistence/schema/session.schema';
import { MongoUserRepository } from '@modules/users/infrastructure/adapters/persistence/mongo-user.repository';
import { UserModel, UserSchema } from '@modules/users/infrastructure/adapters/persistence/schema/user.schema';

const CommandHandlers = [
  ExchangeTokenCommandHandler,
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

const OAuthProviders = [
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
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    ...CommandHandlers,
    ...Repositories,
    ...OAuthProviders,
  ],
  exports: [
    AuthService,
    ...Repositories,
  ]
})
export class AuthModule {}
