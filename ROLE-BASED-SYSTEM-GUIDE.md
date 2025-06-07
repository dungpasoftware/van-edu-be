 # Role-Based Access Control System

## Overview
This system implements a comprehensive role-based access control (RBAC) for the video course platform with two main user types:

1. **Normal Users** - Students who can access courses
2. **Admin Users** - Staff who can upload content and manage the platform

## User Roles

### 🧑‍🎓 **Normal User (USER)**
- **Purpose**: Students accessing courses
- **Features**:
  - Can view and purchase courses
  - Profile management
  - Premium status for advanced features
- **Special Fields**:
  - `isPremium: boolean` - Access to premium content

### 👨‍💼 **Admin User (ADMIN)** 
- **Purpose**: Platform management and content creation
- **Features**:
  - Upload and manage videos
  - Create and manage categories
  - User management (based on permissions)
  - Analytics access
- **Special Fields**:
  - `permissions: AdminPermission[]` - Granular permission control

---

## Admin Permissions

### 📹 **Video Management**
- `UPLOAD_VIDEO` - Upload new videos
- `EDIT_VIDEO` - Edit existing videos  
- `DELETE_VIDEO` - Delete videos

### 📂 **Category Management**
- `CREATE_CATEGORY` - Create new categories
- `EDIT_CATEGORY` - Edit existing categories
- `DELETE_CATEGORY` - Delete categories

### 👥 **User Management**
- `VIEW_USERS` - View user lists
- `EDIT_USERS` - Edit user information
- `DELETE_USERS` - Delete user accounts

### 📊 **Analytics & Reports**
- `VIEW_ANALYTICS` - Access platform analytics

### ⚙️ **System Settings**
- `MANAGE_SETTINGS` - Manage platform settings

---

## API Endpoints

### 🔐 **Authentication (Single System)**

#### **User Registration**
```http
POST /auth/register
```
**Body:**
```json
{
  "fullName": "John Doe",
  "email": "john@example.com", 
  "password": "password123",
  "role": "user",              // Optional, defaults to "user"
  "isPremium": false           // Optional, for normal users
}
```

#### **Admin Registration** (Admin Only)
```http
POST /auth/admin/register
Authorization: Bearer <admin_jwt_token>
```
**Body:**
```json
{
  "fullName": "Admin User",
  "email": "admin@example.com",
  "password": "adminpass123", 
  "permissions": [
    "upload_video",
    "create_category",
    "view_users"
  ]
}
```

#### **Login (Universal)**
```http
POST /auth/login
```
**Body:**
```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

**Response includes role information:**
```json
{
  "access_token": "jwt_token_here",
  "user": {
    "id": 1,
    "email": "user@example.com",
    "fullName": "John Doe",
    "role": "user",
    "isPremium": false,
    "permissions": null
  }
}
```

---

## Guards and Decorators

### 🛡️ **Role Guard**
Protect endpoints by user role:

```typescript
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(UserRole.ADMIN)
@Get('admin-only')
adminOnlyEndpoint() {
  // Only admins can access
}
```

### 🔑 **Permission Guard**
Protect admin endpoints by specific permissions:

```typescript
@UseGuards(JwtAuthGuard, PermissionsGuard)
@RequirePermissions(AdminPermission.UPLOAD_VIDEO)
@Post('upload-video')
uploadVideo() {
  // Only admins with UPLOAD_VIDEO permission
}
```

### 👤 **Current User Decorator**
Access current user with full role information:

```typescript
@Get('profile')
getProfile(@CurrentUser() user: User) {
  // user.role, user.isPremium, user.permissions available
}
```

---

## Usage Examples

### 🎯 **User Profile Updates**

**Normal User Profile:**
```http
PATCH /users/profile/update
Authorization: Bearer <user_jwt_token>

{
  "fullName": "Updated Name",
  "phone": "+1234567890"
}
```
✅ Can update: `fullName`, `phone`, `address`, `age`  
❌ Cannot update: `email`, `password`, `role`, `permissions`

**Admin User Profile:**
```http
PATCH /users/profile/update  
Authorization: Bearer <admin_jwt_token>

{
  "fullName": "Admin Updated",
  "phone": "+1987654321"
}
```
✅ Can update: Same as normal user (basic profile fields)  
❌ Cannot update: `email`, `password`, `role`, `permissions`

### 🔐 **Password Changes (All Users)**
```http
PATCH /users/change-password
Authorization: Bearer <jwt_token>

{
  "currentPassword": "oldpass123",
  "newPassword": "newpass123", 
  "confirmPassword": "newpass123"
}
```

### 👥 **Admin User Management**
```http
# View all users (requires VIEW_USERS permission)
GET /users
Authorization: Bearer <admin_jwt_token>

# Edit specific user (requires EDIT_USERS permission)  
PATCH /users/123
Authorization: Bearer <admin_jwt_token>
```

---

## Database Schema

### Updated User Entity:
```sql
CREATE TABLE user (
  id INT PRIMARY KEY AUTO_INCREMENT,
  fullName VARCHAR(255) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  phone VARCHAR(255),
  address TEXT,
  age INT,
  role ENUM('user', 'admin') DEFAULT 'user',
  isPremium BOOLEAN DEFAULT false,
  permissions JSON
);
```

### Example Data:

**Normal User:**
```json
{
  "id": 1,
  "email": "student@example.com",
  "role": "user",
  "isPremium": true,
  "permissions": null
}
```

**Admin User:**
```json
{
  "id": 2, 
  "email": "admin@example.com",
  "role": "admin",
  "isPremium": false,
  "permissions": [
    "upload_video",
    "create_category", 
    "view_users",
    "view_analytics"
  ]
}
```

---

## Security Features

### 🔒 **Access Control**
- **JWT tokens** include role information
- **Guards** validate roles and permissions
- **Middleware** provides user context
- **Decorators** simplify access to user data

### 🛡️ **Data Protection**
- **Passwords** never returned in responses
- **Sensitive fields** (role, permissions) protected from updates
- **Email changes** require separate secure process
- **Permission validation** for all admin actions

### 🎯 **Best Practices**
- Single authentication system (no separate admin login)
- Granular permission control for admins
- Role-based UI rendering
- Audit logging for sensitive operations
- Token refresh for long sessions

---

## Frontend Integration

### 🎨 **Role-Based UI**
```javascript
// Check user role
if (user.role === 'admin') {
  showAdminDashboard();
} else {
  showStudentDashboard();
}

// Check specific permissions
if (user.permissions?.includes('upload_video')) {
  showUploadButton();
}

// Check premium status
if (user.isPremium) {
  showPremiumContent();
}
```

### 📱 **API Integration**
```javascript
// Login (same for all users)
const response = await fetch('/auth/login', {
  method: 'POST',
  body: JSON.stringify({ email, password })
});

const { access_token, user } = await response.json();

// Store token and user info
localStorage.setItem('token', access_token);
localStorage.setItem('user', JSON.stringify(user));

// Use in subsequent requests
fetch('/api/endpoint', {
  headers: {
    'Authorization': `Bearer ${access_token}`
  }
});
```

This system provides a robust, scalable foundation for your video course platform with proper separation of concerns and security.