# Todo App Backend

Backend API for the Todo application with username validation and MongoDB storage.

## Features

- ✅ Username availability checking
- ✅ Unique username validation
- ✅ Todo CRUD operations per user
- ✅ Daily todo reset functionality
- ✅ MongoDB integration

## Setup Instructions

### 1. Install Dependencies

```bash
cd backend
npm install
```

### 2. Configure Environment Variables

Create a `.env` file in the backend directory:

```env
MONGODB_URI=your_mongodb_connection_string_here
PORT=5000
```

### 3. Start the Server

Development mode (with auto-reload):

```bash
npm run dev
```

Production mode:

```bash
npm start
```

The server will run on `http://localhost:5000`

## API Endpoints

### User Routes

#### Check Username Availability

```
GET /api/misc/check-username/:userName
```

**Response:**

```json
{
  "available": true,
  "message": "Username is available"
}
```

### Todo Routes

#### Get User Todos

```
GET /api/misc/todos/:userName
```

#### Update All Todos

```
PUT /api/misc/todos/:userName
Body: { "todos": [...] }
```

#### Add Todo

```
POST /api/misc/todos/:userName
Body: { "text": "Todo text", "completed": false }
```

#### Delete Todo

```
DELETE /api/misc/todos/:userName/:index
```

#### Toggle Todo

```
PATCH /api/misc/todos/:userName/:index
```

## Username Rules

- Must be 3-20 characters long
- Can only contain: letters, numbers, underscore (\_), and hyphen (-)
- Must be unique across all users

## Database Schema

### Todo Document

```javascript
{
  userName: String (unique, 3-20 chars),
  todos: [
    {
      text: String,
      completed: Boolean
    }
  ],
  lastOpenDate: Date,
  createdAt: Date,
  updatedAt: Date
}
```

## Project Structure

```
backend/
├── controllers/
│   ├── todo/
│   │   └── todo.controller.js    # Todo CRUD operations
│   └── user/
│       └── user.controller.js    # Username validation
├── models/
│   └── todo.model.js             # MongoDB schema
├── routes/
│   └── todo.routes.js            # API routes
├── server.js                     # Express app setup
├── package.json
└── .env                          # Environment variables (create this)
```

## Notes

- Make sure MongoDB is running and accessible
- The frontend expects the backend to be deployed at `https://pingnotes.onrender.com`
- Update the frontend API URL if deploying elsewhere
