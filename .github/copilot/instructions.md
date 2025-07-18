# GitHub Copilot Instructions for Blog System (Clean Architecture + CQRS)

## 🏗️ Project Architecture Overview

This is a **Medium Clone** blog system built with **Clean Architecture** and **CQRS** pattern using NestJS, MongoDB, and Redis.

### Core Architecture Principles
- **Clean Architecture** with clear layer separation
- **CQRS** (Command Query Responsibility Segregation)
- **Event-Driven Architecture** with Domain Events
- **Dependency Inversion** - Dependencies point inward
- **Hexagonal Architecture** (Ports & Adapters)

## 📁 Project Structure

```
src/
├── modules/
│   ├── users/           # User domain module
│   ├── auth/            # Authentication module
│   └── posts/           # Posts domain module (future)
├── shared/              # Shared utilities and common code
├── configs/             # Configuration files
└── database/            # Database configuration
```

### Module Structure (Clean Architecture Layers)
```
modules/{domain}/
├── domain/              # Business logic layer
│   ├── entities/        # Domain entities
│   ├── value-objects/   # Value objects
│   ├── ports/           # Interfaces (repositories, services)
│   └── exceptions/      # Domain exceptions
├── application/         # Use cases layer
│   ├── commands/        # Write operations (CQRS)
│   ├── queries/         # Read operations (CQRS)
│   └── dtos/           # Data transfer objects
├── infrastructure/      # External concerns layer
│   ├── adapters/        # External service adapters
│   ├── mappers/         # Data mapping
│   └── persistence/     # Database implementations
└── presentation/        # API layer
    └── controllers/     # HTTP controllers
```

## 🎯 Code Generation Guidelines

### 1. Domain Layer (Pure Business Logic)
- **NO framework imports** (NestJS, Express, etc.)
- **NO external dependencies** except domain-specific libraries
- Use **pure TypeScript classes** and interfaces
- Implement **domain exceptions** extending `DomainError`

```typescript
// ✅ Good Domain Entity
export class User {
    private readonly props: UserProps;
    
    constructor(props: UserProps) {
        this.validateProps(props);
        this.props = props;
    }
    
    public updateProfile(name: string): void {
        if (name.length < 2) {
            throw new InvalidUserDataError('Name too short');
        }
        this.props.name = name;
    }
}

// ✅ Good Repository Interface
export interface IUserRepository {
    findById(id: string): Promise<User | null>;
    save(user: User): Promise<void>;
}
```

### 2. Application Layer (Use Cases)
- **CQRS pattern** - separate Commands and Queries
- **Inject interfaces only**, not concrete implementations
- Use **@Inject(DI_TOKENS)** for dependency injection
- Return **DTOs**, not domain entities

```typescript
// ✅ Good Command Handler
@CommandHandler(CreateUserCommand)
export class CreateUserHandler implements ICommandHandler<CreateUserCommand> {
    constructor(
        @Inject(USER_DI_TOKENS.USER_REPOSITORY)
        private readonly userRepository: IUserRepository,
    ) {}
    
    async execute(command: CreateUserCommand): Promise<void> {
        const user = User.create(command.props);
        await this.userRepository.save(user);
    }
}

// ✅ Good Query Handler
@QueryHandler(GetUserProfileQuery)
export class GetUserProfileHandler implements IQueryHandler<GetUserProfileQuery> {
    constructor(
        @Inject(USER_DI_TOKENS.USER_REPOSITORY)
        private readonly userRepository: IUserRepository,
    ) {}
    
    async execute(query: GetUserProfileQuery): Promise<UserResponseDto> {
        const user = await this.userRepository.findById(query.userId);
        return UserResponseDto.fromDomain(user);
    }
}
```

### 3. Infrastructure Layer (External Concerns)
- **Implement interfaces** from domain/application layers
- Use **framework-specific code** (NestJS, MongoDB, etc.)
- Implement **mappers** for data transformation
- Handle **external service integrations**

```typescript
// ✅ Good Repository Implementation
@Injectable()
export class MongoUserRepository implements IUserRepository {
    constructor(
        @InjectModel(UserModel.name)
        private readonly userModel: Model<UserDocument>,
    ) {}
    
    async findById(id: string): Promise<User | null> {
        const doc = await this.userModel.findById(id);
        return doc ? UserMapper.toDomain(doc) : null;
    }
}

// ✅ Good Mapper
export class UserMapper {
    static toDomain(doc: UserDocument): User {
        return new User({
            id: UserId.create(doc._id.toString()),
            email: doc.email,
            name: doc.name,
        });
    }
    
    static toPersistence(user: User): Partial<UserDocument> {
        return {
            email: user.getEmail(),
            name: user.getName(),
        };
    }
}
```

### 4. Presentation Layer (API Controllers)
- **Thin controllers** - delegate to application layer
- Use **QueryBus/CommandBus** for CQRS
- Apply **validation pipes** and **DTOs**
- Add **Swagger documentation**

```typescript
// ✅ Good Controller
@ApiTags('Users')
@Controller({ path: 'users', version: '1' })
export class UserController {
    constructor(
        private readonly queryBus: QueryBus,
        private readonly commandBus: CommandBus,
    ) {}
    
    @Get(':userId')
    @ApiOperation({ summary: 'Get user profile' })
    async getUserProfile(
        @Param('userId', ObjectIdValidationPipe) userId: string
    ): Promise<UserResponseDto> {
        return await this.queryBus.execute(new GetUserProfileQuery(userId));
    }
}
```

## 🔧 Implementation Patterns

### Dependency Injection Tokens
- Create **DI tokens** file for each module
- Use **string tokens** for interfaces

```typescript
// user.di-tokens.ts
export const USER_DI_TOKENS = {
    USER_REPOSITORY: 'USER_REPOSITORY',
    USER_SERVICE: 'USER_SERVICE',
} as const;
```

### Error Handling
- **Domain exceptions** extend `DomainError`
- **Application exceptions** for use case errors
- **Global exception filter** handles all errors

```typescript
// ✅ Good Domain Exception
export class UserNotFoundError extends DomainError {
    constructor(userId: string) {
        super(`User with ID ${userId} not found`, 404);
    }
}
```

### DTOs and Validation
- **Request DTOs** with `class-validator`
- **Response DTOs** with `fromDomain()` methods
- **Swagger documentation** for all DTOs

```typescript
// ✅ Good Response DTO
export class UserResponseDto {
    public readonly id: string;
    public readonly email: string;
    public readonly name: string;
    
    static fromDomain(user: User): UserResponseDto {
        return new UserResponseDto(
            user.getId().getValue(),
            user.getEmail(),
            user.getName()
        );
    }
}
```

## 📋 Code Review Checklist

### Domain Layer ✅
- [ ] No framework imports
- [ ] Pure business logic
- [ ] Proper encapsulation
- [ ] Domain exceptions

### Application Layer ✅
- [ ] CQRS pattern (Commands/Queries)
- [ ] Dependency injection with interfaces
- [ ] Return DTOs, not entities
- [ ] Proper error handling

### Infrastructure Layer ✅
- [ ] Implements domain interfaces
- [ ] Proper data mapping
- [ ] Framework-specific code isolated
- [ ] External service adapters

### Presentation Layer ✅
- [ ] Thin controllers
- [ ] Uses QueryBus/CommandBus
- [ ] Proper validation
- [ ] Swagger documentation

## 🚀 Performance & Scalability

### Caching Strategy
- **Redis** for read operations
- **MongoDB** for write operations
- **Event-driven** cache invalidation

### Database Patterns
- **Repository pattern** for data access
- **Aggregate roots** for consistency
- **Domain events** for decoupling

## 📝 Naming Conventions

### Files
- **Entities**: `user.entity.ts`
- **Value Objects**: `user-id.vo.ts`
- **Commands**: `create-user.command.ts`
- **Handlers**: `create-user.handler.ts`
- **DTOs**: `user-response.dto.ts`
- **Repositories**: `user.repository.ts` (interface), `mongo-user.repository.ts` (implementation)

### Classes
- **Entities**: `User`, `Post`
- **Value Objects**: `UserId`, `Email`
- **Commands**: `CreateUserCommand`
- **Handlers**: `CreateUserHandler`
- **DTOs**: `UserResponseDto`

## 🎯 When Generating Code

1. **Ask about the layer** - Which layer is this code for?
2. **Follow dependency direction** - Inner layers don't depend on outer layers
3. **Use appropriate patterns** - CQRS, Repository, etc.
4. **Add proper validation** - Domain validation in entities, input validation in DTOs
5. **Include error handling** - Domain exceptions and proper HTTP responses
6. **Add documentation** - Swagger for APIs, JSDoc for complex logic

## 🔄 Event-Driven Architecture

### Domain Events
```typescript
// ✅ Good Domain Event
export class UserCreatedEvent {
    constructor(
        public readonly userId: string,
        public readonly email: string,
        public readonly occurredAt: Date = new Date()
    ) {}
}
```

### Event Handlers
```typescript
// ✅ Good Event Handler
@EventsHandler(UserCreatedEvent)
export class UserCreatedEventHandler implements IEventHandler<UserCreatedEvent> {
    async handle(event: UserCreatedEvent): Promise<void> {
        // Handle event (send email, update cache, etc.)
    }
}
```

Remember: **Clean Architecture** is about **dependency inversion** and **separation of concerns**. Always ask yourself: "Which layer should this code belong to?" and "What should this layer depend on?" 