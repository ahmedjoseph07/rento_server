# Vehicle Rental System Server

A RESTful API for managing vehicle rentals built with Node.js, TypeScript, Express.js, and PostgreSQL. This system provides comprehensive functionality for vehicle management, user authentication, and booking operations.

[![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Node.js](https://img.shields.io/badge/Node.js-43853D?style=for-the-badge&logo=node.js&logoColor=white)](https://nodejs.org/)
[![Express.js](https://img.shields.io/badge/Express.js-404D59?style=for-the-badge)](https://expressjs.com/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-316192?style=for-the-badge&logo=postgresql&logoColor=white)](https://www.postgresql.org/)

---
## Live Server Link
[![Vercel](https://img.shields.io/badge/vercel-404D59?style=for-the-badge&logo=vercel&logoColor=white)](https://www.vercel.com/)
---

## Table of Contents

- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Prerequisites](#-prerequisites)
- [Installation](#-installation)
- [Environment Setup](#-environment-setup)
- [Database Setup](#-database-setup)
- [Running the Application](#-running-the-application)
- [Project Structure](#-project-structure)
- [Deployment](#-deployment)
- [Contributing](#-contributing)

---

##  Features

### Authentication & Authorization
- **JWT-based authentication** with secure token generation
- **Role-based access control** (Admin & Customer roles)
- **Password encryption** using bcrypt
- **Protected routes** with middleware validation

### Vehicle Management
- Full CRUD operations for vehicles
- Vehicle availability tracking
- Automatic status updates based on bookings
- Support for multiple vehicle types

### User Management
- User registration and profile management
- Admin can manage all users
- Customers can update own profiles
- Secure password handling

### Booking System
- Create and manage bookings
- Automatic price calculation based on rental duration
- Real-time vehicle availability updates
- Booking status tracking (active, cancelled, returned)
- Auto-return functionality for expired bookings

### Security Features
- Password hashing with bcrypt
- JWT token-based authentication
- Role-based authorization
- SQL injection prevention

---

##  Tech Stack

| Technology | Purpose |
|------------|---------|
| **Node.js** | Runtime Environment
| **TypeScript** | Programming Language
| **Express.js** | Web Framework 
| **PostgreSQL** | Database
| **bcrypt** | Password Hashing
| **jsonwebtoken** | JWT Authentication
| **pg** | PostgreSQL Client
| **dotenv** | Environment Variables

---

## Prerequisites

Before you begin, ensure you have the following installed on your system:

- **Node.js** (v16 or higher) - [Download](https://nodejs.org/)
- **npm** or **yarn** - Comes with Node.js
- **PostgreSQL** (v13 or higher) - [Download](https://www.postgresql.org/download/)
- **Git** - [Download](https://git-scm.com/downloads)
- A code editor (VS Code recommended)

---

## Installation

### 1. Clone the Repository

```bash
git clone https://github.com/ahmedjoseph07/rento_server
cd rento_server
```

### 2. Install Dependencies

Using npm:
```bash
npm install
```

Or using yarn:
```bash
yarn install
```

### 3. Install TypeScript Globally (Optional)

```bash
npm install -g typescript
npm install -g ts-node
```

---

## Environment Setup

### 1. Create Environment File

Create a `.env` file in the root directory:

```bash
touch .env
```

### 2. Configure Environment Variables

Add the following configuration to your `.env` file:

```env
PORT = <port>
CONNECTION_STRING = <connection_string> (NeonDB or Supabase)
JWT_SECRET = <jwt_secret>
```

### 3. Generate Secure JWT Secret

For production, generate a secure random string:

```bash
# Using Node.js
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
```

---
## Database Setup

### Prerequisites

- [NeonDB](https://neon.tech/) account (or any PostgreSQL database)
- Node.js installed
- `pg` npm package

### Installation

Install the required database package:

```bash
npm install pg
```

### Database Configuration

1. **Create a NeonDB Database:**
   - Sign up at [neon.tech](https://neon.tech/)
   - Create a new project
   - Copy your connection string

2. **Configure Environment Variables:**

   Create a `.env` file in your project root:

   ```env
   DATABASE_URL=your_neondb_connection_string
   ```

### Database Schema

The application uses three main tables with the following structure:

#### Users Table
- Stores customer and admin user information
- Email validation with lowercase enforcement
- Password minimum length: 6 characters
- Roles: `admin` or `customer`

#### Vehicles Table
- Manages vehicle inventory
- Types: `car`, `bike`, `van`, `SUV`
- Availability status: `available` or `booked`
- Unique registration numbers
- Daily rent price validation (must be > 0)

#### Bookings Table
- Tracks vehicle rental bookings
- Foreign key relationships with users and vehicles
- Status tracking: `active`, `cancelled`, `returned`
- Date validation (end date must be after start date)
- Automatic total price calculation

### Automatic Initialization

The database tables are automatically created when the application starts through the `initDB()` function in `db.ts`. This function:

- Creates all three tables if they don't exist
- Applies constraints and validations
- Sets up foreign key relationships
- Uses CASCADE delete for maintaining data integrity

No manual SQL execution is required - simply run your application and the schema will be initialized automatically.

### Database Connection

The application connects to PostgreSQL using a connection pool:

```typescript
import { Pool } from 'pg'

export const pool = new Pool({
  connectionString: config.connection_string
})
```

### Schema Details

```sql
-- Users Table
CREATE TABLE IF NOT EXISTS users(
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  email VARCHAR(150) UNIQUE NOT NULL,
  password TEXT NOT NULL CHECK (char_length(password) >= 6),
  phone TEXT NOT NULL,
  role TEXT NOT NULL CHECK (role IN ('admin','customer')),
  CHECK (email = lower(email))
)

-- Vehicles Table
CREATE TABLE IF NOT EXISTS vehicles(
  id SERIAL PRIMARY KEY,
  vehicle_name VARCHAR(100) NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('car','bike','van','SUV')),
  registration_number VARCHAR(50) NOT NULL UNIQUE,
  daily_rent_price NUMERIC(10,2) NOT NULL CHECK (daily_rent_price > 0),
  availability_status TEXT NOT NULL CHECK(availability_status IN ('available','booked'))
)

-- Bookings Table
CREATE TABLE IF NOT EXISTS bookings(
  id SERIAL PRIMARY KEY,
  customer_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  vehicle_id INTEGER NOT NULL REFERENCES vehicles(id) ON DELETE CASCADE,
  rent_start_date DATE NOT NULL,
  rent_end_date DATE NOT NULL,
  total_price NUMERIC(10,2) NOT NULL CHECK (total_price > 0),
  status TEXT NOT NULL CHECK (status IN ('active','cancelled','returned')),
  CHECK (rent_end_date > rent_start_date)
)
```

### Key Features

- **Automatic Schema Creation**: Tables are created automatically on application startup
- **Data Validation**: Built-in constraints for data integrity
- **Referential Integrity**: Foreign key relationships with CASCADE delete
- **Type Safety**: Strong typing with CHECK constraints
- **Connection Pooling**: Efficient database connection management

---

##  Running the Application

### Development Mode

```bash
# Using npm
npm run dev

# Using yarn
yarn dev
```

### Production Build

```bash
# Build TypeScript
npm run build

# Start production server
npm start
```

### Available Scripts

```json
{
  "scripts": {
    "dev": "ts-node-dev --respawn --transpile-only src/server.ts",
    "build": "tsc",
    "start": "node dist/server.js",
    "lint": "eslint . --ext .ts",
    "format": "prettier --write \"src/**/*.ts\"",
    "test": "jest"
  }
}
```

### Verify Server is Running

Once started, you should see:

```
Server is running on port 3000
```

---

## API Documentation

### Base URL
```
http://localhost:5000/
```



### API Endpoints Summary

| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| **Authentication** |
| POST | `/auth/signup` | Public | Register new user |
| POST | `/auth/signin` | Public | User login |
| **Vehicles** |
| POST | `/vehicles` | Admin | Create vehicle |
| GET | `/vehicles` | Public | Get all vehicles |
| GET | `/vehicles/:id` | Public | Get vehicle by ID |
| PUT | `/vehicles/:id` | Admin | Update vehicle |
| DELETE | `/vehicles/:id` | Admin | Delete vehicle |
| **Users** |
| GET | `/users` | Admin | Get all users |
| PUT | `/users/:id` | Admin/Owner | Update user |
| DELETE | `/users/:id` | Admin | Delete user |
| **Bookings** |
| POST | `/bookings` | Authenticated | Create booking |
| GET | `/bookings` | Authenticated | Get bookings |
| PUT | `/bookings/:id` | Authenticated | Update booking |

---

## 📁 Project Structure

```
rento_server/
├── src/
│ ├─config/
│ │ ├db.ts                        # Database connection & initialization
│ │ └index.ts                     # Environment variables configuration
│ ├─modules/
│ │ ├ auth/
│ │ │ ├──auth.route.ts            # Authentication endpoints
│ │ │ ├──auth.controller.ts.      # Login, register, logout logic
│ │ │ └──auth.service.ts.         # Authentication business logic
│ │ ├──user/
│ │ │ ├──user.route.ts            # User management endpoints
│ │ │ ├──user.controller.ts.      # User CRUD operations
│ │ │ └──user.service.ts          # User business logic
│ │ ├──vehicle/
│ │ │ ├──vehicle.route.ts         # Vehicle management endpoints
│ │ │ ├──vehicle.controller.ts    # Vehicle CRUD operations
│ │ │ └──vehicle.service.ts.      # Vehicle business logic
│ │ └booking/
│ │   ├──booking.route.ts       # Booking management endpoints
│ │   ├──booking.controller.ts    # Booking CRUD operations
│ │   └──booking.service.ts.      # Booking business logic
│ ├─middleware/
│ │ ├authenticateJWT.ts           # JWT verification
│ │ ├authorizeAdmin.ts            # Admin verification 
│ ├─app.ts                        # Express app configuration
│ └─server.ts                     # Server entry point
├──dist/                          # Compiled JavaScript (generated)
├──node_modules/                  # Dependencies (generated)
├──.env                           # Environment variables (not in repo)
├──.gitignore                     # Git ignore rules
├──package.json                   # Project dependencies & scripts
├──tsconfig.json                  # TypeScript configuration
└──README.md                      # Project documentation
```

### Architecture Overview

This project follows the **RCS (Route-Controller-Service)** modular architecture pattern:

#### **Modular Structure**
Each feature (auth, user, vehicle, booking) is organized as a self-contained module with:
- **Route**: Defines API endpoints and applies middleware
- **Controller**: Handles HTTP requests/responses
- **Service**: Contains business logic and database operations

#### **Benefits**
- **Separation of Concerns**: Clear distinction between routing, request handling, and business logic
- **Scalability**: Easy to add new modules without affecting existing code
- **Maintainability**: Related code is grouped together
- **Testability**: Each layer can be tested independently
- **Reusability**: Services can be reused across different controllers

#### **Data Flow**
```
Request → Route → Middleware → Controller → Service → Database
                                                ↓
Response ← Controller ← Service ← Database Result
```

---

## Contributing

We welcome contributions! Please follow these steps:

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit changes: `git commit -m 'Add amazing feature'`
4. Push to branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

---
##  Author

**Joseph Ahmed**
- GitHub: [ahmedjoseph07](https://github.com/ahmedjoseph07)
- Email: ahmedjoseph11@gmail.com

---

## Acknowledgments

- Express.js documentation
- TypeScript handbook
- PostgreSQL community
- Node.js community


