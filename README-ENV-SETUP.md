# Environment Setup for Van Edu Backend

## Database Configuration (PostgreSQL)

1. Copy the following configuration to your `.env` file:

```env
# Database Configuration (PostgreSQL)
# Get these values from your PostgreSQL service (Railway, AWS RDS, Supabase, etc.)
DB_TYPE=postgres
DB_HOST=your-postgresql-host
DB_PORT=5432
DB_USERNAME=your-db-username
DB_PASSWORD=your-postgresql-password
DB_DATABASE=your-database-name

# For Railway PostgreSQL, get these from your Railway dashboard:
# DB_HOST=railway-postgres-host.railway.app
# DB_USERNAME=postgres
# DB_PASSWORD=your-railway-password
# DB_DATABASE=railway

# For Supabase, get these from your project settings:
# DB_HOST=db.your-project-ref.supabase.co
# DB_USERNAME=postgres
# DB_PASSWORD=your-supabase-password
# DB_DATABASE=postgres

# JWT Configuration
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production-at-least-32-characters-long
JWT_EXPIRES_IN=24h

# Application Configuration
PORT=3000
NODE_ENV=development
```

## How to get PostgreSQL credentials:

### Railway PostgreSQL:
1. Go to your Railway project dashboard
2. Click on your PostgreSQL service
3. Go to the "Variables" tab
4. Copy the following values:
   - `PGHOST` → `DB_HOST`
   - `PGPORT` → `DB_PORT` (usually 5432)
   - `PGUSER` → `DB_USERNAME`
   - `PGPASSWORD` → `DB_PASSWORD`
   - `PGDATABASE` → `DB_DATABASE`

### Supabase PostgreSQL:
1. Go to your Supabase project dashboard
2. Go to Settings → Database
3. Copy the connection details:
   - Host → `DB_HOST`
   - Port → `DB_PORT` (5432)
   - Database name → `DB_DATABASE`
   - Username → `DB_USERNAME` (postgres)
   - Password → `DB_PASSWORD`

### AWS RDS PostgreSQL:
1. Go to AWS RDS Console
2. Select your PostgreSQL instance
3. Copy the endpoint and connection details

## Security Notes:

- **NEVER** commit your `.env` file to version control
- Generate a strong JWT secret (at least 32 characters)
- Use different secrets for production
- Enable SSL for production PostgreSQL connections

## Running the application:

1. Install dependencies: `yarn install`
2. Create your `.env` file with the configuration above
3. Run in development: `yarn start:dev`
4. Run in production: `yarn start:prod`

## API Endpoints:

### Authentication:
- POST `/auth/register` - Register a new user
- POST `/auth/login` - Login user

### Users (requires authentication):
- GET `/users` - Get all users
- GET `/users/:id` - Get user by ID
- POST `/users` - Create user
- PATCH `/users/:id` - Update user
- DELETE `/users/:id` - Delete user

### Premium Subscription:
- GET `/packages` - Get subscription packages
- POST `/payments/subscribe` - Subscribe to premium
- GET `/payments/my-payments` - Get payment history
- GET `/users/premium-info` - Get premium status

## Example API Usage:

### Register:
```bash
curl -X POST http://localhost:3000/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "password": "password123",
    "fullName": "John Doe"
  }'
```

### Login:
```bash
curl -X POST http://localhost:3000/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "password": "password123"
  }'
```

### Access protected endpoints:
```bash
curl -X GET http://localhost:3000/users \
  -H "Authorization: Bearer YOUR_JWT_TOKEN_HERE"
```

### Subscribe to premium:
```bash
curl -X POST http://localhost:3000/payments/subscribe \
  -H "Authorization: Bearer YOUR_JWT_TOKEN_HERE" \
  -H "Content-Type: application/json" \
  -d '{
    "packageId": 1
  }'
``` 