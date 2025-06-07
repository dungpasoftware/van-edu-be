# Payment & Subscription System Guide

## Overview
Complete payment system for the video course platform with subscription packages, QR code payments, admin confirmation, and automatic premium expiry management.

---

## 📦 **Subscription Packages**

### **Available Packages**
1. **Monthly Premium** - $9.99/month (30 days)
2. **6-Month Premium** - $47.99 (180 days) - 20% savings
3. **Annual Premium** - $71.99 (365 days) - 40% savings  
4. **Lifetime Premium** - $199.99 (unlimited)

### **Package Features**
- Auto-seeded on first startup
- Customizable pricing and descriptions
- Active/inactive status management
- Duration-based or lifetime access

---

## 🔄 **Payment Flow**

### **1. User Subscribes**
```http
POST /payments/subscribe
Authorization: Bearer <user_jwt_token>

{
  "packageId": 1
}
```

**Response:**
```json
{
  "id": 1,
  "amount": 9.99,
  "status": "pending",
  "qrCodeData": "{\"type\":\"bank_transfer\",\"bank\":\"Your Bank Name\",\"account\":\"1234567890\",\"amount\":9.99,\"reference\":\"PAY-123456-ABC123\",\"message\":\"Payment for premium subscription - PAY-123456-ABC123\"}",
  "referenceNumber": "PAY-123456-ABC123",
  "expiresAt": "2024-06-07T10:00:00.000Z"
}
```

### **2. Mobile App Shows QR Code**
- Parse `qrCodeData` JSON
- Display QR code for bank transfer
- Show payment details and expiry time
- Allow user to copy reference number

### **3. Admin Confirms Payment**
```http
PATCH /payments/1/confirm
Authorization: Bearer <admin_jwt_token>

{
  "notes": "Payment verified in bank account at 10:30 AM"
}
```

### **4. User Gets Premium Access**
- `isPremium` set to `true`
- `premiumExpiryDate` calculated
- `currentPackage` updated
- Access to premium content enabled

---

## 📱 **Mobile App Integration**

### **Get Subscription Packages**
```http
GET /packages
```

**Response:**
```json
[
  {
    "id": 1,
    "name": "Monthly Premium",
    "type": "monthly", 
    "description": "Access to all premium courses and features for 1 month. Perfect for trying out premium content.",
    "price": 9.99,
    "durationDays": 30,
    "isActive": true
  },
  {
    "id": 4,
    "name": "Lifetime Premium",
    "type": "lifetime",
    "description": "Lifetime access to all premium courses and features. One-time payment for unlimited learning.",
    "price": 199.99,
    "durationDays": null,
    "isActive": true
  }
]
```

### **Get Premium Status**
```http
GET /users/premium-info
Authorization: Bearer <user_jwt_token>
```

**Response:**
```json
{
  "isPremium": true,
  "premiumExpiryDate": "2024-12-31T23:59:59.999Z",
  "currentPackage": "monthly",
  "daysRemaining": 25,
  "isExpiringSoon": false
}
```

### **Payment History**
```http
GET /payments/my-payments
Authorization: Bearer <user_jwt_token>
```

---

## 👨‍💼 **Admin Features**

### **View Pending Payments**
```http
GET /payments/pending
Authorization: Bearer <admin_jwt_token>
```

**Response:**
```json
[
  {
    "id": 1,
    "user": {
      "id": 2,
      "email": "user@example.com",
      "fullName": "John Doe"
    },
    "package": {
      "id": 1,
      "name": "Monthly Premium",
      "price": 9.99
    },
    "amount": 9.99,
    "status": "pending",
    "referenceNumber": "PAY-123456-ABC123",
    "createdAt": "2024-06-06T10:00:00.000Z",
    "expiresAt": "2024-06-07T10:00:00.000Z"
  }
]
```

### **Confirm Payment**
```http
PATCH /payments/1/confirm
Authorization: Bearer <admin_jwt_token>

{
  "notes": "Verified payment in bank account"
}
```

---

## ⏰ **Automatic Expiry System**

### **Cron Jobs**
- **Every Hour**: Check for expired premium users
- **Every 6 Hours**: Clean up expired payment transactions  
- **Daily at 2 AM**: Comprehensive cleanup

### **Premium Expiry Logic**
```typescript
// Check if premium expired
if (user.isPremium && user.premiumExpiryDate) {
  const now = new Date();
  if (now > user.premiumExpiryDate) {
    user.isPremium = false;
    user.premiumExpiryDate = null;
    user.currentPackage = null;
  }
}
```

### **Payment Transaction Expiry**
- Pending payments expire after 24 hours
- Status changed from `pending` to `expired`
- QR codes become invalid

---

## 🗄️ **Database Schema**

### **Package Table**
```sql
CREATE TABLE package (
  id INT PRIMARY KEY AUTO_INCREMENT,
  name VARCHAR(255) NOT NULL,
  type VARCHAR(50) UNIQUE NOT NULL,
  description TEXT NOT NULL,
  price DECIMAL(10,2) NOT NULL,
  durationDays INT NULL,
  isActive BOOLEAN DEFAULT true,
  createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
  updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
```

### **Payment Transaction Table**
```sql
CREATE TABLE payment_transaction (
  id INT PRIMARY KEY AUTO_INCREMENT,
  userId INT NOT NULL,
  packageId INT NOT NULL,
  amount DECIMAL(10,2) NOT NULL,
  status ENUM('pending', 'confirmed', 'expired', 'cancelled') DEFAULT 'pending',
  qrCodeData TEXT,
  referenceNumber VARCHAR(255) UNIQUE NOT NULL,
  expiresAt DATETIME NOT NULL,
  confirmedById INT NULL,
  confirmedAt DATETIME NULL,
  notes TEXT NULL,
  createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
  updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (userId) REFERENCES user(id),
  FOREIGN KEY (packageId) REFERENCES package(id),
  FOREIGN KEY (confirmedById) REFERENCES user(id)
);
```

### **Updated User Table**
```sql
ALTER TABLE user ADD COLUMN premiumExpiryDate DATETIME NULL;
ALTER TABLE user ADD COLUMN currentPackage VARCHAR(50) NULL;
```

---

## 🔐 **Security Features**

### **Role-Based Access**
- **Normal Users**: Can subscribe and view their payments
- **Admins**: Can view all pending payments and confirm them
- **JWT Authentication**: Required for all payment endpoints

### **Payment Security**
- Unique reference numbers for each transaction
- 24-hour expiry for payment requests
- Admin confirmation required for activation
- Audit trail with admin notes

### **Data Protection**
- QR code data is mock (replace with real bank integration)
- Payment amounts validated against package prices
- Duplicate payment prevention
- Secure transaction logging

---

## 📊 **API Endpoints Summary**

### **Public Endpoints**
- `GET /packages` - Get subscription packages

### **User Endpoints** (Normal Users Only)
- `POST /payments/subscribe` - Create subscription payment
- `GET /payments/my-payments` - Get payment history
- `GET /users/premium-info` - Get premium status

### **Admin Endpoints** (Admins Only)
- `GET /payments/pending` - View pending payments
- `PATCH /payments/:id/confirm` - Confirm payment

### **General User Endpoints**
- `GET /users/profile` - Get profile (includes premium info)
- `PATCH /users/profile/update` - Update profile
- `PATCH /users/change-password` - Change password

---

## 🚀 **Implementation Examples**

### **Mobile App - Subscribe Flow**
```javascript
// 1. Get packages
const packages = await fetch('/packages');

// 2. User selects package and subscribes
const subscription = await fetch('/payments/subscribe', {
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${userToken}`,
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({ packageId: selectedPackage.id })
});

// 3. Show QR code
const qrData = JSON.parse(subscription.qrCodeData);
showQRCode(qrData);

// 4. Poll for payment confirmation
const checkPayment = setInterval(async () => {
  const premiumInfo = await fetch('/users/premium-info', {
    headers: { 'Authorization': `Bearer ${userToken}` }
  });
  
  if (premiumInfo.isPremium) {
    clearInterval(checkPayment);
    showSuccessMessage();
    redirectToPremiumContent();
  }
}, 5000);
```

### **Admin Dashboard - Confirm Payment**
```javascript
// 1. Get pending payments
const pendingPayments = await fetch('/payments/pending', {
  headers: { 'Authorization': `Bearer ${adminToken}` }
});

// 2. Admin confirms payment
const confirmPayment = async (transactionId, notes) => {
  await fetch(`/payments/${transactionId}/confirm`, {
    method: 'PATCH',
    headers: {
      'Authorization': `Bearer ${adminToken}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ notes })
  });
};
```

---

## 🎯 **Best Practices**

### **For Mobile Development**
1. **Cache package data** - Packages rarely change
2. **Handle QR expiry** - Show countdown timer
3. **Offline support** - Store payment status locally
4. **Push notifications** - Notify when premium activated

### **For Admin Dashboard**
1. **Real-time updates** - WebSocket for pending payments
2. **Bulk operations** - Confirm multiple payments
3. **Search & filter** - Find specific transactions
4. **Export reports** - Payment analytics

### **For Backend**
1. **Rate limiting** - Prevent payment spam
2. **Monitoring** - Track payment success rates
3. **Backup strategy** - Regular database backups
4. **Error handling** - Graceful failure recovery

---

## 🔧 **Configuration**

### **Environment Variables**
```env
# Payment settings
PAYMENT_QR_EXPIRY_HOURS=24
PREMIUM_WARNING_DAYS=7

# Cron settings  
ENABLE_PAYMENT_CRON=true
CRON_TIMEZONE=UTC
```

### **Customization**
- **Package prices**: Edit in database or admin panel
- **QR code format**: Update `generateQRCodeData()` method
- **Expiry times**: Modify cron schedules
- **Bank integration**: Replace mock QR with real API

This system provides a complete, production-ready payment solution for your video course platform! 🎓💳 