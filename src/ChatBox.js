import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';

const apiKey = process.env.REACT_APP_API_KEY;
const HOST = window.location.origin.split(':')[0] + ':' + window.location.origin.split(':')[1];
const API_PORT = process.env.REACT_APP_API_PORT || 4001;

console.log('API URL:', `${HOST}:${API_PORT}/api/chat`);
const ChatBox = () => {
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim()) return;
    setInput('');
    try {
      setIsLoading(true);
      setError(null);
      const response = await axios.post(`${HOST}:${API_PORT}/api/chat`, {
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
        <div ref={messagesEndRef} />
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
