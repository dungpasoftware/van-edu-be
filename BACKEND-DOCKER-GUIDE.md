# Van Edu Backend - Docker Guide

## Overview
This guide covers running the Van Edu NestJS backend in Docker with an external PostgreSQL database.

## Prerequisites
- Docker and Docker Compose installed
- External PostgreSQL database (Railway, Supabase, AWS RDS, etc.)
- Database credentials from your PostgreSQL provider

## Quick Start

1. **Clone and setup environment:**
```bash
git clone <your-backend-repo>
cd van-edu-be
cp .env.example .env
```

2. **Configure your `.env` file with PostgreSQL credentials:**
```env
# PostgreSQL Database Configuration
DB_TYPE=postgres
DB_HOST=your-postgresql-host
DB_PORT=5432
DB_USERNAME=your-db-username
DB_PASSWORD=your-postgresql-password
DB_DATABASE=your-database-name

# JWT Configuration
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
JWT_EXPIRES_IN=24h

# Application Configuration
PORT=3000
NODE_ENV=production
```

3. **Build and run with Docker:**
```bash
# Build the image
docker-compose build

# Run the backend
docker-compose up -d

# View logs
docker-compose logs -f backend
```

4. **Access the application:**
- Backend API: http://localhost:3000
- Health check: http://localhost:3000/health

## Docker Configuration

### Dockerfile
The backend uses a multi-stage build for optimization:
- **Build stage**: Installs dependencies and builds the application
- **Production stage**: Runs the optimized application

### docker-compose.yml
Defines the backend service with:
- Port mapping (3000:3000)
- Environment variables from .env
- Health checks
- Restart policies

## Database Setup

Since the database is in a separate repository, you'll need to:

1. **Set up your PostgreSQL database** using your preferred provider
2. **Run database migrations** (if you have them)
3. **Configure the connection** in your `.env` file

### Recommended Database Providers:

#### Railway PostgreSQL:
```env
DB_HOST=railway-postgres-host.railway.app
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=your-railway-password
DB_DATABASE=railway
```

#### Supabase PostgreSQL:
```env
DB_HOST=db.your-project-ref.supabase.co
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=your-supabase-password
DB_DATABASE=postgres
```

#### AWS RDS PostgreSQL:
```env
DB_HOST=your-rds-endpoint.region.rds.amazonaws.com
DB_PORT=5432
DB_USERNAME=your-username
DB_PASSWORD=your-password
DB_DATABASE=your-database
```

## Available Commands

```bash
# Build and start
docker-compose up --build

# Start in background
docker-compose up -d

# Stop services
docker-compose down

# View logs
docker-compose logs -f backend

# Rebuild and restart
docker-compose down && docker-compose up --build

# Execute commands in container
docker-compose exec backend yarn install
docker-compose exec backend yarn build
```

## Environment Variables

| Variable | Description | Example |
|----------|-------------|---------|
| `DB_HOST` | PostgreSQL host | `localhost` or cloud host |
| `DB_PORT` | PostgreSQL port | `5432` |
| `DB_USERNAME` | Database username | `postgres` |
| `DB_PASSWORD` | Database password | `your-password` |
| `DB_DATABASE` | Database name | `van_edu` |
| `JWT_SECRET` | JWT signing secret | `your-secret-key` |
| `JWT_EXPIRES_IN` | Token expiration | `24h` |
| `NODE_ENV` | Environment | `development` or `production` |
| `PORT` | Application port | `3000` |

## Health Checks

The application includes health checks:
- **Endpoint**: `GET /health`
- **Docker health check**: Automatically checks container health
- **Response**: `{"status": "ok", "timestamp": "..."}`

## Troubleshooting

### Common Issues:

1. **Database connection failed:**
   - Verify PostgreSQL credentials in `.env`
   - Check if database server is accessible
   - Ensure SSL settings are correct for production

2. **Port already in use:**
   ```bash
   # Change port in docker-compose.yml
   ports:
     - "3001:3000"  # Use port 3001 instead
   ```

3. **Container won't start:**
   ```bash
   # Check logs
   docker-compose logs backend
   
   # Rebuild image
   docker-compose build --no-cache backend
   ```

4. **Environment variables not loaded:**
   - Ensure `.env` file exists in project root
   - Check file permissions
   - Verify variable names match exactly

### Debugging:

```bash
# Enter container shell
docker-compose exec backend sh

# Check environment variables
docker-compose exec backend env

# Test database connection
docker-compose exec backend yarn typeorm:check
```

## Production Deployment

For production deployment:

1. **Set production environment:**
```env
NODE_ENV=production
```

2. **Use production database:**
   - Enable SSL connections
   - Use strong passwords
   - Configure proper firewall rules

3. **Security considerations:**
   - Use secrets management
   - Enable HTTPS
   - Configure CORS properly
   - Use environment-specific JWT secrets

4. **Monitoring:**
   - Set up logging
   - Configure health checks
   - Monitor database connections

## API Documentation

Once running, the backend provides these endpoints:

### Authentication:
- `POST /auth/register` - Register new user
- `POST /auth/login` - User login

### Users (Protected):
- `GET /users` - List users (admin only)
- `GET /users/:id` - Get user details
- `PATCH /users/:id` - Update user
- `DELETE /users/:id` - Delete user (admin only)

### Premium Subscription:
- `GET /packages` - Get subscription packages
- `POST /payments/subscribe` - Subscribe to premium
- `GET /payments/my-payments` - Get payment history
- `GET /users/premium-info` - Get premium status

### Health:
- `GET /health` - Application health check

## Database Repository Setup

If you need to create a separate database repository, here's the recommended structure for your PostgreSQL database:

### Recommended Database Schema:

```sql
-- Users table
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    full_name VARCHAR(255) NOT NULL,
    phone VARCHAR(20),
    address TEXT,
    avatar_url VARCHAR(500),
    role VARCHAR(20) DEFAULT 'user' CHECK (role IN ('user', 'admin')),
    is_premium BOOLEAN DEFAULT FALSE,
    premium_expires_at TIMESTAMPTZ,
    profile_data JSONB DEFAULT '{}',
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Subscription packages
CREATE TABLE packages (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    price NUMERIC(10,2) NOT NULL,
    duration_months INTEGER NOT NULL,
    features JSONB DEFAULT '[]',
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Payment transactions
CREATE TABLE payment_transactions (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    package_id INTEGER REFERENCES packages(id),
    amount NUMERIC(10,2) NOT NULL,
    payment_method VARCHAR(50) DEFAULT 'qr_code',
    status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'completed', 'failed', 'cancelled')),
    qr_code_url VARCHAR(500),
    payment_proof_url VARCHAR(500),
    admin_notes TEXT,
    processed_by INTEGER REFERENCES users(id),
    processed_at TIMESTAMPTZ,
    expires_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes for performance
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_premium ON users(is_premium, premium_expires_at);
CREATE INDEX idx_payment_transactions_user ON payment_transactions(user_id);
CREATE INDEX idx_payment_transactions_status ON payment_transactions(status);

-- Insert default packages
INSERT INTO packages (name, description, price, duration_months, features) VALUES
('Monthly Premium', 'Access to all premium content for 1 month', 9.99, 1, '["All premium courses", "Priority support", "Downloadable resources"]'),
('Annual Premium', 'Access to all premium content for 1 year (2 months free!)', 71.99, 12, '["All premium courses", "Priority support", "Downloadable resources", "Annual discount"]'),
('Lifetime Premium', 'Unlimited access to all premium content forever', 199.99, 999, '["All premium courses", "Priority support", "Downloadable resources", "Lifetime access", "Future content included"]');
```

This schema supports:
- **Premium subscription system** with QR code payments
- **Role-based access control** (user/admin)
- **Flexible subscription packages** with JSONB features
- **Payment tracking** with admin confirmation workflow
- **PostgreSQL-specific features** (TIMESTAMPTZ, JSONB, ENUM constraints)
- **Proper indexing** for performance
- **Referential integrity** with foreign keys