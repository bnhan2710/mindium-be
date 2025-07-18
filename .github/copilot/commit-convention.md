# Commit Convention Guide

## 📋 Overview

This project follows **Conventional Commits** specification to ensure consistent, readable, and automated-friendly commit messages. This helps with:
- **Automated versioning** (semantic versioning)
- **Automated changelog generation**
- **Better collaboration** and code review
- **Clear project history**

## 🎯 Commit Message Format

```
<type>[optional scope]: <description>

[optional body]

[optional footer(s)]
```

### Examples:
```
feat(users): add user profile update functionality
fix(auth): resolve OAuth token refresh issue
docs(readme): update installation instructions
refactor(posts): extract post validation logic to domain layer
```

## 🏷️ Types

### **Primary Types** (Most Common)

| Type | Description | Example |
|------|-------------|---------|
| `feat` | New feature | `feat(users): add user following system` |
| `fix` | Bug fix | `fix(auth): handle expired JWT tokens` |
| `docs` | Documentation changes | `docs(api): add swagger documentation` |
| `refactor` | Code refactoring (no feature/bug changes) | `refactor(posts): move validation to domain layer` |
| `test` | Adding/updating tests | `test(users): add unit tests for user entity` |
| `chore` | Maintenance tasks | `chore(deps): update dependencies` |

### **Secondary Types** (Less Common)

| Type | Description | Example |
|------|-------------|---------|
| `style` | Code style changes (formatting, etc.) | `style(users): fix linting issues` |
| `perf` | Performance improvements | `perf(posts): optimize post query performance` |
| `build` | Build system changes | `build(docker): update Dockerfile` |
| `ci` | CI/CD changes | `ci(github): add automated testing workflow` |
| `revert` | Revert previous commit | `revert: revert feat(users): add user following` |

## 🎯 Scopes

Scopes should match our **module structure** and **layers**:

### **Module Scopes**
- `users` - User domain module
- `auth` - Authentication module  
- `posts` - Posts domain module
- `comments` - Comments module
- `notifications` - Notifications module

### **Layer Scopes**
- `domain` - Domain layer changes
- `application` - Application layer (use cases)
- `infrastructure` - Infrastructure layer
- `presentation` - Presentation layer (controllers)

### **Technical Scopes**
- `database` - Database related changes
- `api` - API related changes
- `config` - Configuration changes
- `deps` - Dependencies
- `docker` - Docker related changes

### **Examples with Scopes**
```
feat(users/domain): add user profile update business logic
fix(auth/infrastructure): resolve MongoDB connection issue
refactor(posts/application): extract command handler logic
docs(api): add Swagger documentation for user endpoints
```

## 📝 Description Rules

### **Do's ✅**
- Use **imperative mood** ("add" not "added" or "adds")
- **Lowercase** first letter
- **No period** at the end
- **Be concise** but descriptive
- **Start with a verb** when possible

### **Don'ts ❌**
- Don't use past tense
- Don't capitalize first letter
- Don't end with period
- Don't be too vague

### **Good Examples ✅**
```
feat(users): add user profile update functionality
fix(auth): resolve OAuth token refresh issue
refactor(posts): extract validation logic to domain layer
docs(readme): update installation instructions
test(users): add unit tests for user entity
```

### **Bad Examples ❌**
```
feat(users): Added user profile update functionality.  // ❌ Past tense, period
Fix: OAuth issue  // ❌ No scope, capitalized, vague
refactor: some changes  // ❌ Too vague
feat(users): User can now update profile  // ❌ Not imperative
```

## 📖 Body Guidelines

Use body for **complex changes** that need explanation:

```
feat(posts): add post publishing workflow

Implement domain events for post publication:
- Add PostPublishedEvent domain event
- Create event handler for feed updates
- Add post status transitions with validation
- Update post entity with publish/unpublish methods

This enables real-time feed updates when users publish posts.
```

## 🦶 Footer Guidelines

Use footer for **breaking changes** and **issue references**:

```
feat(users): add user authentication system

BREAKING CHANGE: User entity now requires email verification
before account activation. Existing users need to verify emails.

Closes #123
Refs #456
```

## 🚀 Clean Architecture Specific Examples

### **Domain Layer**
```
feat(users/domain): add user following business logic
fix(posts/domain): resolve post validation rules
refactor(users/domain): extract user profile value object
```

### **Application Layer**
```
feat(users/application): add follow user command handler
fix(posts/application): resolve query handler error handling
refactor(users/application): simplify user creation use case
```

### **Infrastructure Layer**
```
feat(users/infrastructure): add MongoDB user repository
fix(auth/infrastructure): resolve JWT token adapter issue
refactor(posts/infrastructure): optimize database queries
```

### **Presentation Layer**
```
feat(users/presentation): add user profile API endpoints
fix(auth/presentation): resolve validation error responses
refactor(posts/presentation): simplify controller logic
```

## 🔧 CQRS Pattern Examples

### **Commands (Write Operations)**
```
feat(users/application): add create user command handler
feat(posts/application): add publish post command
fix(users/application): resolve update user command validation
```

### **Queries (Read Operations)**
```
feat(users/application): add get user profile query handler
feat(posts/application): add get user feed query
fix(users/application): resolve get followers query pagination
```

### **Events**
```
feat(users/domain): add user created domain event
feat(posts/domain): add post published event handler
fix(users/domain): resolve user followed event payload
```

## 🎯 Module-Specific Examples

### **Users Module**
```
feat(users): add user profile update functionality
feat(users): add user following system
feat(users): add user avatar upload
fix(users): resolve user validation errors
refactor(users): extract user profile logic
test(users): add user entity unit tests
```

### **Authentication Module**
```
feat(auth): add Google OAuth integration
feat(auth): add JWT token refresh mechanism
feat(auth): add session management
fix(auth): resolve token expiration handling
refactor(auth): simplify OAuth flow
test(auth): add authentication service tests
```

### **Posts Module**
```
feat(posts): add post creation functionality
feat(posts): add post publishing workflow
feat(posts): add post search capability
fix(posts): resolve post validation issues
refactor(posts): extract post domain logic
test(posts): add post entity unit tests
```

## 🔄 Breaking Changes

For **breaking changes**, use `BREAKING CHANGE:` in footer:

```
feat(users): change user ID format to UUID

BREAKING CHANGE: User ID format changed from MongoDB ObjectId 
to UUID. This affects all user-related APIs and database schema.

Migration guide:
1. Run migration script: npm run migrate:user-ids
2. Update client applications to use UUID format
3. Clear user sessions to force re-authentication
```

## 📊 Automated Tools Integration

### **Semantic Versioning**
- `feat:` → **Minor** version bump (0.1.0 → 0.2.0)
- `fix:` → **Patch** version bump (0.1.0 → 0.1.1)
- `BREAKING CHANGE:` → **Major** version bump (0.1.0 → 1.0.0)

### **Changelog Generation**
Commits will automatically generate changelog entries:
```
## [1.2.0] - 2024-01-15

### Features
- **users**: add user profile update functionality
- **posts**: add post publishing workflow

### Bug Fixes
- **auth**: resolve OAuth token refresh issue
- **users**: fix user validation errors

### Breaking Changes
- **users**: change user ID format to UUID
```

## 🚫 Common Mistakes to Avoid

### **❌ Bad Examples**
```
// Too vague
fix: bug fix
feat: new feature
update: some changes

// Wrong tense
feat(users): added user profile
fix(auth): fixed OAuth issue

// Missing scope for feature
feat: add user following
fix: resolve database issue

// Capitalized/with period
Feat(users): Add user profile.
Fix(auth): OAuth issue.

// Too long description
feat(users): add comprehensive user profile management system with avatar upload, profile editing, and social media integration capabilities
```

### **✅ Good Examples**
```
// Clear and concise
fix(users): resolve profile update validation
feat(posts): add post publishing workflow
refactor(auth): simplify OAuth token handling

// Proper scope and description
feat(users/domain): add user following business logic
fix(posts/infrastructure): resolve MongoDB connection timeout
test(auth/application): add OAuth service unit tests

// Breaking change format
feat(users): change authentication system

BREAKING CHANGE: JWT tokens now expire after 1 hour instead of 24 hours.
Update client applications to handle token refresh more frequently.
```

## 🎯 Quick Reference

### **Format Template**
```
<type>(<scope>): <description>

[body]

[footer]
```

### **Most Common Patterns**
```
feat(users): add user profile functionality
fix(auth): resolve token validation issue
refactor(posts): extract domain logic
docs(api): update endpoint documentation
test(users): add integration tests
chore(deps): update dependencies
```

### **Scope Patterns**
```
<module>                 // feat(users): add user profile
<module>/<layer>         // feat(users/domain): add user entity
<technical-area>         // fix(database): resolve connection issue
```

---

## 🔗 Related Tools

- **Commitizen**: Interactive commit message tool
- **Conventional Changelog**: Automated changelog generation
- **Semantic Release**: Automated versioning and releases
- **Husky**: Git hooks for commit message validation

---

**Remember: Good commit messages are a gift to your future self and your team! 🎁** 