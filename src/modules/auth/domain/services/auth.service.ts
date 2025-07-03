import { User } from '@modules/user/domain/entities/user.entity';
import { Session } from '../entities/session.entity';
import { TokenPair } from '../value-objects/token-pair.vo';
import { ISessionRepository } from '../ports/repositories/session.repository';
import { ITokenPort } from '../ports/token/token.port';
import { v4 as uuidv4 } from 'uuid';

export class AuthService {
  constructor(
    private readonly sessionRepository: ISessionRepository,
    private readonly tokenPort: ITokenPort,
  ) {}

  async createSessionAndTokens(user: User): Promise<TokenPair> {
    const sessionId = uuidv4();
    const session = new Session({
      sessionId,
      userId: user.id,
    });
    await this.sessionRepository.save(session);

    const payload = {
      _id: user.id,
      sub: user.id,
      email: user.email,
    };

    const accessToken = this.tokenPort.generateAccessToken(payload);
    const refreshToken = this.tokenPort.generateRefreshToken(payload);

    return new TokenPair(accessToken, refreshToken, user.id);
  }
}