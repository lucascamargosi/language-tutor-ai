import { useState, useRef, useEffect } from 'react';
import { useChatContext } from '../../context/ChatContext';

export function InputArea() {
  const [input, setInput] = useState('');
  const { sendMessage, loading } = useChatContext();
  const textareaRef = useRef(null);

  const handleSend = () => {
    sendMessage(input);
    setInput('');
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault(); // impede o 'Enter' de criar nova linha
      handleSend(); // chama funcao do envio
    }
  };

  // Auto-focus no input quando uma conversa é selecionada
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.focus();
    }
  }, []); // executa ao montar (componente é remontado quando conversa muda)

  return (
    <div className="flex items-end gap-3">
      <textarea
        ref={textareaRef}
        id="chat-message"
        name="chat-message"
        rows={1}
        className="flex-1 min-h-[48px] max-h-32 resize-none rounded-xl border border-slate-300 bg-slate-50 px-4 py-3 text-slate-700 focus:border-brand-medium focus:ring-2 focus:ring-brand-medium/10 focus:outline-none transition-all"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="Type your message..."
      />

      <button
        onClick={handleSend}
        disabled={loading || !input.trim()}
        className="h-[48px] px-6 rounded-xl font-bold transition-all active:scale-95 bg-brand-medium text-white hover:bg-brand-light disabled:bg-slate-200 disabled:text-slate-400 disabled:cursor-not-allowed shadow-md"
      >
        {loading ? (
          <div className="flex gap-1">
            <span className="w-1.5 h-1.5 bg-current rounded-full animate-bounce"></span>
            <span className="w-1.5 h-1.5 bg-current rounded-full animate-bounce [animation-delay:0.2s]"></span>
            <span className="w-1.5 h-1.5 bg-current rounded-full animate-bounce [animation-delay:0.4s]"></span>
          </div>
        ) : (
          'Send'
        )}
      </button>
    </div>
  );
}
