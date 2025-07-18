# Domain Patterns & Anti-Patterns for GitHub Copilot

## ✅ GOOD PATTERNS

### 1. Domain Entity Pattern
```typescript
// ✅ GOOD: Pure domain entity with business logic
export class User {
    private readonly props: UserProps;
    
    constructor(props: UserProps) {
        this.validateInvariants(props);
        this.props = props;
    }
    
    // Business method with domain validation
    public updateProfile(name: string, avatar?: string): void {
        if (!name?.trim()) {
            throw new InvalidUserDataError('Name is required');
        }
        
        if (name.length < 2) {
            throw new InvalidUserDataError('Name must be at least 2 characters');
        }
        
        this.props.name = name;
        if (avatar) {
            this.props.avatar = avatar;
        }
        this.props.updatedAt = new Date();
    }
}
```

### 2. Repository Interface Pattern
```typescript
// ✅ GOOD: Interface in domain layer
export interface IUserRepository {
    findById(id: string): Promise<User | null>;
    findByEmail(email: string): Promise<User | null>;
    save(user: User): Promise<void>;
    delete(id: string): Promise<void>;
}
```

### 3. CQRS Command Handler Pattern
```typescript
// ✅ GOOD: Command handler with proper DI
@CommandHandler(CreateUserCommand)
export class CreateUserHandler implements ICommandHandler<CreateUserCommand> {
    constructor(
        @Inject(USER_DI_TOKENS.USER_REPOSITORY)
        private readonly userRepository: IUserRepository,
    ) {}
    
    async execute(command: CreateUserCommand): Promise<void> {
        // Check business rules
        const existingUser = await this.userRepository.findByEmail(command.email);
        if (existingUser) {
            throw new UserAlreadyExistsError(command.email);
        }
        
        // Create domain entity
        const user = User.create({
            email: command.email,
            name: command.name,
        });
        
        // Persist
        await this.userRepository.save(user);
    }
}
```

### 4. Query Handler Pattern
```typescript
// ✅ GOOD: Query handler returning DTO
@QueryHandler(GetUserProfileQuery)
export class GetUserProfileHandler implements IQueryHandler<GetUserProfileQuery> {
    constructor(
        @Inject(USER_DI_TOKENS.USER_REPOSITORY)
        private readonly userRepository: IUserRepository,
    ) {}
    
    async execute(query: GetUserProfileQuery): Promise<UserResponseDto> {
        const user = await this.userRepository.findById(query.userId);
        if (!user) {
            throw new UserNotFoundError(query.userId);
        }
        
        return UserResponseDto.fromDomain(user);
    }
}
```

### 5. Controller Pattern
```typescript
// ✅ GOOD: Thin controller using CQRS
@Controller({ path: 'users', version: '1' })
export class UserController {
    constructor(
        private readonly queryBus: QueryBus,
        private readonly commandBus: CommandBus,
    ) {}
    
    @Get(':userId')
    async getUserProfile(
        @Param('userId', ObjectIdValidationPipe) userId: string
    ): Promise<UserResponseDto> {
        return await this.queryBus.execute(new GetUserProfileQuery(userId));
    }
}
```

### 6. DTO Pattern
```typescript
// ✅ GOOD: DTO with fromDomain method
export class UserResponseDto {
    public readonly id: string;
    public readonly email: string;
    public readonly name: string;
    
    private constructor(id: string, email: string, name: string) {
        this.id = id;
        this.email = email;
        this.name = name;
    }
    
    static fromDomain(user: User): UserResponseDto {
        return new UserResponseDto(
            user.getId().getValue(),
            user.getEmail(),
            user.getName()
        );
    }
}
```

## ❌ BAD PATTERNS (ANTI-PATTERNS)

### 1. Framework Dependencies in Domain
```typescript
// ❌ BAD: Domain entity with framework imports
import { Injectable } from '@nestjs/common'; // ❌ NO!
import { InjectModel } from '@nestjs/mongoose'; // ❌ NO!

export class User {
    // ❌ BAD: Framework decorators in domain
    @Injectable()
    constructor() {}
}
```

### 2. Repository Implementation in Domain
```typescript
// ❌ BAD: Concrete implementation in domain
export class UserRepository { // ❌ Should be interface
    constructor(
        @InjectModel(UserModel.name) // ❌ Framework dependency
        private userModel: Model<UserDocument>
    ) {}
}
```

### 3. Direct Database Access in Controllers
```typescript
// ❌ BAD: Controller with direct repository access
@Controller('users')
export class UserController {
    constructor(
        private readonly userRepository: IUserRepository // ❌ Should use CQRS
    ) {}
    
    @Get(':id')
    async getUser(@Param('id') id: string) {
        // ❌ BAD: Business logic in controller
        const user = await this.userRepository.findById(id);
        if (!user) {
            throw new NotFoundException('User not found');
        }
        return user; // ❌ BAD: Returning domain entity
    }
}
```

### 4. Anemic Domain Model
```typescript
// ❌ BAD: Entity without business logic
export class User {
    public id: string;
    public email: string;
    public name: string;
    
    // ❌ BAD: No business methods, just getters/setters
    public setName(name: string): void {
        this.name = name; // ❌ No validation
    }
}
```

### 5. Mixed Concerns in Handlers
```typescript
// ❌ BAD: Handler with mixed concerns
@CommandHandler(CreateUserCommand)
export class CreateUserHandler {
    constructor(
        private readonly userRepository: IUserRepository,
        private readonly emailService: EmailService, // ❌ Should be in event handler
        private readonly logger: Logger, // ❌ Infrastructure concern
    ) {}
    
    async execute(command: CreateUserCommand): Promise<void> {
        const user = User.create(command);
        await this.userRepository.save(user);
        
        // ❌ BAD: Side effects in command handler
        await this.emailService.sendWelcomeEmail(user.getEmail());
        this.logger.log('User created');
    }
}
```

## 🎯 SPECIFIC PATTERNS FOR THIS PROJECT

### 1. Authentication Module Pattern
```typescript
// ✅ GOOD: OAuth provider interface
export interface IOAuthProvider {
    exchangeAuthorizationCode(code: string): Promise<TokenPair>;
    fetchProfile(tokens: TokenPair): Promise<UserProfile>;
}

// ✅ GOOD: Implementation in infrastructure
@Injectable()
export class GoogleIdentityBroker implements IOAuthProvider {
    async exchangeAuthorizationCode(code: string): Promise<TokenPair> {
        // Google-specific implementation
    }
}
```

### 2. User Following Pattern
```typescript
// ✅ GOOD: Domain service for complex operations
export class UserFollowingService {
    constructor(
        private readonly userRepository: IUserRepository,
        private readonly eventBus: IEventBus,
    ) {}
    
    async followUser(followerId: string, followeeId: string): Promise<void> {
        if (followerId === followeeId) {
            throw new CannotFollowSelfError();
        }
        
        const follower = await this.userRepository.findById(followerId);
        const followee = await this.userRepository.findById(followeeId);
        
        if (!follower || !followee) {
            throw new UserNotFoundError('User not found');
        }
        
        follower.follow(followee.getId());
        await this.userRepository.save(follower);
        
        // Publish domain event
        await this.eventBus.publish(new UserFollowedEvent(followerId, followeeId));
    }
}
```

### 3. Event-Driven Pattern
```typescript
// ✅ GOOD: Domain event
export class UserFollowedEvent {
    constructor(
        public readonly followerId: string,
        public readonly followeeId: string,
        public readonly occurredAt: Date = new Date(),
    ) {}
}

// ✅ GOOD: Event handler
@EventsHandler(UserFollowedEvent)
export class UserFollowedEventHandler implements IEventHandler<UserFollowedEvent> {
    constructor(
        private readonly feedService: FeedService,
        private readonly notificationService: NotificationService,
    ) {}
    
    async handle(event: UserFollowedEvent): Promise<void> {
        // Update feed
        await this.feedService.addFolloweeToFeed(event.followerId, event.followeeId);
        
        // Send notification
        await this.notificationService.notifyUserFollowed(event.followeeId, event.followerId);
    }
}
```

## 🚫 COMMON MISTAKES TO AVOID

### 1. Circular Dependencies
```typescript
// ❌ BAD: Domain depending on infrastructure
import { MongoUserRepository } from '../infrastructure/...'; // ❌ NO!

// ✅ GOOD: Domain depending on interface
import { IUserRepository } from '../domain/ports/...'; // ✅ YES!
```

### 2. Exposing Domain Entities
```typescript
// ❌ BAD: Returning domain entity from API
@Get(':id')
async getUser(@Param('id') id: string): Promise<User> { // ❌ NO!
    return await this.userRepository.findById(id);
}

// ✅ GOOD: Returning DTO
@Get(':id')
async getUser(@Param('id') id: string): Promise<UserResponseDto> { // ✅ YES!
    const user = await this.userRepository.findById(id);
    return UserResponseDto.fromDomain(user);
}
```

### 3. Business Logic in Infrastructure
```typescript
// ❌ BAD: Business logic in repository
export class MongoUserRepository implements IUserRepository {
    async save(user: User): Promise<void> {
        // ❌ BAD: Validation in repository
        if (user.getEmail().includes('banned.com')) {
            throw new Error('Banned email');
        }
        
        const doc = UserMapper.toPersistence(user);
        await this.userModel.create(doc);
    }
}

// ✅ GOOD: Business logic in domain
export class User {
    constructor(props: UserProps) {
        // ✅ GOOD: Validation in domain
        if (props.email.includes('banned.com')) {
            throw new InvalidEmailError('Email domain is banned');
        }
    }
}
```

## 🎯 CHECKLIST FOR CODE GENERATION

### Before generating code, ask:
1. **Which layer** does this belong to?
2. **What should it depend on?** (Follow dependency direction)
3. **Is this pure business logic?** (Domain layer)
4. **Is this a use case?** (Application layer)
5. **Is this external integration?** (Infrastructure layer)
6. **Is this API handling?** (Presentation layer)

### Domain Layer Checklist:
- [ ] No framework imports
- [ ] Pure TypeScript classes
- [ ] Business logic and validation
- [ ] Domain exceptions
- [ ] Value objects for primitives

### Application Layer Checklist:
- [ ] CQRS pattern (Commands/Queries)
- [ ] Dependency injection with interfaces
- [ ] Return DTOs, not entities
- [ ] Orchestrate domain logic

### Infrastructure Layer Checklist:
- [ ] Implement domain interfaces
- [ ] Framework-specific code
- [ ] Data mapping between layers
- [ ] External service integration

### Presentation Layer Checklist:
- [ ] Thin controllers
- [ ] Use QueryBus/CommandBus
- [ ] Input validation
- [ ] Swagger documentation

## 🎯 REMEMBER

- **Clean Architecture** = Dependencies point inward
- **CQRS** = Separate read and write operations
- **Domain-Driven Design** = Rich domain model with business logic
- **Dependency Inversion** = Depend on abstractions, not concretions
- **Single Responsibility** = Each class has one reason to change 