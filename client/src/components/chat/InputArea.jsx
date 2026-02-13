import { useState } from 'react';
import { useChatContext } from '../../context/ChatContext';

export function InputArea() {
  const [input, setInput] = useState('');
  const { sendMessage, loading } = useChatContext();

  const handleSend = () => {
    sendMessage(input);
    setInput('');
  };

  return (
    <div>
      <textarea
        rows={3}
        style={{ width: '100%', marginBottom: 10 }}
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder="Type your message..."
      />

      <button onClick={handleSend} disabled={loading}>
        {loading ? 'Thinking...' : 'Send'}
      </button>
    </div>
  );
}
