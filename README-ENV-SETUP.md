# Environment Setup for Van Edu Backend

## Database Configuration (Railway MySQL)

1. Copy the following configuration to your `.env` file:

```env
# Database Configuration (Railway MySQL)
# Get these values from your Railway MySQL service dashboard
DB_TYPE=mysql
DB_HOST=your-railway-mysql-host
DB_PORT=3306
DB_USERNAME=root
DB_PASSWORD=your-railway-mysql-password
DB_DATABASE=railway

# JWT Configuration
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production-at-least-32-characters-long
JWT_EXPIRES_IN=24h

# Application Configuration
PORT=3000
NODE_ENV=development
```

## How to get Railway MySQL credentials:

1. Go to your Railway project dashboard
2. Click on your MySQL service
3. Go to the "Variables" tab
4. Copy the following values:
   - `MYSQLHOST` → `DB_HOST`
   - `MYSQLPORT` → `DB_PORT` (usually 3306)
   - `MYSQLUSER` → `DB_USERNAME`
   - `MYSQLPASSWORD` → `DB_PASSWORD`
   - `MYSQLDATABASE` → `DB_DATABASE`

## Security Notes:

- **NEVER** commit your `.env` file to version control
- Generate a strong JWT secret (at least 32 characters)
- Use different secrets for production

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