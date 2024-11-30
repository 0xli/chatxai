import React, { useState } from 'react';
import axios from 'axios';

const apiKey = process.env.REACT_APP_API_KEY;

console.log(apiKey);
const ChatBox = () => {
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSend = async () => {
    if (!input.trim()) return;
    setInput('');
    try {
      setIsLoading(true);
      setError(null);
//      const response = await axios.post('http://localhost:3001/api/chat', {
      const response = await axios.post('/api/chat', {
  messages: [{
          role: "user",
          content: input
        }]
      }, {
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json'
        }
      });
      
      setMessages(prevMessages => [
        ...prevMessages,
        { text: input, sender: 'user' },
        { text: response.data.message, sender: 'ai' }
      ]);
      setInput('');
    } catch (error) {
      console.error('Error sending message:', error);
      setError(error.response?.data?.error || 'Failed to send message');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="chat-container">
      <div className="chat-window">
        {messages.map((msg, index) => (
          <div key={index} className={msg.sender}>
            {msg.text}
          </div>
        ))}
      </div>
      <div className="input-container">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && handleSend()}
        />
        <button onClick={handleSend}>Send</button>
      </div>
      {isLoading && <p>Sending...</p>}
      {error && <p style={{ color: 'red' }}>{error}</p>}
    </div>
  );
};

export default ChatBox;
