import { Module } from '@nestjs/common';
import { AuthController } from './infrastructure/auth.controller';
import {DI_TOKENS} from './di-tokens';
import { GoogleIdentityBroker } from './infrastructure/adapter/security/oauth/google-identity-broker';
import { ExchangeTokenCommandHandler } from './application/commands/handlers/exchange-token.handler';
import { AuthService } from './domain/services/auth.service';
import { IOAuthProvider } from './domain/ports/oauth/oauth-provider';
import { SessionRepository } from './infrastructure/adapter/persistence/mongo-session.repository';
import { MongooseModule } from '@nestjs/mongoose';
import { Session , SessionSchema } from './infrastructure/adapter/persistence/schema/session.schema';


const CommandHandlers = [
  ExchangeTokenCommandHandler,
];

const Repositories = [
  // {
  //   provide: DI_TOKENS.USER_REPOSITORY,
  //   useClass: UserRepository,
  // },
  {
    provide: DI_TOKENS.SESSION_REPOSITORY,
    useClass: SessionRepository,
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
      { name: Session.name, schema: SessionSchema },
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
