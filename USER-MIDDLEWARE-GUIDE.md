# 🔐 User Middleware System - Get Current User from Token

## 📋 Overview

Your Van Edu Backend now includes a **User Middleware System** that automatically extracts user information from JWT tokens and fetches complete user data from the database. This means you can easily access current user information in any endpoint without passing user IDs!

## ✨ What's New

### 🛠️ **Components Added:**

1. **UserMiddleware** - Extracts JWT token and fetches user data
2. **@CurrentUser()** decorator - Easy access to current user in controllers
3. **AuthenticatedRequest** interface - Type-safe request object
4. **New endpoints** - Get and update current user profile

## 🚀 How It Works

### **1. Token Processing Flow:**
```
JWT Token → Middleware → Database → Request.user → @CurrentUser() → Your Endpoint
```

### **2. Automatic User Injection:**
```typescript
// Before: You had to pass user ID manually
@Get('profile/:userId')
getProfile(@Param('userId') userId: string) {
  return this.usersService.findOne(+userId);
}

// After: User is automatically available
@Get('profile')
getProfile(@CurrentUser() user: User) {
  return user; // Complete user data already loaded!
}
```

## 🎯 New API Endpoints

### **Authentication Endpoints:**

#### **GET /auth/me** 🆕
Get current user information using JWT token only.

**Request:**
```bash
curl -X GET http://localhost:3000/auth/me \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

**Response:**
```json
{
  "id": 1,
  "email": "user@example.com",
  "fullName": "John Doe",
  "phone": "+1234567890",
  "address": "123 Main St",
  "age": 25
}
```

### **User Profile Endpoints:**

#### **GET /users/profile** 🆕
Alternative endpoint to get current user profile.

#### **PATCH /users/profile/update** 🆕
Update current user's own profile without specifying user ID.

**Request:**
```bash
curl -X PATCH http://localhost:3000/users/profile/update \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "fullName": "John Smith",
    "phone": "+1987654321"
  }'
```

## 🔧 How to Use in Your Controllers

### **1. Import the Decorator:**
```typescript
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { User } from '../users/user.entity';
```

### **2. Use in Any Protected Endpoint:**
```typescript
@Controller('courses')
@UseGuards(JwtAuthGuard)
export class CoursesController {

  @Get('my-courses')
  @ApiBearerAuth('JWT-auth')
  getMyCoreses(@CurrentUser() user: User) {
    // User data is automatically available!
    return this.coursesService.findByUserId(user.id);
  }

  @Post()
  @ApiBearerAuth('JWT-auth')
  createCourse(
    @CurrentUser() user: User,
    @Body() createCourseDto: CreateCourseDto
  ) {
    // Automatically set course owner
    return this.coursesService.create({
      ...createCourseDto,
      ownerId: user.id,
      ownerEmail: user.email
    });
  }
}
```

### **3. Access User Information:**
```typescript
@Get('dashboard')
getDashboard(@CurrentUser() user: User) {
  console.log('Current user:', user.email);
  console.log('User ID:', user.id);
  console.log('Full name:', user.fullName);
  
  // All user data is available:
  // user.id, user.email, user.fullName, 
  // user.phone, user.address, user.age
  
  return {
    welcome: `Hello ${user.fullName}!`,
    userId: user.id,
    // ... dashboard data
  };
}
```

## 🛡️ Security Features

### **1. Password Exclusion:**
The middleware automatically excludes password from user data for security.

### **2. Token Validation:**
- Invalid tokens are handled gracefully
- Expired tokens don't crash the application
- Authentication is still enforced by guards

### **3. Database Sync:**
- User data is always fresh from database
- No stale cached data issues

## 📊 Usage Examples

### **Create User-Specific Content:**
```typescript
@Post('posts')
@UseGuards(JwtAuthGuard)
createPost(
  @CurrentUser() user: User,
  @Body() createPostDto: CreatePostDto
) {
  return this.postsService.create({
    ...createPostDto,
    authorId: user.id,
    authorName: user.fullName,
    authorEmail: user.email
  });
}
```

### **User Authorization:**
```typescript
@Get('posts/:id')
@UseGuards(JwtAuthGuard)
async getPost(
  @CurrentUser() user: User,
  @Param('id') postId: string
) {
  const post = await this.postsService.findOne(+postId);
  
  // Check if user owns this post
  if (post.authorId !== user.id) {
    throw new ForbiddenException('You can only view your own posts');
  }
  
  return post;
}
```

### **User Activity Logging:**
```typescript
@Post('courses/:id/enroll')
@UseGuards(JwtAuthGuard)
enrollInCourse(
  @CurrentUser() user: User,
  @Param('id') courseId: string
) {
  // Log user activity
  this.activityService.log({
    userId: user.id,
    userEmail: user.email,
    action: 'COURSE_ENROLLMENT',
    courseId: +courseId,
    timestamp: new Date()
  });
  
  return this.enrollmentService.enroll(user.id, +courseId);
}
```

## 🚀 Advanced Usage

### **Conditional Logic Based on User:**
```typescript
@Get('content')
@UseGuards(JwtAuthGuard)
getContent(@CurrentUser() user: User) {
  // Different content based on user data
  if (user.age && user.age < 18) {
    return this.contentService.getKidsFriendlyContent();
  }
  
  return this.contentService.getAdultContent();
}
```

### **User Preferences:**
```typescript
@Get('recommended-courses')
@UseGuards(JwtAuthGuard)
getRecommendedCourses(@CurrentUser() user: User) {
  return this.recommendationService.getRecommendations({
    userId: user.id,
    userLocation: user.address,
    userAge: user.age
  });
}
```

## ⚡ Performance Notes

- **Efficient**: User data is fetched once per request
- **Cached**: No multiple database calls for the same user
- **Lightweight**: Minimal overhead on request processing

## 🎉 Benefits Summary

✅ **No more manual user ID passing**
✅ **Automatic user data loading**
✅ **Type-safe user access**
✅ **Security-focused (password excluded)**
✅ **Works with any protected endpoint**
✅ **Fresh data from database**
✅ **Clean, readable code**

## 🔮 Perfect for Van Edu Features

This middleware system is perfect for building your online course platform:

- **Course Enrollment**: Auto-assign courses to current user
- **Progress Tracking**: Track user's course progress
- **User Dashboard**: Personalized dashboard data
- **Content Access**: User-specific content permissions
- **Activity Logs**: Track user actions and engagement
- **Recommendations**: Personalized course recommendations

Your Van Edu platform now has professional-grade user management! 🚀 