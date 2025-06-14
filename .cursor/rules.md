# Van Edu Backend - Cursor AI Rules

## 🎯 Project Overview
This is a NestJS-based backend for an online course platform (Van Edu) with user management, premium subscriptions, and payment processing using PostgreSQL and TypeORM.

## 📚 Rule Documentation
This project follows strict coding standards and conventions. Please refer to the detailed rule files:

- **[Database Conventions](./rules/database-conventions.md)** - Critical database naming rules (snake_case)
- **[Project Standards](./rules/project-standards.md)** - Comprehensive coding guidelines

## 🚨 CRITICAL RULES (Always Follow)

### 1. Database Naming Convention
**ALWAYS use snake_case for database tables and columns:**
```typescript
// ✅ CORRECT
@Entity('payment_transaction')
export class PaymentTransaction {
  @Column({ name: 'user_id' })
  userId: number;
  
  @Column({ name: 'reference_number' })
  referenceNumber: string;
}

// ❌ WRONG
@Entity('paymentTransaction')
export class PaymentTransaction {
  @Column()
  userId: number;  // Missing name attribute
}
```

### 2. TypeScript Property Naming
- Use camelCase for TypeScript properties
- Use the `name` attribute in `@Column()` decorator for snake_case mapping

### 3. Security Rules
- Never expose passwords in API responses
- Always validate inputs with DTOs
- Use JWT guards for protected endpoints
- Implement role-based access control

### 4. File Structure
```
src/
├── auth/           # Authentication
├── users/          # User management  
├── payments/       # Payment system
└── shared/         # Shared utilities
```

## 🛠️ Code Generation Guidelines

When generating code, ensure:

1. **Database Entities**: All columns use snake_case with `name` attribute
2. **DTOs**: Include proper validation decorators
3. **Controllers**: Include Swagger documentation
4. **Services**: Implement proper error handling
5. **Guards**: Follow security patterns

## 🔍 Review Checklist

Before any code changes:
- [ ] Database columns use snake_case naming
- [ ] All sensitive data properly protected
- [ ] DTOs include validation
- [ ] Swagger documentation updated
- [ ] Error handling implemented
- [ ] Tests included where appropriate

## 📋 Current Project Features

### Implemented Systems:
- ✅ User Management (with roles: USER, ADMIN)
- ✅ Authentication (JWT-based)
- ✅ Premium Subscription System
- ✅ Payment Processing (QR code + admin confirmation)
- ✅ Role-based Access Control
- ✅ Swagger API Documentation

### Database Schema:
- `user` table (with premium features)
- `package` table (subscription packages)
- `payment_transaction` table (payment records)

### Key Enums:
- `UserRole`: USER, ADMIN
- `PaymentStatus`: PENDING, CONFIRMED, EXPIRED, CANCELLED
- `AdminPermission`: Various granular permissions

## 🎯 Development Priorities

1. **Code Quality**: Follow all established patterns
2. **Security**: Implement proper authentication/authorization
3. **Documentation**: Keep API docs current
4. **Performance**: Optimize database queries
5. **Maintainability**: Write clean, readable code

## 🚀 Quick Commands

```bash
# Start development
yarn start:dev

# Run tests
yarn test

# Database migrations
yarn migration:generate
yarn migration:run

# Code formatting
yarn lint
yarn format
```

## 📖 Additional Resources

- **API Documentation**: http://localhost:3000/api (when running)
- **Environment Setup**: See README-ENV-SETUP.md
- **Payment System**: See PAYMENT-SYSTEM-GUIDE.md
- **Role System**: See ROLE-BASED-SYSTEM-GUIDE.md

---

**Remember**: This project uses strict snake_case database naming. Always use the `name` attribute in `@Column()` decorators to ensure proper database column mapping. 