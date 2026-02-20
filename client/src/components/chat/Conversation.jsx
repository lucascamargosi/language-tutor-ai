import { useChatContext } from '../../context/ChatContext';
import { useEffect, useRef } from 'react';
import { Message } from './Message';

export function Conversation() {
  const { messages } = useChatContext();
  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  return (
    <div className="flex-1 overflow-y-auto p-4 md:p-6 bg-slate-50 min-w-0">
      <div className="max-w-4xl mx-auto flex flex-col gap-6">
        {messages.map((msg) => {
          if (msg.role === 'system') return null;
          return <Message key={msg.id} role={msg.role} content={msg.content} />;
        })}
        <div ref={bottomRef} />
      </div>
    </div>
  );
}
