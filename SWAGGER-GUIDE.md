# 🚀 Van Edu API - Swagger Documentation Guide

## 📋 Overview

Your Van Edu Backend now includes comprehensive API documentation using Swagger/OpenAPI 3.0. This provides an interactive interface to explore and test your API endpoints.

## 🌐 Accessing Swagger UI

Once your application is running, you can access the Swagger documentation at:

**URL:** `http://localhost:3000/api`

## 🔧 Setup Instructions

1. **Ensure you have your .env file configured** (see README-ENV-SETUP.md)
2. **Start the application:**
   ```bash
   yarn start:dev
   ```
3. **Open your browser and navigate to:** `http://localhost:3000/api`

## 📚 API Documentation Features

### 🎯 **API Endpoints Documented:**

#### 🔐 Authentication (`/auth`)
- **POST /auth/register** - Register a new user
- **POST /auth/login** - Login and get JWT token

#### 👥 Users (`/users`) - *Requires JWT Authentication*
- **GET /users** - Get all users
- **GET /users/{id}** - Get user by ID  
- **POST /users** - Create new user
- **PATCH /users/{id}** - Update user
- **DELETE /users/{id}** - Delete user

### 🔑 **JWT Authentication in Swagger**

1. **First, register or login** using the auth endpoints
2. **Copy the JWT token** from the response
3. **Click the "Authorize" button** 🔒 at the top right of Swagger UI
4. **Enter:** `Bearer YOUR_JWT_TOKEN_HERE`
5. **Click "Authorize"**
6. **Now you can access protected endpoints** ✅

### 📝 **Swagger Features Included:**

- ✅ **Interactive API Testing** - Test endpoints directly from the browser
- ✅ **Request/Response Examples** - See exactly what data to send/expect
- ✅ **Schema Documentation** - Complete data model definitions
- ✅ **JWT Authentication** - Built-in auth support with Bearer tokens
- ✅ **Error Response Documentation** - Know what errors to expect
- ✅ **Grouped Endpoints** - Organized by tags (auth, users)
- ✅ **Persistent Authorization** - JWT tokens persist across page refreshes

## 🧪 Testing Your API

### **Quick Test Flow:**

1. **Register a new user:**
   - Go to `POST /auth/register`
   - Click "Try it out"
   - Fill in the request body:
     ```json
     {
       "email": "test@example.com",
       "password": "password123",
       "fullName": "Test User"
     }
     ```
   - Click "Execute"

2. **Login to get JWT token:**
   - Go to `POST /auth/login` 
   - Use the same email/password
   - Copy the `access_token` from response

3. **Authorize with JWT:**
   - Click the 🔒 "Authorize" button
   - Enter: `Bearer YOUR_ACCESS_TOKEN`
   - Click "Authorize"

4. **Test protected endpoints:**
   - Try `GET /users` to see all users
   - Try `GET /users/{id}` with a specific user ID

## 🎨 **Swagger Configuration Details**

The Swagger configuration includes:

- **Title:** Van Edu API
- **Description:** Online Course Platform API - Similar to Udemy  
- **Version:** 1.0
- **Tags:** Organized endpoints by functionality
- **JWT Security:** Bearer token authentication
- **Persistent Auth:** Tokens persist across browser sessions

## 🚀 **Production Considerations**

When deploying to production:

1. **Disable Swagger in production** by wrapping the Swagger setup in a condition:
   ```typescript
   if (process.env.NODE_ENV !== 'production') {
     // Swagger setup code
   }
   ```

2. **Or restrict access** by adding authentication middleware to the `/api` route

3. **Use environment variables** for API documentation URLs and settings

## 📖 **Next Steps**

With Swagger set up, you can now:

1. ✅ **Share API documentation** with your frontend developers
2. ✅ **Test new endpoints** as you build them
3. ✅ **Generate client SDKs** using the OpenAPI specification
4. ✅ **Validate API contracts** before deployment
5. ✅ **Onboard new developers** quickly with interactive docs

## 🛠️ **Adding New Endpoints to Swagger**

When you create new controllers/endpoints, add these decorators:

```typescript
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';

@ApiTags('your-feature')
@ApiBearerAuth('JWT-auth') // If auth required
@Controller('your-feature')
export class YourController {
  
  @Post()
  @ApiOperation({ summary: 'Create something' })
  @ApiResponse({ status: 201, description: 'Created successfully' })
  create() {
    // Your endpoint logic
  }
}
```

## 🎉 **Enjoy Your Interactive API Documentation!**

Your Swagger documentation is now ready to help you build and test your online course platform API efficiently! 🚀 