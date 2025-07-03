import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { ExchangeTokenCommand } from '../implements/exchange-token.command';
import { TokenPair } from '@modules/auth/domain/value-objects/token-pair.vo';
import { IOAuthProvider } from '@modules/auth/domain/ports/oauth/oauth-provider';
import { IUserRepository } from '@modules/user/domain/repositories/user.repository';
import { AuthService } from '@modules/auth/domain/services/auth.service';


@CommandHandler(ExchangeTokenCommand)
export class ExchangeTokenHandler implements ICommandHandler<ExchangeTokenCommand> {
constructor(
    private readonly oAuthProvider: IOAuthProvider,
    private readonly userRepository: IUserRepository,
    private readonly authService: AuthService
    
) {}
  async execute(command: ExchangeTokenCommand): Promise<TokenPair> {
    const { code } = command;

    const idpToken = await this.oAuthProvider.exchangeWithIDP(code);
    const userProfile = await this.oAuthProvider.fetchProfile({
      idToken: idpToken.idToken,
      accessToken: idpToken.accessToken,
    });
    
    const user = await this.userRepository.createUserIfNotExists(
      userProfile.email,
      userProfile.name,
      userProfile.picture
    );

    const tokenPair = await this.authService.createSessionAndTokens(user);
    
    return tokenPair;
  }
} 