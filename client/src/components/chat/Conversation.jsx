import { useChatContext } from '../../context/ChatContext';
import { useEffect, useMemo, useRef } from 'react';
import { Message } from './Message';

const EMPTY_MESSAGES = [
  'Welcome! Shall we practice or translate something',
  'Ready to practice? Vamos treinar sua fluidez hoje.',
  'Como posso ajudar com seus estudos hoje?',
];

const PAGE_SEED = Math.floor(Math.random() * EMPTY_MESSAGES.length);

function getStringHash(value) {
  return String(value)
    .split('')
    .reduce((total, char) => total + char.charCodeAt(0), 0);
}

export function Conversation() {
  const { messages, conversationId } = useChatContext();
  const bottomRef = useRef(null);
  const visibleMessages = messages.filter((msg) => msg.role !== 'system');
  const hasMessages = visibleMessages.length > 0;
  const emptyStateMessage = useMemo(() => {
    const hash = getStringHash(conversationId || 'default');
    const messageIndex = (hash + PAGE_SEED) % EMPTY_MESSAGES.length;
    return EMPTY_MESSAGES[messageIndex];
  }, [conversationId]);

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
              {emptyStateMessage}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
