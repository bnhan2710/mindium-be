import { User } from '@modules/users/domain/entities/user.entity';
import { Session } from '../entities/session.entity';
import { TokenPair } from '../value-objects/token-pair.vo';
import { ISessionRepository } from '../ports/repositories/session.repository';
import jwt from 'jsonwebtoken';
import { EnvironmentKeyFactory } from '@shared/services';
import { v4 as uuidv4 } from 'uuid';
import { Inject, Injectable } from '@nestjs/common';
import { DI_TOKENS } from '@modules/auth/di-tokens';

@Injectable()
export class AuthService {
  constructor(

    @Inject(DI_TOKENS.SESSION_REPOSITORY)
    private readonly sessionRepository: ISessionRepository,
  @Inject(EnvironmentKeyFactory) private readonly envFactory: EnvironmentKeyFactory,
  ) {}

  async generateAccessToken(payload): Promise<string> {
      return jwt.sign(payload, this.envFactory.getJwtConfig(), {
      expiresIn: this.envFactory.getAccessTokenExpiration(),
      });
    }

  async generateRefreshToken(payload): Promise<string> {
      return jwt.sign(payload, this.envFactory.getJwtConfig(), {
      expiresIn: this.envFactory.getRefreshTokenExpiration(),
        });
    }

  private verifyToken(token: string, secret: string): any {
    return jwt.verify(token, secret);
  }

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

    const accessToken = await this.generateAccessToken(payload);
    const refreshToken = await this.generateRefreshToken({ sessionId });

    return new TokenPair(accessToken, refreshToken, user.id);
  }
}