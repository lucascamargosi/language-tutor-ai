import { useChatContext } from '../../context/ChatContext';
import { useEffect, useRef } from 'react';
import { Message } from './Message';

export function Conversation() {
  const { messages } = useChatContext();
  const bottomRef = useRef(null);
  const visibleMessages = messages.filter((msg) => msg.role !== 'system');
  const hasMessages = visibleMessages.length > 0;

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [visibleMessages]);

  return (
    <div className="flex-1 overflow-y-auto p-4 md:p-6 bg-slate-50 min-w-0">
      {hasMessages ? (
        <div className="max-w-4xl mx-auto flex flex-col gap-6">
          {visibleMessages.map((msg) => (
            <Message key={msg.id} role={msg.role} content={msg.content} />
          ))}
          <div ref={bottomRef} />
        </div>
      ) : (
        <div className="h-full w-full flex items-center justify-center">
          <div className="max-w-2xl text-center px-4">
            <p className="text-slate-700 text-lg md:text-3xl font-medium leading-relaxed">
              Welcome! Shall we practice in English or do you need help with a
              translation?
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
