const express = require('express');
const router = express.Router();
const passport = require('passport');
const Score = require('../models/Score');
const User = require('../models/User');

// Save a new score
router.post('/', passport.authenticate('jwt', { session: false }), async (req, res) => {
  try {
    const { category, score, totalQuestions } = req.body;
    const userId = req.user._id;

    console.log('Saving score:', { category, score, totalQuestions, userId });

    const newScore = new Score({
      user: userId,
      category,
      score,
      totalQuestions
    });

    await newScore.save();
    console.log('Score saved successfully');

    res.status(201).json({
      message: 'Score saved successfully',
      score: newScore
    });
  } catch (error) {
    console.error('Error saving score:', error);
    res.status(500).json({
      message: 'Error saving score',
      error: error.message
    });
  }
});

// Get all scores for the logged-in user
router.get('/my-scores', passport.authenticate('jwt', { session: false }), async (req, res) => {
  try {
    console.log('Fetching scores for user:', req.user._id);
    
    const scores = await Score.find({ user: req.user._id })
      .sort({ date: -1 }) // Sort by date, newest first
      .select('category score totalQuestions date'); // Select only needed fields
    
    console.log('Found scores:', scores);
    res.json(scores);
  } catch (error) {
    console.error('Error fetching user scores:', error);
    res.status(500).json({ 
      message: 'Error fetching scores', 
      error: error.message 
    });
  }
});

// Get leaderboard
router.get('/leaderboard', async (req, res) => {
  try {
    console.log('Leaderboard request received');
    
    const leaderboard = await Score.aggregate([
      {
        $group: {
          _id: '$user',
          totalScore: { $sum: '$score' },
          totalQuestions: { $sum: '$totalQuestions' },
          quizCount: { $sum: 1 }
        }
      },
      {
        $lookup: {
          from: 'users',
          localField: '_id',
          foreignField: '_id',
          as: 'userInfo'
        }
      },
      {
        $unwind: {
          path: '$userInfo',
          preserveNullAndEmptyArrays: true
        }
      },
      {
        $project: {
          _id: 1,
          name: { $ifNull: ['$userInfo.name', 'Anonymous'] },
          email: { $ifNull: ['$userInfo.email', 'anonymous@example.com'] },
          totalScore: 1,
          totalQuestions: 1,
          quizCount: 1,
          averageScore: {
            $multiply: [
              { 
                $cond: {
                  if: { $eq: ['$totalQuestions', 0] },
                  then: 0,
                  else: { $divide: ['$totalScore', '$totalQuestions'] }
                }
              },
              100
            ]
          }
        }
      },
      {
        $sort: { averageScore: -1 }
      },
      {
        $limit: 10
      }
    ]);

    console.log('Sending leaderboard data:', leaderboard);
    res.json(leaderboard);
  } catch (error) {
    console.error('Error in leaderboard route:', error);
    res.status(500).json({ 
      message: 'Error fetching leaderboard', 
      error: error.message 
    });
  }
});

module.exports = router; 