# 📝 Todo App - Full Stack Task Management

A modern, feature-rich todo application built with React, TypeScript, Node.js, Express, and MongoDB. Stay organized and boost your productivity with a beautiful, dark-mode interface and secure user authentication.

## 🌐 Live Demo

**Try it now:** [todo.csdiv.tech](https://todo.csdiv.tech)

## ✨ Features

### 🔐 Authentication System

- **Secure Signup & Login** - Create an account with username, name, and password
- **JWT Authentication** - Token-based secure sessions
- **Password Hashing** - Bcrypt encryption for maximum security
- **Real-time Username Validation** - Check username availability instantly
- **Persistent Sessions** - Stay logged in across browser sessions

### ✅ Todo Management

- **Create Todos** - Add new tasks with a single click
- **Mark Complete** - Toggle completion status
- **Edit Todos** - Update existing tasks
- **Delete Todos** - Remove completed or unwanted tasks
- **Daily Reset** - All tasks automatically reset at midnight
- **Persistent Storage** - Data synced to cloud database

### 🎨 User Experience

- **Dark Mode** - Easy on the eyes, always enabled
- **Responsive Design** - Works perfectly on all devices
- **Smooth Animations** - Delightful welcome animations
- **Real-time Updates** - Instant feedback on all actions
- **Optimistic UI** - Fast, lag-free experience

### ☁️ Cloud Features

- **MongoDB Atlas** - Reliable cloud database
- **User-specific Data** - Each user has their own todo list
- **Automatic Backup** - Your data is always safe
- **Cross-device Sync** - Access your todos from anywhere

## 🚀 Tech Stack

### Frontend

- **React 18** - Modern UI library
- **TypeScript** - Type-safe development
- **Vite** - Lightning-fast build tool
- **CSS3** - Custom styling with animations

### Backend

- **Node.js** - JavaScript runtime
- **Express.js** - Web application framework
- **MongoDB** - NoSQL database
- **Mongoose** - Elegant MongoDB object modeling

### Security

- **bcryptjs** - Password hashing
- **jsonwebtoken** - JWT authentication
- **CORS** - Cross-origin resource sharing

### Deployment

- **Vercel** - Frontend & serverless functions
- **MongoDB Atlas** - Cloud database

## 📦 Installation

### Prerequisites

- Node.js (v16 or higher)
- MongoDB (local) or MongoDB Atlas account
- npm or yarn

### Clone Repository

```bash
git clone https://github.com/yourusername/todo-app.git
cd todo-app
```

### Frontend Setup

```bash
# Install dependencies
npm install

# Start development server
npm run dev
```

### Backend Setup

```bash
# Navigate to backend
cd backend

# Install dependencies
npm install

# Create .env file
echo "MONGODB_URI=your_mongodb_connection_string" > .env
echo "PORT=5000" >> .env
echo "JWT_SECRET=your_secret_key_here" >> .env

# Start backend server
npm run dev
```

The app will be available at:

- Frontend: `http://localhost:5173`
- Backend: `http://localhost:5000`

## 🔧 Configuration

### Environment Variables

Create a `.env` file in the `backend` directory:

```env
MONGODB_URI=mongodb://localhost:27017/todoapp
# Or use MongoDB Atlas:
# MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/todoapp

PORT=5000
JWT_SECRET=your_super_secret_random_string_change_this
# Optional: comma-separated list of allowed frontends for CORS
# CORS_ORIGINS=https://your-frontend.com,http://localhost:5173
```

For the frontend, add a `.env` or `.env.production` (depending on your host) in `frontend/`:

```env
# Point the SPA at your deployed API
VITE_API_BASE_URL=https://your-backend.example.com/api
```

## 📁 Project Structure

```
todo-app/
├── api/                      # Vercel serverless functions
│   └── index.js             # API handler
├── backend/                 # Backend source code
│   ├── controllers/         # Request handlers
│   │   ├── auth/           # Authentication logic
│   │   ├── todo/           # Todo CRUD operations
│   │   └── user/           # User management
│   ├── models/             # Database schemas
│   │   ├── todo.model.js   # Todo schema
│   │   └── user.model.js   # User schema
│   ├── routes/             # API routes
│   │   └── todo.routes.js  # All routes
│   ├── server.js           # Express server
│   └── package.json        # Backend dependencies
├── src/                    # Frontend source code
│   ├── components/         # React components
│   │   ├── AuthModal.tsx   # Login/Signup modal
│   │   ├── Header.tsx      # Header with greeting
│   │   ├── TodoCard.tsx    # Individual todo item
│   │   ├── TodoInput.tsx   # Input for new todos
│   │   └── TodoList.tsx    # List of all todos
│   ├── config/            # Configuration
│   │   └── api.ts         # API endpoints
│   ├── App.tsx            # Main app component
│   ├── main.tsx           # App entry point
│   └── index.css          # Global styles
├── vercel.json            # Vercel configuration
├── package.json           # Frontend dependencies
└── README.md              # This file
```

## 🔐 API Endpoints

### Authentication

```
POST   /api/misc/auth/signup      - Create new account
POST   /api/misc/auth/login       - Login to account
GET    /api/misc/auth/verify      - Verify JWT token
```

### User Management

```
GET    /api/misc/check-username/:userName  - Check username availability
```

### Todo Operations

```
GET    /api/misc/todos/:userName           - Get all user todos
POST   /api/misc/todos/:userName           - Create new todo
PUT    /api/misc/todos/:userName           - Update all todos
PATCH  /api/misc/todos/:userName/:index    - Toggle todo completion
DELETE /api/misc/todos/:userName/:index    - Delete a todo
```

## 🎯 Usage

### Creating an Account

1. Open the app at [todo.csdiv.tech](https://todo.csdiv.tech)
2. Click "Sign Up" (default view)
3. Enter a unique username (3-20 characters)
4. Enter your full name
5. Create a password (minimum 6 characters)
6. Click "Sign Up"

### Managing Todos

1. Type your task in the input field
2. Press Enter or click the "+" button
3. Click the checkbox to mark as complete
4. Click the edit icon to modify
5. Click the trash icon to delete

### Logging Out

- Clear your browser's localStorage
- Or close the browser (will need to login again)

## 🌟 Key Features Explained

### Daily Reset

All todos automatically reset to incomplete status at midnight. This is perfect for recurring daily tasks like:

- Morning routine items
- Daily goals
- Habit tracking

### Real-time Username Check

When signing up, the system instantly checks if your desired username is available, providing immediate feedback with visual indicators (✓ or ✗).

### Optimistic Updates

All todo operations update the UI immediately, then sync with the server in the background. This ensures a smooth, responsive experience even on slower connections.

## 🚢 Deployment

### Deploy to Vercel

1. Push your code to GitHub
2. Go to [vercel.com](https://vercel.com)
3. Import your repository
4. Add environment variables:
   - `MONGODB_URI`
   - `JWT_SECRET`
5. Deploy!

For detailed instructions, see [VERCEL_DEPLOYMENT.md](VERCEL_DEPLOYMENT.md)

### Custom Domain Setup

To use your own domain (like todo.csdiv.tech):

1. Go to Vercel Dashboard → Your Project → Settings → Domains
2. Add your custom domain
3. Update DNS records as instructed by Vercel

## 🛠️ Development

### Available Scripts

**Frontend:**

```bash
npm run dev      # Start development server
npm run build    # Build for production
npm run preview  # Preview production build
npm run lint     # Run ESLint
```

**Backend:**

```bash
npm start        # Start production server
npm run dev      # Start with nodemon (auto-reload)
```

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is open source and available under the [MIT License](LICENSE).

## 👨‍💻 Author

**csdiv**

- Website: [csdiv.tech](https://csdiv.tech)
- Todo App: [todo.csdiv.tech](https://todo.csdiv.tech)

## 🙏 Acknowledgments

- Font Awesome for icons
- MongoDB for database solutions
- Vercel for hosting
- React community for amazing tools

## 📞 Support

If you encounter any issues or have questions:

- Open an issue on GitHub
- Check the [VERCEL_DEPLOYMENT.md](VERCEL_DEPLOYMENT.md) guide
- Review the [AUTH_SETUP.md](AUTH_SETUP.md) for authentication details

---

**Built with ❤️ using React, Node.js, and MongoDB**

[🌐 Visit Todo App](https://todo.csdiv.tech) | [📚 Documentation](VERCEL_DEPLOYMENT.md) | [🔐 Auth Guide](AUTH_SETUP.md)
