# User Profile API Guide

## Overview
This guide explains the updated user profile management API endpoints with enhanced security and separation of concerns.

## Key Security Features

### 🔒 **Profile Updates vs Password Changes**
- **Profile updates** and **password changes** are now separate endpoints
- Users **cannot** change email or password through profile update endpoint
- Password changes require current password verification

### 🛡️ **Data Protection**
- All profile endpoints exclude password from responses
- Profile updates explicitly exclude email and password fields
- Proper validation and error handling

---

## API Endpoints

### 1. **GET Current User Profile**
```http
GET /users/profile
Authorization: Bearer <jwt_token>
```

**Response:** Returns **ALL** user information except password
```json
{
  "id": 1,
  "email": "user@example.com",
  "fullName": "John Doe",
  "phone": "+1234567890",
  "address": "123 Main St, City, Country",
  "age": 25,
  "createdAt": "2024-01-01T00:00:00.000Z",
  "updatedAt": "2024-01-01T00:00:00.000Z"
}
```

### 2. **PATCH Update Profile** (Secure)
```http
PATCH /users/profile/update
Authorization: Bearer <jwt_token>
Content-Type: application/json
```

**Request Body:**
```json
{
  "fullName": "John Smith",
  "phone": "+1987654321",
  "address": "456 Oak Ave, New City, Country",
  "age": 26
}
```

**Security Notes:**
- ✅ Can update: `fullName`, `phone`, `address`, `age`
- ❌ Cannot update: `email`, `password`
- All fields are optional

### 3. **PATCH Change Password** (New Secure Endpoint)
```http
PATCH /users/change-password
Authorization: Bearer <jwt_token>
Content-Type: application/json
```

**Request Body:**
```json
{
  "currentPassword": "oldpassword123",
  "newPassword": "newpassword123",
  "confirmPassword": "newpassword123"
}
```

**Security Features:**
- ✅ Verifies current password
- ✅ Ensures new passwords match
- ✅ Prevents using same password
- ✅ Minimum 6 characters validation

**Response:**
```json
{
  "message": "Password changed successfully"
}
```

---

## Error Handling

### Profile Update Errors
- `401` - Unauthorized (invalid JWT)
- `400` - Validation errors (invalid data)
- `404` - User not found

### Password Change Errors
- `401` - Unauthorized (invalid JWT)
- `400` - Current password incorrect
- `400` - New passwords don't match
- `400` - New password same as current
- `400` - Password too short (< 6 characters)

---

## Data Transfer Objects (DTOs)

### UpdateProfileDto
```typescript
{
  fullName?: string;     // Optional
  phone?: string;        // Optional
  address?: string;      // Optional
  age?: number;          // Optional, minimum 1
}
```

### ChangePasswordDto
```typescript
{
  currentPassword: string;    // Required
  newPassword: string;        // Required, min 6 chars
  confirmPassword: string;    // Required, min 6 chars
}
```

---

## Usage Examples

### Swagger UI
Access interactive API documentation at: `http://localhost:3000/api`

### cURL Examples

**Get Profile:**
```bash
curl -X GET "http://localhost:3000/users/profile" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

**Update Profile:**
```bash
curl -X PATCH "http://localhost:3000/users/profile/update" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "fullName": "Updated Name",
    "age": 30
  }'
```

**Change Password:**
```bash
curl -X PATCH "http://localhost:3000/users/change-password" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "currentPassword": "oldpass123",
    "newPassword": "newpass123",
    "confirmPassword": "newpass123"
  }'
```

---

## Best Practices

### 🔐 Security
1. Always use HTTPS in production
2. Implement rate limiting for password changes
3. Consider adding email verification for sensitive changes
4. Log security events (password changes, etc.)

### 📱 Frontend Integration
1. Use separate forms for profile updates vs password changes
2. Show password strength indicators
3. Confirm sensitive actions with user
4. Handle all error responses appropriately

### 🧪 Testing
1. Test with valid and invalid JWT tokens
2. Test password validation edge cases
3. Test partial profile updates
4. Test concurrent update scenarios 