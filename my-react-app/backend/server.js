require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const passport = require('./config/passport');
const authRoutes = require('./routes/auth');
const scoreRoutes = require('./routes/scores');

const app = express();

// CORS configuration
const allowedOrigins = [
  'https://arogyasharma.github.io',
  'http://localhost:5173',
  'https://verbally-measured-basilisk.ngrok-free.app',
  'https://arogyasharma.github.io/web-project',
  'http://localhost:4173',  // Vite preview
  'http://localhost:3000'   // Common React development port
];

// Apply CORS middleware with a more permissive configuration
app.use(cors({
  origin: '*',  // Allow all origins temporarily
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'Accept', 'Origin', 'X-Requested-With']
}));

// Handle preflight requests
app.options('*', cors());

// Additional headers middleware
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
  
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }
  next();
});

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(passport.initialize());

// Connect to MongoDB with better error handling
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/quiz-app', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => {
  console.log('Connected to MongoDB successfully');
})
.catch((err) => {
  console.error('MongoDB connection error:', err);
  process.exit(1); // Exit if cannot connect to database
});

// Additional error handling for MongoDB connection
mongoose.connection.on('error', (err) => {
  console.error('MongoDB connection error:', err);
});

mongoose.connection.on('disconnected', () => {
  console.log('MongoDB disconnected');
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/scores', scoreRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(err.status || 500).json({
    message: err.message || 'Something went wrong!',
    error: process.env.NODE_ENV === 'development' ? err : {}
  });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server is running on port ${PORT}`);
}); 