# Van Edu Backend Docker Setup Guide

This guide covers setting up Docker for the Van Edu NestJS backend only. The database is hosted separately (see database repository guide below).

## 🐳 Prerequisites

- Docker installed on your system
- Docker Compose installed (comes with Docker Desktop)
- External MySQL database (Railway, AWS RDS, or separate Docker container)

## 📁 Project Structure

```
van-edu-be/
├── Dockerfile              # Multi-stage Docker build for NestJS
├── docker-compose.yml      # Backend service configuration
├── .dockerignore          # Build optimization
├── healthcheck.js         # Container health monitoring
├── .env                   # Environment variables (create this)
└── package.json           # Docker scripts added
```

## 🚀 Quick Start

### 1. Create Environment File

Create a `.env` file in your project root:

```env
# Database Configuration (External MySQL)
DB_TYPE=mysql
DB_HOST=your-external-mysql-host
DB_PORT=3306
DB_USERNAME=your-db-username
DB_PASSWORD=your-db-password
DB_DATABASE=your-database-name

# For Railway MySQL example:
# DB_HOST=railway-mysql-host.railway.app
# DB_USERNAME=root
# DB_PASSWORD=your-railway-password
# DB_DATABASE=railway

# JWT Configuration
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production-at-least-32-characters-long
JWT_EXPIRES_IN=24h

# Application Configuration
PORT=3000
NODE_ENV=development
```

### 2. Build and Run

```bash
# Option 1: Using Docker Compose (Recommended)
yarn docker:dev

# Option 2: Direct Docker commands
yarn docker:build
yarn docker:run
```

### 3. Access Your Backend

- **🌐 API**: http://localhost:3000
- **📚 Swagger Docs**: http://localhost:3000/api
- **🔍 Health Check**: http://localhost:3000/health

## 📋 Available Docker Commands

```bash
# Build Commands
yarn docker:build          # Build production image
yarn docker:build:dev      # Build development image

# Run Commands
yarn docker:run            # Run production container
yarn docker:run:dev        # Run development container with volume mounting
yarn docker:dev            # Build and start with docker-compose

# Management Commands
yarn docker:up             # Start in background
yarn docker:down           # Stop container
yarn docker:logs           # View logs
yarn docker:restart        # Restart container
yarn docker:clean          # Stop and remove image
```

## 🏗️ Docker Configuration Details

### Multi-Stage Build
- **Development Stage**: Full dependencies, development tools
- **Production Stage**: Optimized, production-only dependencies

### Security Features
- ✅ Non-root user (nestjs:nodejs)
- ✅ Minimal Alpine Linux base image
- ✅ Signal handling with dumb-init
- ✅ Health checks configured

### Health Monitoring
- **Endpoint**: `/health`
- **Interval**: Every 30 seconds
- **Timeout**: 10 seconds
- **Retries**: 3 attempts
- **Start Period**: 40 seconds

## 🔧 Development Workflow

### Local Development with Docker
```bash
# Start development container with hot reload
yarn docker:run:dev

# View logs
yarn docker:logs

# Restart if needed
yarn docker:restart
```

### Building for Production
```bash
# Build optimized production image
yarn docker:build

# Test production build locally
yarn docker:run
```

## 🗄️ Database Connection

This backend connects to an external MySQL database. Ensure your database:

1. **Is accessible** from your Docker network
2. **Has proper firewall rules** (if cloud-hosted)
3. **Uses correct connection parameters** in your `.env` file

### Connection Testing
```bash
# Check if backend can connect to database
yarn docker:logs

# Look for database connection messages in logs
```

## 🔍 Troubleshooting

### Common Issues

1. **Database Connection Failed**
   ```bash
   # Check your .env file database configuration
   # Verify database host is accessible
   # Check firewall rules for cloud databases
   ```

2. **Port Already in Use**
   ```bash
   # Check what's using port 3000
   lsof -i :3000
   
   # Change port in .env or docker-compose.yml
   ```

3. **Build Failures**
   ```bash
   # Clean up and rebuild
   yarn docker:clean
   yarn docker:build
   ```

### Health Check Issues
```bash
# Check health status
docker ps

# View health check logs
docker inspect van-edu-backend --format='{{json .State.Health}}'
```

## 🚀 Production Deployment

### Environment Variables for Production
```env
NODE_ENV=production
DB_HOST=your-production-db-host
JWT_SECRET=super-secure-production-secret-at-least-32-chars
```

### Deployment Options

1. **Container Registry**
   ```bash
   # Tag for registry
   docker tag van-edu-backend:latest your-registry/van-edu-backend:latest
   
   # Push to registry
   docker push your-registry/van-edu-backend:latest
   ```

2. **Cloud Platforms**
   - AWS ECS/Fargate
   - Google Cloud Run
   - Azure Container Instances
   - Railway (with Docker)

## 📊 Monitoring

### Health Checks
- Built-in Docker health checks
- `/health` endpoint returns JSON status
- Proper exit codes for monitoring tools

### Logging
```bash
# View real-time logs
yarn docker:logs

# Docker logs
docker logs van-edu-backend -f
```

## 🔗 Related Documentation

- [Environment Setup](./README-ENV-SETUP.md)
- [Swagger API Documentation](./SWAGGER-GUIDE.md)
- [User Middleware Guide](./USER-MIDDLEWARE-GUIDE.md)
- [Database Repository Setup](#database-repository-setup) (see below)

---

# 🗄️ Database Repository Setup Guide

## Creating a Separate Database Repository

Here's a prompt and guide for setting up your database in a separate repository:

### Repository Structure Recommendation
```
van-edu-db/
├── docker-compose.yml      # MySQL service
├── init-scripts/          # Database initialization
│   ├── 01-schema.sql      # Table creation
│   ├── 02-data.sql        # Sample data
│   └── 03-indexes.sql     # Performance indexes
├── Dockerfile             # Custom MySQL image (optional)
├── backup/                # Database backups
├── migrations/            # Database migrations
└── README.md              # Database documentation
```

### Prompt for Database Repository Setup

```
Create a MySQL database repository for Van Edu online course platform with the following requirements:

**SYSTEM ARCHITECTURE:**
- Premium subscription platform (NOT per-course payments)
- Users pay for premium access to unlock all content
- Two user roles: normal users (students) and admins (content managers)
- QR code payment system with admin confirmation
- Automatic premium expiry management

**1. DOCKER SETUP:**
   - MySQL 8.0 container
   - Persistent data volumes
   - Health checks
   - Backup/restore scripts
   - External network access for backend connection

**2. DATABASE SCHEMA:**

   **Users Table:**
   - id (INT, PRIMARY KEY, AUTO_INCREMENT)
   - fullName (VARCHAR(255), NOT NULL)
   - email (VARCHAR(255), UNIQUE, NOT NULL)
   - password (VARCHAR(255), NOT NULL) - bcrypt hashed
   - phone (VARCHAR(255), NULLABLE)
   - address (TEXT, NULLABLE)
   - age (INT, NULLABLE)
   - role (ENUM('user', 'admin'), DEFAULT 'user')
   - isPremium (BOOLEAN, DEFAULT false) - for normal users only
   - premiumExpiryDate (DATETIME, NULLABLE) - null for lifetime
   - currentPackage (VARCHAR(50), NULLABLE) - monthly/annual/lifetime
   - permissions (JSON, NULLABLE) - admin permissions array
   - createdAt (DATETIME, DEFAULT CURRENT_TIMESTAMP)
   - updatedAt (DATETIME, DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP)

   **Package Table (Subscription Plans):**
   - id (INT, PRIMARY KEY, AUTO_INCREMENT)
   - name (VARCHAR(255), NOT NULL) - "Monthly Premium", "Annual Premium"
   - type (VARCHAR(50), UNIQUE, NOT NULL) - monthly/annual/lifetime
   - description (TEXT, NOT NULL)
   - price (DECIMAL(10,2), NOT NULL)
   - durationDays (INT, NULLABLE) - null for lifetime packages
   - isActive (BOOLEAN, DEFAULT true)
   - createdAt (DATETIME, DEFAULT CURRENT_TIMESTAMP)
   - updatedAt (DATETIME, DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP)

   **Payment_Transaction Table:**
   - id (INT, PRIMARY KEY, AUTO_INCREMENT)
   - userId (INT, NOT NULL, FOREIGN KEY -> users.id)
   - packageId (INT, NOT NULL, FOREIGN KEY -> package.id)
   - amount (DECIMAL(10,2), NOT NULL)
   - status (ENUM('pending', 'confirmed', 'expired', 'cancelled'), DEFAULT 'pending')
   - qrCodeData (TEXT, NULLABLE) - JSON string for QR payment
   - referenceNumber (VARCHAR(255), UNIQUE, NOT NULL)
   - expiresAt (DATETIME, NOT NULL) - QR code expiry (24 hours)
   - confirmedById (INT, NULLABLE, FOREIGN KEY -> users.id) - admin who confirmed
   - confirmedAt (DATETIME, NULLABLE)
   - notes (TEXT, NULLABLE) - admin notes
   - createdAt (DATETIME, DEFAULT CURRENT_TIMESTAMP)
   - updatedAt (DATETIME, DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP)

   **Content Tables (Future-ready):**
   - Categories table (id, name, description, isActive)
   - Courses table (id, title, description, categoryId, thumbnailUrl, isPremium, isActive)
   - Lessons table (id, courseId, title, content, videoUrl, duration, order, isPremium)

**3. ADMIN PERMISSIONS SYSTEM:**
   - Video Management: upload_video, edit_video, delete_video
   - Category Management: create_category, edit_category, delete_category
   - User Management: view_users, edit_users, delete_users
   - Analytics: view_analytics
   - System: manage_settings

**4. SAMPLE DATA:**
   - Default subscription packages (Monthly $9.99, Annual $71.99, Lifetime $199.99)
   - Sample admin user with all permissions
   - Sample normal users (free and premium)
   - Sample categories and courses
   - Sample payment transactions

**5. SECURITY:**
   - Database user with limited privileges
   - Environment-based configuration
   - Backup encryption
   - Proper indexes for performance
   - Foreign key constraints

**6. DEVELOPMENT FEATURES:**
   - Auto-seeding of default packages
   - Migration scripts for schema updates
   - Performance indexes on frequently queried fields
   - Sample data for testing premium features

**7. DOCUMENTATION:**
   - Complete setup instructions
   - Schema documentation with relationships
   - Backup/restore procedures
   - Connection examples for backend
   - Premium subscription flow documentation

**8. NETWORKING:**
   - External access configuration for backend connection
   - Network security best practices
   - Health checks for monitoring
   - Connection pooling configuration

**IMPORTANT NOTES:**
- This is a PREMIUM SUBSCRIPTION platform, not per-course payments
- Users buy premium access to unlock ALL content
- Payment system uses QR codes with admin confirmation
- Premium status has expiry dates (except lifetime packages)
- Automatic cron jobs handle premium expiry
- Role-based access control with granular admin permissions

Please create a complete database repository with Docker configuration, initialization scripts, and comprehensive documentation that matches this premium subscription architecture.
```

### Docker Compose for Database Repository
```yaml
version: '3.8'

services:
  mysql:
    image: mysql:8.0
    container_name: van-edu-mysql
    restart: unless-stopped
    environment:
      MYSQL_ROOT_PASSWORD: ${MYSQL_ROOT_PASSWORD:-rootpassword123}
      MYSQL_DATABASE: ${MYSQL_DATABASE:-van_edu_db}
      MYSQL_USER: ${MYSQL_USER:-van_edu_user}
      MYSQL_PASSWORD: ${MYSQL_PASSWORD:-van_edu_password}
    ports:
      - "${MYSQL_PORT:-3306}:3306"
    volumes:
      - mysql_data:/var/lib/mysql
      - ./init-scripts:/docker-entrypoint-initdb.d
      - ./backup:/backup
    networks:
      - van-edu-db-network
    healthcheck:
      test: ["CMD", "mysqladmin", "ping", "-h", "localhost", "-u", "root", "-p${MYSQL_ROOT_PASSWORD:-rootpassword123}"]
      interval: 30s
      timeout: 10s
      retries: 5
    command: --default-authentication-plugin=mysql_native_password

volumes:
  mysql_data:
    driver: local

networks:
  van-edu-db-network:
    driver: bridge
```

This setup gives you:
- ✅ **Separated concerns** - Backend and database in different repos
- ✅ **Scalable architecture** - Each component can be deployed independently  
- ✅ **Team collaboration** - Database and backend teams can work separately
- ✅ **Production ready** - Proper health checks and monitoring
- ✅ **Development friendly** - Easy setup and configuration
- ✅ **Premium subscription ready** - Matches your actual business model 