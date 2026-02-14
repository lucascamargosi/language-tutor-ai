import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeHighlight from 'rehype-highlight';
import 'highlight.js/styles/github.css';

import { useChatContext } from '../../context/ChatContext';
import { useEffect, useRef } from 'react';

export function Conversation() {
  const { messages } = useChatContext();

  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  return (
    <div
      style={{
        border: '1px solid #ccc',
        padding: 10,
        height: 400,
        overflowY: 'auto',
        marginBottom: 10,
      }}
    >
      {messages.map((msg, index) => (
        <div key={index} style={{ marginBottom: 8 }}>
          <strong>{msg.role === 'user' ? 'You' : 'AI'}:</strong>
          <ReactMarkdown
            remarkPlugins={[remarkGfm]}
            rehypePlugins={[rehypeHighlight]}
          >
            {msg.content}
          </ReactMarkdown>
        </div>
      ))}
      <div ref={bottomRef} />
    </div>
  );
}
