# After Love Backend - API Documentation

## Overview

This is the REST API documentation for the After Love backend application. The API is built with NestJS and provides endpoints for user authentication, user management, and partner relationship features.

**Base URL:** `http://localhost:8000/api`

## Authentication

Most endpoints require JWT authentication. Include the JWT token in the Authorization header:

```
Authorization: Bearer <your-jwt-token>
```

## Error Handling

All endpoints return responses in the following format:

```json
{
  "message": "Description of the result",
  "data": {} // Response data or null if error
}
```

## Endpoints

### 🏠 General

#### Get Application Info

- **URL:** `GET /`
- **Description:** Basic application health check
- **Authentication:** None required
- **Response:**

```json
"Hello World!"
```

---

### 🔐 Authentication (`/auth`)

#### Register User

- **URL:** `POST /auth/register`
- **Description:** Create a new user account
- **Authentication:** None required
- **Request Body:**

```json
{
  "email": "user@example.com",
  "password": "password123",
  "name": "John Doe" // Optional
}
```

- **Validation:**
  - `email`: Must be a valid email address
  - `password`: Minimum 6 characters
  - `name`: Optional string

- **Success Response:**

```json
{
  "message": "User registered successfully",
  "data": {
    "user": {
      "id": "uuid",
      "email": "user@example.com",
      "name": "John Doe",
      "createdAt": "2025-07-30T...",
      "updatedAt": "2025-07-30T..."
    },
    "token": "jwt-token-here"
  }
}
```

#### Login User

- **URL:** `POST /auth/login`
- **Description:** Authenticate user and get JWT token
- **Authentication:** None required
- **Request Body:**

```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

- **Validation:**
  - `email`: Must be a valid email address
  - `password`: Required string

- **Success Response:**

```json
{
  "message": "Login successful",
  "data": {
    "user": {
      "id": "uuid",
      "email": "user@example.com",
      "name": "John Doe"
    },
    "token": "jwt-token-here"
  }
}
```

#### Get User Profile

- **URL:** `GET /auth/profile`
- **Description:** Get current authenticated user's profile
- **Authentication:** Required (JWT)
- **Success Response:**

```json
{
  "message": "Profile retrieved successfully",
  "data": {
    "id": "uuid",
    "email": "user@example.com",
    "name": "John Doe",
    "coupleId": "uuid-or-null",
    "createdAt": "2025-07-30T...",
    "updatedAt": "2025-07-30T..."
  }
}
```

---

### 👥 Users (`/users`)

#### Get All Users

- **URL:** `GET /users`
- **Description:** Retrieve all users (admin endpoint)
- **Authentication:** None required (should be protected in production)
- **Success Response:**

```json
{
  "message": "All users retrieved successfully",
  "data": [
    {
      "id": "uuid",
      "email": "user@example.com",
      "name": "John Doe",
      "createdAt": "2025-07-30T...",
      "updatedAt": "2025-07-30T..."
    }
  ]
}
```

#### Get User by ID

- **URL:** `GET /users/:id`
- **Description:** Retrieve a specific user by ID
- **Authentication:** None required (should be protected in production)
- **URL Parameters:**
  - `id` (string): User UUID
- **Success Response:**

```json
{
  "message": "User found",
  "data": {
    "id": "uuid",
    "email": "user@example.com",
    "name": "John Doe",
    "coupleId": "uuid-or-null",
    "createdAt": "2025-07-30T...",
    "updatedAt": "2025-07-30T..."
  }
}
```

#### Create User

- **URL:** `POST /users`
- **Description:** Create a new user (admin endpoint)
- **Authentication:** None required (should be protected in production)
- **Request Body:**

```json
{
  "name": "John Doe",
  "email": "user@example.com"
}
```

- **Note:** Password is auto-generated for system users. Users should use the auth flow for normal registration.

#### Update User

- **URL:** `PUT /users/:id`
- **Description:** Update user information
- **Authentication:** None required (should be protected in production)
- **URL Parameters:**
  - `id` (string): User UUID
- **Request Body:**

```json
{
  "name": "Updated Name", // Optional
  "email": "newemail@example.com" // Optional
}
```

#### Update User Password

- **URL:** `PATCH /users/:id/password`
- **Description:** Update user password (admin endpoint)
- **Authentication:** None required (should be protected in production)
- **URL Parameters:**
  - `id` (string): User UUID
- **Request Body:**

```json
{
  "password": "newpassword123"
}
```

- **Validation:**
  - `password`: Minimum 6 characters

#### Delete User

- **URL:** `DELETE /users/:id`
- **Description:** Delete a user account
- **Authentication:** None required (should be protected in production)
- **URL Parameters:**
  - `id` (string): User UUID

#### Get My Partner Status

- **URL:** `GET /users/me/partner-status`
- **Description:** Get current user's partner invitation and relationship status
- **Authentication:** Required (JWT)
- **Success Response (User has partner):**

```json
{
  "message": "Partner status retrieved successfully",
  "data": {
    "hasPartner": true,
    "hasInvitation": false,
    "invitationStatus": "ACCEPTED",
    "partnerName": "Partner's Name"
  }
}
```

- **Success Response (User has pending invitation):**

```json
{
  "message": "Partner status retrieved successfully",
  "data": {
    "hasPartner": false,
    "hasInvitation": true,
    "invitationStatus": "PENDING", // or "ACCEPTED", "EXPIRED", "CANCELLED"
    "invitedEmail": "partner@example.com",
    "invitationCreatedAt": "2025-07-30T...",
    "invitationExpiresAt": "2025-08-06T...",
    "partnerName": "Partner's Name" // if they've joined
  }
}
```

- **Success Response (No partner or invitations):**

```json
{
  "message": "Partner status retrieved successfully",
  "data": {
    "hasPartner": false,
    "hasInvitation": false
  }
}
```

---

## Data Models

### User

```typescript
{
  id: string; // UUID
  email: string; // Unique email address
  name: string | null; // User's display name
  coupleId: string | null; // ID of associated couple
  createdAt: Date; // Registration timestamp
  updatedAt: Date; // Last update timestamp
}
```

### Couple

```typescript
{
  id: string; // UUID
  partner1Id: string; // First partner's user ID
  partner2Id: string | null; // Second partner's user ID (null if invitation pending)
  createdAt: Date; // Couple creation timestamp
  establishedAt: Date | null; // When both partners joined
}
```

### Invitation

```typescript
{
  id: string; // UUID
  inviterUserId: string; // User who sent the invitation
  coupleId: string; // Associated couple ID
  invitedEmail: string; // Email address invited
  token: string; // Unique invitation token
  status: 'PENDING' | 'ACCEPTED' | 'EXPIRED' | 'CANCELLED';
  createdAt: Date; // Invitation sent timestamp
  expiresAt: Date; // Invitation expiration
  acceptedAt: Date | null; // When invitation was accepted
}
```

---

## Environment Configuration

The following environment variables are required:

```env
# Database
DATABASE_URL="postgres://user:password@host:port/database"

# Server
PORT=8000
NODE_ENV="development"

# JWT
JWT_SECRET="your-secret-key"
JWT_EXPIRES_IN="7d"

# CORS
FRONTEND_URL="http://localhost:3000"

# Rate Limiting
RATE_LIMIT_TTL=60
RATE_LIMIT_LIMIT=100
```

---

## CORS Configuration

The API is configured to allow requests from the frontend URL specified in the `FRONTEND_URL` environment variable. In development, this is typically `http://localhost:3000`.

---

## Status Codes

- `200` - Success
- `201` - Created
- `400` - Bad Request (validation errors)
- `401` - Unauthorized (missing or invalid JWT)
- `403` - Forbidden
- `404` - Not Found
- `409` - Conflict (e.g., email already exists)
- `500` - Internal Server Error

---

## Development Notes

1. **Security:** Many endpoints currently don't require authentication but should be protected in production
2. **Validation:** All request bodies are validated using class-validator decorators
3. **Database:** Uses Prisma ORM with PostgreSQL
4. **Authentication:** JWT-based authentication with configurable expiration
5. **Password Security:** Passwords are hashed using bcryptjs with 12 salt rounds

---

_Last updated: July 30, 2025_
