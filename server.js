const express = require('express');
const cors = require('cors');
const axios = require('axios');
require('dotenv').config();

// Simple in-memory store for rate limiting
const requestCounts = {};

const app = express();
app.use(cors());
app.use(express.json());

// Rate limiting middleware
const rateLimiter = (req, res, next) => {
  const ip = req.ip;
  const now = Date.now();
  const dayStart = new Date().setHours(0,0,0,0);
  
  if (!requestCounts[ip]) {
    requestCounts[ip] = { count: 0, resetTime: dayStart };
  }

  // Reset count if it's a new day
  if (now > requestCounts[ip].resetTime) {
    requestCounts[ip] = { count: 0, resetTime: dayStart };
  }

  if (requestCounts[ip].count >= 5) {
    return res.status(429).json({ error: 'Rate limit exceeded. Try again tomorrow.' });
  }

  requestCounts[ip].count++;
  next();
};

app.post('/api/chat', rateLimiter, async (req, res) => {
  try {
    const response = await axios.post('https://api.x.ai/v1/messages', {
      model: "grok-beta",
      messages: req.body.messages,
      max_tokens: 1000
    }, {
      headers: {
        'Authorization': `Bearer ${process.env.REACT_APP_API_KEY}`,
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      }
    });
    console.log(response.data);
    const messageText = response.data.content[0].text;

    res.json({
      message: messageText
    });
  } catch (error) {
    console.error('Error details:', error.response?.data);
    res.status(error.response?.status || 500).json({
      error: error.response?.data || 'Internal server error'
    });
  }
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
}); 