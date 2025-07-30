# Database Schema for Couple Application (for Prisma)

This document describes the data models for a Next.js application managing user couples via an invitation system. Each model corresponds to a database table, and the fields within define the columns.

---

## 1. User Model (`User`)

Represents an individual user account.

```prisma
model User {
  id            String    @id @default(uuid()) @map("id")
  email         String    @unique @map("email")
  passwordHash  String    @map("password_hash") // Stored as a hash
  name          String?   @map("name")
  createdAt     DateTime  @default(now()) @map("created_at")
  updatedAt     DateTime  @updatedAt @map("updated_at")

  // Relationship to Couple: A user can belong to one couple
  // This is a direct link to the couple they are part of
  coupleId      String?   @map("couple_id")
  couple        Couple?   @relation(fields: [coupleId], references: [id], onDelete: SetNull)

  // Relationships where this user is Partner1 or Partner2 in a Couple
  // A user can be partner1 in exactly one couple (unique constraint on couple.partner1Id)
  // A user can be partner2 in exactly one couple (unique constraint on couple.partner2Id)
  coupleAsPartner1 Couple? @relation("Partner1Couple", fields: [partner1Id], references: [id])
  partner1Id      String? @unique @map("partner1_id") // Used for coupleAsPartner1 relation

  coupleAsPartner2 Couple? @relation("Partner2Couple", fields: [partner2Id], references: [id])
  partner2Id      String? @unique @map("partner2_id") // Used for coupleAsPartner2 relation

  // Relationship to Invitations: A user can send many invitations
  invitationsSent Invitation[] @relation("InviterInvitations")

  @@map("users") // Maps this model to the 'users' table in the database
}
```

## 2. Couple Model (`Couple`)

```
model Couple {
  id             String    @id @default(uuid()) @map("id")

  // Relation to Partner 1 (the inviter)
  partner1Id     String    @unique @map("partner1_id") // Ensures a user can only be partner1 in one couple
  partner1       User      @relation("Partner1Couple", fields: [partner1Id], references: [id])

  // Relation to Partner 2 (the invitee)
  partner2Id     String?   @unique @map("partner2_id") // Nullable until partner2 accepts
  partner2       User?     @relation("Partner2Couple", fields: [partner2Id], references: [id])

  createdAt      DateTime  @default(now()) @map("created_at")
  establishedAt  DateTime? @map("established_at") // When partner2 accepts and the couple is fully formed

  // Inverse relation for User.coupleId
  users          User[]

  // Relation to Invitations: A couple can have one related invitation that created it
  invitation     Invitation? // Optional, as a couple might exist without a direct invitation (e.g. admin created)

  @@map("couples") // Maps this model to the 'couples' table in the database
}
```

```
// Enum for invitation status
enum InvitationStatus {
  PENDING
  ACCEPTED
  EXPIRED
  CANCELLED
}
```

## 3. Invitation Model (`Invitation`)

```prisma
model Invitation {
  id             String           @id @default(uuid()) @map("id")

  // The user who sent the invitation
  inviterUserId  String           @map("inviter_user_id")
  inviter        User             @relation("InviterInvitations", fields: [inviterUserId], references: [id])

  // The couple this invitation is intended to form/complete
  coupleId       String           @unique @map("couple_id") // Unique to ensure one active invitation per couple formation
  couple         Couple           @relation(fields: [coupleId], references: [id], onDelete: Cascade)

  invitedEmail   String           @map("invited_email") // Email where the invite was sent
  token          String           @unique // The unique token in the invite URL
  status         InvitationStatus @default(PENDING) // Current status of the invitation
  createdAt      DateTime         @default(now()) @map("created_at")
  expiresAt      DateTime         @map("expires_at") // When the invitation token expires
  acceptedAt     DateTime?        @map("accepted_at") // When the invitation was accepted

  @@map("invitations") // Maps this model to the 'invitations' table in the database
}
```

Relationships Visualized (Conceptual)

```
+------------+          +---------+          +------------+
|   users    |          | couples |          | invitations|
+------------+          +---------+          +------------+
| id (PK)    | -------->| id (PK) | <--------| id (PK)    |
| email      |          | partner1_id (FK) <--| inviter_user_id (FK)
| password   |          | partner2_id (FK) |  | couple_id (FK)  ----->
| name       |          | created_at     |  | invited_email|
| created_at |          | established_at |  | token        |
| updated_at |          +----------------+  | status       |
| couple_id (FK) --------^                 | created_at   |
+------------+                             | expires_at   |
                                           | accepted_at  |
                                           +--------------+

```
