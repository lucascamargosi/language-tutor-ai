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
    <div className="flex-1 overflow-y-auto p-4 md:p-6 bg-slate-50">
      <div className="max-w-4xl mx-auto flex flex-col gap-6">
        {messages.map((msg, index) => {
          const isAi = msg.role === 'assistant' || msg.role === 'system';
          if (msg.role === 'system') return null;

          return (
            <div
              key={index}
              className={`flex ${isAi ? 'justify-start' : 'justify-end'} animate-in fade-in slide-in-from-bottom-2`}
            >
              <div
                className={`max-w-[85%] md:max-w-[75%] px-4 py-3 rounded-2xl shadow-sm ${
                  isAi
                    ? 'bg-slate-50 text-slate-800 border border-slate-200 rounded-tl-none'
                    : 'bg-brand-medium text-white rounded-tr-none'
                }`}
              >
                <div
                  className={`text-[10px] uppercase tracking-widest font-bold mb-1 ${isAi ? 'text-brand-medium opacity-60' : 'text-blue-200'}`}
                >
                  {isAi ? 'AI Tutor' : 'You'}
                </div>

                <div
                  className={`prose max-w-none break-words ${isAi ? 'prose-slate' : 'prose-invert text-white'}`}
                >
                  <ReactMarkdown
                    remarkPlugins={[remarkGfm]}
                    rehypePlugins={[rehypeHighlight]}
                  >
                    {msg.content}
                  </ReactMarkdown>
                </div>
              </div>
            </div>
          );
        })}
        <div ref={bottomRef} />
      </div>
    </div>
  );
}
