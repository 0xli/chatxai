const express = require('express');
const https = require('https');
const fs = require('fs');
const cors = require('cors');
const axios = require('axios');
require('dotenv').config();

const requestLimits = new Map();

const app = express();
app.use(cors());
app.use(express.json());

// SSL configuration
const sslOptions = {
  key: fs.readFileSync(process.env.SSL_KEY_PATH),
  cert: fs.readFileSync(process.env.SSL_CERT_PATH)
};

app.post('/api/chat', async (req, res) => {
  const ip = req.ip;
  const now = new Date();
  const today = now.toDateString();
  
  const userLimit = requestLimits.get(ip) || { count: 0, date: today };
  
  if (userLimit.date !== today) {
    userLimit.count = 0;
    userLimit.date = today;
  }
  
  if (userLimit.count >= 5) {
    return res.status(429).json({ error: 'Daily limit reached (5 messages). Please try again tomorrow.' });
  }
  
  userLimit.count++;
  requestLimits.set(ip, userLimit);

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

const PORT = process.env.PORT || 4001;
https.createServer(sslOptions, app).listen(PORT, '0.0.0.0', () => {
  console.log(`Secure server running on https://0.0.0.0:${PORT}`);
}); 