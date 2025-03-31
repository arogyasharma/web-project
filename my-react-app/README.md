# Quiz Application

A full-stack quiz application built with React and Node.js.

## Prerequisites

- Node.js (v14 or higher)
- MongoDB (v4.4 or higher)
- Git

## Setup Instructions

### 1. Clone the Repository

```bash
git clone <your-repository-url>
cd my-react-app
```

### 2. Backend Setup

```bash
# Navigate to backend directory
cd backend

# Install dependencies
npm install

# Create .env file
echo "MONGODB_URI=mongodb://localhost:27017/quiz-app
JWT_SECRET=your-super-secret-key-change-this-in-production
PORT=5000" > .env

# Start the backend server
npm start
```

### 3. Frontend Setup

```bash
# Navigate to frontend directory (from project root)
cd my-react-app

# Install dependencies
npm install

# Start the development server
npm run dev
```

The frontend will be available at `http://localhost:5173` and the backend at `http://localhost:5000`.

## Environment Variables

### Backend (.env)
- `MONGODB_URI`: MongoDB connection string (default: mongodb://localhost:27017/quiz-app)
- `JWT_SECRET`: Secret key for JWT token generation
- `PORT`: Backend server port (default: 5000)

### Frontend (src/config.js)
- Update API_URL in `src/config.js` to match your backend URL (default: http://localhost:5000)

## Features

- User Authentication (Login/Signup)
- Quiz Categories
- Score Tracking
- Leaderboard
- Personal Score History

## Development

- Frontend: React with Vite
- Backend: Node.js with Express
- Database: MongoDB
- Authentication: JWT with Passport.js

## Common Issues and Solutions

1. CORS Issues:
   - Ensure backend CORS configuration matches frontend origin
   - Check API_URL in frontend config

2. MongoDB Connection:
   - Ensure MongoDB is running locally
   - Check MONGODB_URI in backend .env

3. Authentication Issues:
   - Verify JWT_SECRET is set in backend .env
   - Check token handling in frontend

## Production Deployment

For production:
1. Update API_URL in frontend config to production backend URL
2. Set secure JWT_SECRET in production environment
3. Configure proper MongoDB connection string
4. Enable proper security headers and CORS settings
