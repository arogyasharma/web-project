const express = require('express');
const router = express.Router();
const passport = require('passport');
const Score = require('../models/Score');
const User = require('../models/User');

// Save a new score
router.post('/', passport.authenticate('jwt', { session: false }), async (req, res) => {
  try {
    const { category, score, totalQuestions } = req.body;
    
    const newScore = new Score({
      user: req.user._id,
      category,
      score,
      totalQuestions
    });

    await newScore.save();
    res.status(201).json(newScore);
  } catch (error) {
    res.status(500).json({ message: 'Error saving score', error: error.message });
  }
});

// Get all scores for the logged-in user
router.get('/my-scores', passport.authenticate('jwt', { session: false }), async (req, res) => {
  try {
    const scores = await Score.find({ user: req.user._id })
      .sort({ date: -1 }); // Sort by date, newest first
    res.json(scores);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching scores', error: error.message });
  }
});

// Get leaderboard
router.get('/leaderboard', async (req, res) => {
  try {
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
        $unwind: '$userInfo'
      },
      {
        $project: {
          _id: 1,
          name: '$userInfo.name',
          email: '$userInfo.email',
          totalScore: 1,
          totalQuestions: 1,
          quizCount: 1,
          averageScore: {
            $multiply: [
              { $divide: ['$totalScore', '$totalQuestions'] },
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

    res.json(leaderboard);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching leaderboard', error: error.message });
  }
});

module.exports = router; 