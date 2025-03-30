const express = require('express');
const router = express.Router();
const passport = require('passport');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Register route
router.post('/signup', async (req, res) => {
  try {
    const { email, password, name } = req.body;
    
    console.log('Received signup request for:', email);

    // Validate input
    if (!email || !password) {
      console.log('Missing required fields');
      return res.status(400).json({ message: 'Email and password are required' });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      console.log('User already exists:', email);
      return res.status(400).json({ message: 'Email already registered' });
    }

    // Create new user
    const user = new User({
      email,
      password,
      name: name || ''
    });

    console.log('Attempting to save user...');
    await user.save();
    console.log('User saved successfully');

    // Create JWT token
    const token = jwt.sign(
      { id: user._id },
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: '1d' }
    );

    console.log('JWT token created successfully');

    res.status(201).json({
      message: 'User registered successfully',
      token,
      user: {
        id: user._id,
        email: user.email,
        name: user.name
      }
    });
  } catch (error) {
    console.error('Signup error:', {
      message: error.message,
      stack: error.stack,
      name: error.name
    });

    // Check for specific error types
    if (error.name === 'ValidationError') {
      return res.status(400).json({ 
        message: 'Validation error', 
        errors: Object.values(error.errors).map(err => err.message)
      });
    }

    if (error.name === 'MongoError' || error.name === 'MongoServerError') {
      return res.status(500).json({ 
        message: 'Database error', 
        error: 'Error connecting to database'
      });
    }

    res.status(500).json({ 
      message: 'Error registering user', 
      error: error.message 
    });
  }
});

// Login route
router.post('/login', (req, res, next) => {
  passport.authenticate('local', { session: false }, (err, user, info) => {
    if (err) {
      return res.status(500).json({ message: 'Error during login', error: err.message });
    }

    if (!user) {
      return res.status(401).json({ message: info.message });
    }

    // Create JWT token
    const token = jwt.sign(
      { id: user._id },
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: '1d' }
    );

    res.json({
      message: 'Login successful',
      token,
      user: {
        id: user._id,
        email: user.email,
        name: user.name
      }
    });
  })(req, res, next);
});

// Protected route example
router.get('/profile', passport.authenticate('jwt', { session: false }), (req, res) => {
  res.json({
    user: {
      id: req.user._id,
      email: req.user.email,
      name: req.user.name
    }
  });
});

module.exports = router; 