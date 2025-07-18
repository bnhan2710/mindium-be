# GitHub Copilot Instructions for Blog System

## 📋 Overview

This directory contains comprehensive instructions for GitHub Copilot to help generate code that follows **Clean Architecture** and **CQRS** patterns for our Medium Clone blog system.

## 📁 File Structure

```
.github/copilot/
├── README.md                 # This file - usage instructions
├── instructions.md           # Main architecture guidelines and patterns
├── code-templates.md         # Code templates for each layer
└── domain-patterns.md        # Good/bad patterns and anti-patterns
```

## 🎯 How to Use

### 1. **Read the Instructions First**
Before asking Copilot to generate code, make sure you understand:
- **Clean Architecture layers** (Domain → Application → Infrastructure → Presentation)
- **CQRS pattern** (Commands for writes, Queries for reads)
- **Dependency direction** (inward-pointing dependencies)

### 2. **Specify the Layer**
When asking Copilot to generate code, always specify which layer:
```
"Generate a User entity for the domain layer"
"Create a CreateUserCommand handler for the application layer"
"Implement MongoUserRepository for the infrastructure layer"
"Create UserController for the presentation layer"
```

### 3. **Reference the Templates**
Use the templates in `code-templates.md` as reference:
```
"Generate a domain entity following the Entity Template"
"Create a command handler using the Command Handler Template"
"Implement a repository using the Repository Implementation Template"
```

### 4. **Follow the Patterns**
Reference `domain-patterns.md` to ensure:
- ✅ **Good patterns** are followed
- ❌ **Anti-patterns** are avoided

## 🏗️ Architecture Quick Reference

### Layer Dependencies (Clean Architecture)
```
Presentation → Application → Domain
     ↓              ↓          ↓
Infrastructure → Application → Domain
```

### CQRS Flow
```
Controller → QueryBus/CommandBus → Handler → Repository → Database
```

### Module Structure
```
modules/{domain}/
├── domain/              # Pure business logic
├── application/         # Use cases (Commands/Queries)
├── infrastructure/      # External integrations
└── presentation/        # API controllers
```

## 🎯 Common Copilot Prompts

### Domain Layer
```
"Generate a User entity with business logic following Clean Architecture"
"Create a UserId value object with validation"
"Define IUserRepository interface in the domain layer"
"Create UserNotFoundError domain exception"
```

### Application Layer
```
"Generate CreateUserCommand and handler with CQRS pattern"
"Create GetUserProfileQuery and handler returning DTO"
"Generate UserResponseDto with fromDomain method"
"Create validation DTO for user creation request"
```

### Infrastructure Layer
```
"Implement MongoUserRepository following the repository pattern"
"Create UserMapper for domain-persistence mapping"
"Generate MongoDB schema for User entity"
"Create external service adapter for email"
```

### Presentation Layer
```
"Generate UserController with CQRS and Swagger documentation"
"Create API endpoint for user profile with validation"
"Add error handling and proper HTTP responses"
"Generate request/response DTOs for API"
```

## 🔧 Best Practices

### 1. **Always Ask for Layer Clarification**
```
❌ "Generate user code"
✅ "Generate User entity for domain layer with business logic"
```

### 2. **Specify Dependencies**
```
❌ "Create user service"
✅ "Create command handler that injects IUserRepository interface"
```

### 3. **Include Error Handling**
```
❌ "Create user creation endpoint"
✅ "Create user creation endpoint with validation and domain exception handling"
```

### 4. **Follow Naming Conventions**
```
✅ user.entity.ts
✅ create-user.command.ts
✅ mongo-user.repository.ts
✅ user.controller.ts
```

## 📋 Code Review Checklist

When Copilot generates code, verify:

### Domain Layer ✅
- [ ] No framework imports (NestJS, Express, etc.)
- [ ] Pure TypeScript classes and interfaces
- [ ] Business logic and validation in entities
- [ ] Domain exceptions extend DomainError
- [ ] Value objects for primitive types

### Application Layer ✅
- [ ] CQRS pattern (separate Commands/Queries)
- [ ] Dependency injection with interfaces only
- [ ] DTOs for data transfer, not domain entities
- [ ] Proper error handling with domain exceptions

### Infrastructure Layer ✅
- [ ] Implements interfaces from domain/application
- [ ] Framework-specific code (NestJS, MongoDB, etc.)
- [ ] Proper data mapping between layers
- [ ] External service integrations

### Presentation Layer ✅
- [ ] Thin controllers that delegate to application layer
- [ ] Uses QueryBus/CommandBus for CQRS
- [ ] Input validation with DTOs
- [ ] Swagger documentation for APIs

## 🚀 Examples

### Good Copilot Conversation
```
User: "Generate a User entity for the domain layer with profile update functionality"

Copilot: [Generates pure domain entity with business logic, no framework dependencies]

User: "Now create a command handler for updating user profile"

Copilot: [Generates CQRS command handler with proper DI and error handling]

User: "Create the corresponding API endpoint"

Copilot: [Generates thin controller using QueryBus/CommandBus]
```

### Bad Copilot Conversation
```
User: "Generate user code"

Copilot: [Generates unclear code mixing concerns]

User: "Add database access"

Copilot: [Might mix infrastructure concerns with domain logic]
```

## 🎯 Remember

- **Clean Architecture** = Clear separation of concerns
- **CQRS** = Separate read/write operations
- **Domain-Driven Design** = Rich domain model
- **Dependency Inversion** = Depend on abstractions
- **Single Responsibility** = One reason to change

## 🔗 Related Files

- `../docs/architecture.md` - Detailed architecture documentation
- `../docs/patterns.md` - Design patterns used in the project
- `src/shared/` - Shared utilities and common patterns

---

**Happy coding with GitHub Copilot! 🚀** 