# Authentication Setup Guide

## What's New

Your Todo app now has a complete authentication system with:

✅ **User Signup** - Create account with username, full name, and password
✅ **User Login** - Secure login with username and password
✅ **Password Hashing** - Passwords are securely hashed using bcrypt
✅ **JWT Authentication** - Token-based authentication for secure sessions
✅ **Username Validation** - Real-time checking if username is available
✅ **Logout Functionality** - Clear session and return to login screen

## Backend Setup

### 1. Install New Dependencies

```bash
cd backend
npm install bcryptjs jsonwebtoken
```

### 2. Update Your .env File

Add JWT secret to your `.env` file:

```env
MONGODB_URI=your_mongodb_connection_string
PORT=5000
JWT_SECRET=your_super_secret_jwt_key_change_this
```

**Important:** Change the JWT_SECRET to a random, secure string!

### 3. Restart Your Server

```bash
npm run dev
```

## Frontend Changes

The frontend has been updated with:

- **AuthModal Component** - Replaces the old NameModal with login/signup functionality
- **Authentication State** - Manages user session with JWT tokens
- **Logout Feature** - Users can log out (you can add a button in Header component)

## API Endpoints

### Authentication

**Signup**

```
POST /api/misc/auth/signup
Body: { userName, name, password }
```

**Login**

```
POST /api/misc/auth/login
Body: { userName, password }
```

**Verify Token**

```
GET /api/misc/auth/verify
Headers: { Authorization: "Bearer <token>" }
```

## Database Collections

### Users Collection

```javascript
{
  userName: String (unique),
  name: String,
  password: String (hashed),
  createdAt: Date,
  updatedAt: Date
}
```

### Todos Collection

```javascript
{
  userName: String (unique),
  todos: Array,
  lastOpenDate: Date,
  createdAt: Date,
  updatedAt: Date
}
```

## Features

### Signup Flow

1. User enters username (checked for availability)
2. User enters full name
3. User creates password (minimum 6 characters)
4. Password is hashed and user is created
5. Default todos are created for the user
6. JWT token is generated and returned
7. User is logged in automatically

### Login Flow

1. User enters username and password
2. Password is verified against hashed password
3. JWT token is generated and returned
4. User's todos are loaded

### Security Features

- Passwords are never stored in plain text
- Passwords are hashed using bcrypt with salt
- JWT tokens expire after 7 days
- Username validation prevents duplicates
- Input validation on both frontend and backend

## Adding Logout Button

To add a logout button, update your Header component:

```tsx
// In Header.tsx
interface HeaderProps {
  userName: string;
  showWelcome: boolean;
  onLogout?: () => void; // Add this
}

// Then add a logout button in the JSX
{
  userName && onLogout && (
    <button onClick={onLogout} className="logout-btn">
      Logout
    </button>
  );
}
```

And pass the handler from App.tsx:

```tsx
<Header
  userName={userFullName || userName}
  showWelcome={showWelcome}
  onLogout={handleLogout}
/>
```

## Testing

1. **Signup**: Create a new account with username, name, and password
2. **Login**: Try logging in with wrong credentials (should fail)
3. **Login**: Login with correct credentials (should work)
4. **Session**: Refresh the page (should stay logged in)
5. **Logout**: Clear localStorage and refresh (should show login screen)

## Next Steps

Consider adding:

- Password reset functionality
- Email verification
- Profile settings
- Password strength indicator
- Remember me option
- Session expiry notification
