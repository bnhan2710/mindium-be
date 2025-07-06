import { Test, TestingModule } from '@nestjs/testing';
import { ExchangeTokenCommandHandler } from './application/commands/handlers/exchange-token.handler';
import { ExchangeTokenCommand } from './application/commands/implements/exchange-token.command';
import { TokenPair } from './domain/value-objects/token-pair.vo';
import { IOAuthProvider, IDPToken, UserProfile } from './domain/ports/oauth/oauth-provider';
import { IUserRepository } from '../users/domain/ports/repositories/user.repository';
import { AuthService } from './application/services/auth.service';
import { UserEntity } from '../users/domain/entities/user.entity';
import { DI_TOKENS } from './di-tokens';

describe('ExchangeTokenCommandHandler', () => {
  let handler: ExchangeTokenCommandHandler;
  let mockOAuthProvider: jest.Mocked<IOAuthProvider>;
  let mockUserRepository: jest.Mocked<IUserRepository>;
  let mockAuthService: jest.Mocked<AuthService>;

  const mockIDPToken: IDPToken = {
    accessToken: 'mock-access-token',
    idToken: 'mock-id-token',
  };

  const mockUserProfile: UserProfile = {
    id: 'user-123',
    email: 'test@example.com',
    name: 'Test User',
    picture: 'https://example.com/avatar.jpg',
  };

  const mockUser: UserEntity = new UserEntity({
    id: 'user-123',
    email: 'test@example.com',
    name: 'Test User',
    avatar: 'https://example.com/avatar.jpg',
  });

  const mockTokenPair: TokenPair = new TokenPair(
    'mock-access-token',
    'mock-refresh-token',
    'user-123'
  );

  beforeEach(async () => {
    const mockOAuthProviderValue = {
      exchangeAuthorizationCode: jest.fn(),
      fetchProfile: jest.fn(),
    };

    const mockUserRepositoryValue = {
      findById: jest.fn(),
      findByEmail: jest.fn(),
      save: jest.fn(),
      createUserIfNotExists: jest.fn(),
    };

    const mockAuthServiceValue = {
      generateAccessToken: jest.fn(),
      generateRefreshToken: jest.fn(),
      createSessionAndTokens: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ExchangeTokenCommandHandler,
        {
          provide: DI_TOKENS.OAUTH_PROVIDER,
          useValue: mockOAuthProviderValue,
        },
        {
          provide: DI_TOKENS.USER_REPOSITORY,
          useValue: mockUserRepositoryValue,
        },
        {
          provide: AuthService,
          useValue: mockAuthServiceValue,
        },
      ],
    }).compile();

    handler = module.get<ExchangeTokenCommandHandler>(ExchangeTokenCommandHandler);
    mockOAuthProvider = module.get(DI_TOKENS.OAUTH_PROVIDER);
    mockUserRepository = module.get(DI_TOKENS.USER_REPOSITORY);
    mockAuthService = module.get<AuthService>(AuthService) as jest.Mocked<AuthService>;
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('execute', () => {
    it('should successfully exchange authorization code for tokens', async () => {
      // Arrange
      const command = new ExchangeTokenCommand('auth-code-123');
      
      mockOAuthProvider.exchangeAuthorizationCode.mockResolvedValue(mockIDPToken);
      mockOAuthProvider.fetchProfile.mockResolvedValue(mockUserProfile);
      mockUserRepository.createUserIfNotExists.mockResolvedValue(mockUser);
      mockAuthService.createSessionAndTokens.mockResolvedValue(mockTokenPair);

      // Act
      const result = await handler.execute(command);

      // Assert
      expect(result).toEqual(mockTokenPair);
      expect(mockOAuthProvider.exchangeAuthorizationCode).toHaveBeenCalledWith('auth-code-123');
      expect(mockOAuthProvider.fetchProfile).toHaveBeenCalledWith({
        idToken: mockIDPToken.idToken,
        accessToken: mockIDPToken.accessToken,
      });
      expect(mockUserRepository.createUserIfNotExists).toHaveBeenCalledWith(
        mockUserProfile.email,
        mockUserProfile.name,
        mockUserProfile.picture
      );
      expect(mockAuthService.createSessionAndTokens).toHaveBeenCalledWith(mockUser);
    });

    it('should handle OAuth provider authorization code exchange failure', async () => {
      // Arrange
      const command = new ExchangeTokenCommand('invalid-auth-code');
      const error = new Error('Invalid authorization code');
      
      mockOAuthProvider.exchangeAuthorizationCode.mockRejectedValue(error);

      // Act & Assert
      await expect(handler.execute(command)).rejects.toThrow('Invalid authorization code');
      expect(mockOAuthProvider.exchangeAuthorizationCode).toHaveBeenCalledWith('invalid-auth-code');
      expect(mockOAuthProvider.fetchProfile).not.toHaveBeenCalled();
      expect(mockUserRepository.createUserIfNotExists).not.toHaveBeenCalled();
      expect(mockAuthService.createSessionAndTokens).not.toHaveBeenCalled();
    });

    it('should handle OAuth provider profile fetch failure', async () => {
      // Arrange
      const command = new ExchangeTokenCommand('auth-code-123');
      const error = new Error('Failed to fetch user profile');
      
      mockOAuthProvider.exchangeAuthorizationCode.mockResolvedValue(mockIDPToken);
      mockOAuthProvider.fetchProfile.mockRejectedValue(error);

      // Act & Assert
      await expect(handler.execute(command)).rejects.toThrow('Failed to fetch user profile');
      expect(mockOAuthProvider.exchangeAuthorizationCode).toHaveBeenCalledWith('auth-code-123');
      expect(mockOAuthProvider.fetchProfile).toHaveBeenCalledWith({
        idToken: mockIDPToken.idToken,
        accessToken: mockIDPToken.accessToken,
      });
      expect(mockUserRepository.createUserIfNotExists).not.toHaveBeenCalled();
      expect(mockAuthService.createSessionAndTokens).not.toHaveBeenCalled();
    });

    it('should handle user repository failure', async () => {
      // Arrange
      const command = new ExchangeTokenCommand('auth-code-123');
      const error = new Error('Database connection failed');
      
      mockOAuthProvider.exchangeAuthorizationCode.mockResolvedValue(mockIDPToken);
      mockOAuthProvider.fetchProfile.mockResolvedValue(mockUserProfile);
      mockUserRepository.createUserIfNotExists.mockRejectedValue(error);

      // Act & Assert
      await expect(handler.execute(command)).rejects.toThrow('Database connection failed');
      expect(mockOAuthProvider.exchangeAuthorizationCode).toHaveBeenCalledWith('auth-code-123');
      expect(mockOAuthProvider.fetchProfile).toHaveBeenCalledWith({
        idToken: mockIDPToken.idToken,
        accessToken: mockIDPToken.accessToken,
      });
      expect(mockUserRepository.createUserIfNotExists).toHaveBeenCalledWith(
        mockUserProfile.email,
        mockUserProfile.name,
        mockUserProfile.picture
      );
      expect(mockAuthService.createSessionAndTokens).not.toHaveBeenCalled();
    });

    it('should handle auth service failure', async () => {
      // Arrange
      const command = new ExchangeTokenCommand('auth-code-123');
      const error = new Error('Failed to create session');
      
      mockOAuthProvider.exchangeAuthorizationCode.mockResolvedValue(mockIDPToken);
      mockOAuthProvider.fetchProfile.mockResolvedValue(mockUserProfile);
      mockUserRepository.createUserIfNotExists.mockResolvedValue(mockUser);
      mockAuthService.createSessionAndTokens.mockRejectedValue(error);

      // Act & Assert
      await expect(handler.execute(command)).rejects.toThrow('Failed to create session');
      expect(mockOAuthProvider.exchangeAuthorizationCode).toHaveBeenCalledWith('auth-code-123');
      expect(mockOAuthProvider.fetchProfile).toHaveBeenCalledWith({
        idToken: mockIDPToken.idToken,
        accessToken: mockIDPToken.accessToken,
      });
      expect(mockUserRepository.createUserIfNotExists).toHaveBeenCalledWith(
        mockUserProfile.email,
        mockUserProfile.name,
        mockUserProfile.picture
      );
      expect(mockAuthService.createSessionAndTokens).toHaveBeenCalledWith(mockUser);
    });

    it('should handle user profile without picture', async () => {
      // Arrange
      const command = new ExchangeTokenCommand('auth-code-123');
      const userProfileWithoutPicture: UserProfile = {
        id: 'user-123',
        email: 'test@example.com',
        name: 'Test User',
        // picture is undefined
      };
      
      mockOAuthProvider.exchangeAuthorizationCode.mockResolvedValue(mockIDPToken);
      mockOAuthProvider.fetchProfile.mockResolvedValue(userProfileWithoutPicture);
      mockUserRepository.createUserIfNotExists.mockResolvedValue(mockUser);
      mockAuthService.createSessionAndTokens.mockResolvedValue(mockTokenPair);

      // Act
      const result = await handler.execute(command);

      // Assert
      expect(result).toEqual(mockTokenPair);
      expect(mockUserRepository.createUserIfNotExists).toHaveBeenCalledWith(
        userProfileWithoutPicture.email,
        userProfileWithoutPicture.name,
        undefined
      );
    });

    it('should verify all method calls are made', async () => {
      // Arrange
      const command = new ExchangeTokenCommand('auth-code-123');
      
      mockOAuthProvider.exchangeAuthorizationCode.mockResolvedValue(mockIDPToken);
      mockOAuthProvider.fetchProfile.mockResolvedValue(mockUserProfile);
      mockUserRepository.createUserIfNotExists.mockResolvedValue(mockUser);
      mockAuthService.createSessionAndTokens.mockResolvedValue(mockTokenPair);

      // Act
      await handler.execute(command);

      // Assert - verify all methods were called exactly once
      expect(mockOAuthProvider.exchangeAuthorizationCode).toHaveBeenCalledTimes(1);
      expect(mockOAuthProvider.fetchProfile).toHaveBeenCalledTimes(1);
      expect(mockUserRepository.createUserIfNotExists).toHaveBeenCalledTimes(1);
      expect(mockAuthService.createSessionAndTokens).toHaveBeenCalledTimes(1);
    });

    it('should handle empty authorization code', async () => {
      // Arrange
      const command = new ExchangeTokenCommand('');
      
      mockOAuthProvider.exchangeAuthorizationCode.mockResolvedValue(mockIDPToken);
      mockOAuthProvider.fetchProfile.mockResolvedValue(mockUserProfile);
      mockUserRepository.createUserIfNotExists.mockResolvedValue(mockUser);
      mockAuthService.createSessionAndTokens.mockResolvedValue(mockTokenPair);

      // Act
      const result = await handler.execute(command);

      // Assert
      expect(result).toEqual(mockTokenPair);
      expect(mockOAuthProvider.exchangeAuthorizationCode).toHaveBeenCalledWith('');
    });
  });
});
