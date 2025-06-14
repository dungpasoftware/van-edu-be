# Database Naming Conventions

## Overview
This project follows strict snake_case naming conventions for all database-related names to ensure consistency and maintainability.

## Entity Naming Rules

### Table Names
- All table names MUST be in snake_case
- Use singular form for table names
- Examples: `user`, `payment_transaction`, `video_category`

### Column Names
- All column names MUST be in snake_case
- Use descriptive names that clearly indicate the purpose
- Foreign key columns should follow the pattern: `{referenced_table}_id`
- Boolean columns should use `is_` prefix when appropriate
- Date/time columns should use appropriate suffixes: `_at`, `_date`

### Examples of Correct Naming

```typescript
@Entity('user')
export class User {
  @Column({ name: 'full_name' })
  fullName: string;
  
  @Column({ name: 'is_premium' })
  isPremium: boolean;
  
  @Column({ name: 'created_at' })
  @CreateDateColumn()
  createdAt: Date;
  
  @Column({ name: 'premium_expiry_date' })
  premiumExpiryDate: Date;
}

@Entity('payment_transaction')
export class PaymentTransaction {
  @Column({ name: 'user_id' })
  userId: number;
  
  @Column({ name: 'reference_number' })
  referenceNumber: string;
  
  @Column({ name: 'qr_code_data' })
  qrCodeData: string;
}
```

## TypeScript Property Naming
- Use camelCase for TypeScript property names
- Use the `name` attribute in `@Column()` decorator to map to snake_case database column names

## Enum Values
- Enum keys should be UPPER_SNAKE_CASE
- Enum values should be lowercase snake_case for database storage
- Example:
```typescript
export enum UserRole {
  NORMAL_USER = 'normal_user',
  PREMIUM_USER = 'premium_user',
  ADMIN = 'admin',
}
```

## Foreign Key Conventions
- Foreign key columns should be named: `{referenced_table}_id`
- Always use `@JoinColumn({ name: 'foreign_key_name' })` to specify the exact column name
- Example:
```typescript
@ManyToOne(() => User)
@JoinColumn({ name: 'user_id' })
user: User;

@Column({ name: 'user_id' })
userId: number;
```

## Index and Constraint Naming
- Indexes: `idx_{table_name}_{column_name(s)}`
- Unique constraints: `uk_{table_name}_{column_name(s)}`
- Foreign keys: `fk_{table_name}_{referenced_table_name}`

## Validation Rules
- Always use the `name` property in `@Column()` decorator when the database column name differs from the TypeScript property name
- Ensure all entity files are consistent with these conventions
- Use TypeORM naming strategy if needed for automatic conversion

## Migration Naming
- Migration files should follow: `{timestamp}_{descriptive_name}.ts`
- Use snake_case for migration descriptions
- Example: `1234567890123_create_user_table.ts`

## Review Checklist
Before committing any entity changes:
- [ ] All table names are snake_case
- [ ] All column names are snake_case (using `name` attribute)
- [ ] All foreign keys follow `{table}_id` pattern
- [ ] All enum values are lowercase snake_case
- [ ] All boolean columns use appropriate naming (is_, has_, can_)
- [ ] All timestamp columns use _at or _date suffixes 