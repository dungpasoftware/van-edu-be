# Van Edu Backend - Project Standards & Coding Rules

## 🎯 Project Overview
This is a NestJS-based backend for an online course platform (similar to Udemy) with user management, premium subscriptions, and payment processing.

## 📋 Core Technologies
- **Framework**: NestJS (TypeScript)
- **Database**: PostgreSQL with TypeORM
- **Authentication**: JWT with Passport
- **Documentation**: Swagger/OpenAPI
- **Package Manager**: Yarn

## 📁 Project Structure Standards

### Directory Organization
```
src/
├── auth/           # Authentication & authorization
├── users/          # User management
├── payments/       # Payment & subscription system
├── shared/         # Shared utilities, guards, decorators
└── [module]/       # Other feature modules
    ├── dto/        # Data Transfer Objects
    ├── entities/   # Database entities
    ├── enums/      # Enums specific to module
    └── guards/     # Module-specific guards
```

### File Naming Conventions
- **Entities**: `*.entity.ts` (e.g., `user.entity.ts`)
- **DTOs**: `*.dto.ts` (e.g., `create-user.dto.ts`)
- **Controllers**: `*.controller.ts`
- **Services**: `*.service.ts`
- **Guards**: `*.guard.ts`
- **Enums**: `*.enum.ts` (e.g., `user-role.enum.ts`)
- **Interfaces**: `*.interface.ts`

## 🗄️ Database Naming Conventions (CRITICAL)

### Table Names
- MUST use snake_case
- Use singular form
- Examples: `user`, `payment_transaction`, `video_category`

### Column Names
- MUST use snake_case for database columns
- Use `name` attribute in `@Column()` decorator for mapping
- Follow patterns:
  - Foreign keys: `{table}_id` (e.g., `user_id`)
  - Booleans: `is_*` prefix (e.g., `is_premium`, `is_active`)
  - Timestamps: `*_at` suffix (e.g., `created_at`, `updated_at`)
  - Dates: `*_date` suffix (e.g., `expiry_date`)

### ✅ Correct Entity Example
```typescript
@Entity('payment_transaction')
export class PaymentTransaction {
  @Column({ name: 'user_id' })
  userId: number;
  
  @Column({ name: 'reference_number' })
  referenceNumber: string;
  
  @Column({ name: 'is_confirmed' })
  isConfirmed: boolean;
  
  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;
}
```

## 🔤 TypeScript Naming Conventions

### Variables & Properties
- Use camelCase: `firstName`, `isActive`, `userId`
- Boolean variables: `is*`, `has*`, `can*`, `should*`

### Classes & Interfaces
- Use PascalCase: `UserService`, `PaymentTransaction`
- Interfaces: Start with `I` if needed: `IUserRepository`

### Enums
- Enum names: PascalCase
- Enum keys: UPPER_SNAKE_CASE
- Enum values: lowercase snake_case for database storage

```typescript
export enum UserRole {
  NORMAL_USER = 'normal_user',
  PREMIUM_USER = 'premium_user',
  ADMIN = 'admin',
}
```

## 🛡️ Security Standards

### Authentication & Authorization
- Always use JWT guards on protected routes
- Implement role-based access control (RBAC)
- Use permission-based guards for admin features
- Never expose passwords in API responses

### Input Validation
- Use DTOs with class-validator decorators
- Validate all inputs at controller level
- Sanitize user inputs
- Use proper TypeORM query builders to prevent SQL injection

### Environment Variables
- Store all secrets in `.env` files
- Never commit `.env` files
- Document all required environment variables

## 🎨 Code Style & Quality

### Code Formatting
- Use Prettier for consistent formatting
- Follow ESLint rules
- Use 2 spaces for indentation
- Maximum line length: 80-100 characters

### Import Organization
```typescript
// 1. Node modules
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

// 2. Local imports (entities, DTOs, etc.)
import { User } from './user.entity';
import { CreateUserDto } from './dto/create-user.dto';
```

### Error Handling
- Use NestJS built-in HTTP exceptions
- Provide meaningful error messages
- Log errors appropriately
- Return consistent error response format

### Comments & Documentation
- Use JSDoc for public methods
- Comment complex business logic
- Keep comments up-to-date
- Document API endpoints with Swagger decorators

## 🏗️ Architecture Patterns

### Service Layer
- Keep controllers thin, move logic to services
- Use dependency injection
- Implement proper error handling
- Use transactions for database operations

### DTOs (Data Transfer Objects)
- Create separate DTOs for create/update operations
- Use validation decorators
- Exclude sensitive fields from responses

### Guards & Decorators
- Use custom decorators for common patterns
- Implement reusable guards
- Follow the single responsibility principle

## 🔍 API Design Standards

### Endpoint Naming
- Use RESTful conventions
- Use kebab-case for URLs: `/users/change-password`
- Version APIs when needed: `/v1/users`

### Response Format
- Return consistent response structures
- Use appropriate HTTP status codes
- Include metadata when needed (pagination, etc.)

### Swagger Documentation
- Document all endpoints with `@ApiOperation`
- Use `@ApiResponse` for response documentation
- Group endpoints with `@ApiTags`
- Document authentication requirements

## 🧪 Testing Standards

### Unit Tests
- Test all service methods
- Mock external dependencies
- Use descriptive test names
- Aim for high code coverage

### Integration Tests
- Test API endpoints
- Test database operations
- Use test database
- Clean up test data

## 📦 Dependencies & Modules

### Module Organization
- Follow feature-based modules
- Import only what's needed
- Use forRoot/forFeature patterns appropriately
- Keep modules focused and cohesive

### Third-party Libraries
- Prefer well-maintained packages
- Check security vulnerabilities regularly
- Document reasons for library choices
- Keep dependencies up-to-date

## 🚀 Deployment & Production

### Environment Configuration
- Use different configs for dev/staging/prod
- Validate environment variables at startup
- Use secrets management for sensitive data

### Performance
- Use database indexes appropriately
- Implement caching where beneficial
- Optimize database queries
- Monitor application performance

## ✅ Code Review Checklist

Before submitting code:
- [ ] All database columns use snake_case with `name` attribute
- [ ] No passwords or sensitive data exposed in responses
- [ ] Proper error handling implemented
- [ ] Input validation with DTOs
- [ ] Swagger documentation updated
- [ ] Tests added/updated
- [ ] No hardcoded values
- [ ] Follows established patterns
- [ ] ESLint/Prettier rules followed

## 🔄 Database Migration Guidelines

### Migration Naming
- Use timestamps: `{timestamp}_{description}.ts`
- Use snake_case for descriptions: `create_user_table.ts`

### Migration Content
- Always create reversible migrations
- Use snake_case for all database identifiers
- Add indexes for foreign keys
- Include proper constraints

## 📚 Documentation Requirements

### API Documentation
- Keep Swagger docs up-to-date
- Document error responses
- Include request/response examples
- Document authentication requirements

### README Files
- Update guides when making changes
- Include setup instructions
- Document new features
- Keep examples current

## 🎯 Performance Guidelines

### Database
- Use appropriate indexes
- Avoid N+1 queries
- Use database transactions
- Implement pagination

### API
- Implement rate limiting
- Use caching strategies
- Optimize response sizes
- Monitor endpoint performance

## 🔧 Development Workflow

### Git Conventions
- Use conventional commits
- Create feature branches
- Write descriptive commit messages
- Keep commits atomic

### Code Quality
- Run linting before commits
- Write tests for new features
- Update documentation
- Follow the established patterns 