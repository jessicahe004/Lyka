import React, { useState } from 'react';
import axios from 'axios';

interface Message {
  text: string;
  sender: 'user' | 'bot';
}

const Chatbot: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [userInput, setUserInput] = useState<string>('');

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUserInput(e.target.value);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!userInput.trim()) return;

    setMessages([...messages, { text: userInput, sender: 'user' }]);
    setUserInput('');

    try {
      const response = await axios.post('http://localhost:8000/api/recommendations', { query: userInput });
      const botResponse = response.data.recommendation; // Adjust based on actual API response structure
      setMessages([...messages, { text: userInput, sender: 'user' }, { text: botResponse, sender: 'bot' }]);
    } catch (error) {
      console.error('Error fetching recommendations:', error);
      setMessages([...messages, { text: userInput, sender: 'user' }, { text: 'Sorry, something went wrong.', sender: 'bot' }]);
    }
  };

  return (
    <div style={{ width: '400px', margin: '0 auto', padding: '20px', border: '1px solid #ccc', borderRadius: '5px' }}>
      <h2>Chatbot</h2>
      <div style={{ height: '300px', overflowY: 'scroll', marginBottom: '10px', border: '1px solid #ccc', padding: '10px', borderRadius: '5px' }}>
        {messages.map((message, index) => (
          <div key={index} style={{ textAlign: message.sender === 'bot' ? 'left' : 'right', marginBottom: '10px' }}>
            <div style={{ display: 'inline-block', padding: '10px', borderRadius: '5px', backgroundColor: message.sender === 'bot' ? '#f1f1f1' : '#007bff', color: message.sender === 'bot' ? '#000' : '#fff' }}>
              {message.text}
            </div>
          </div>
        ))}
      </div>
      <form onSubmit={handleSubmit} style={{ display: 'flex', gap: '10px' }}>
        <input type="text" value={userInput} onChange={handleInputChange} style={{ flex: '1', padding: '10px' }} />
        <button type="submit" style={{ padding: '10px' }}>Send</button>
      </form>
    </div>
  );
};

export default Chatbot;
