import { useChatContext } from '../../context/ChatContext';

export function ChatHeader() {
  const { clearChat, messages, profile } = useChatContext();

  const handleClear = () => {
    if (
      window.confirm('Are you sure you want to clear the entire chat history?')
    ) {
      clearChat();
    }
  };

  return (
    <header className="h-16 bg-brand-dark border-b border-white/10 flex items-center px-6 shadow-lg z-10 shrink-0">
      <h1 className="text-xl font-bold text-white tracking-tight">
        Language <span className="text-blue-400">Tutor</span> AI
      </h1>

      <div className="ml-auto flex items-center gap-4">
        {/* Badge Dinâmica: Se o profile existir, mostra o nível do usuário */}
        {profile && (
          <div className="px-3 py-1 bg-white/10 text-blue-200 rounded-full text-xs font-medium border border-white/20 uppercase">
            {profile.level} Level • {profile.preferred_language}
          </div>
        )}
        
        {/* Botão de Clear Conversation - Só aparece se houver mensagens */}
        {messages.length > 0 && (
          <button
            onClick={handleClear}
            className="bg-red-600 hover:bg-red-700 text-white px-3 py-1.5 rounded-lg text-xs font-bold tracking-wide shadow-sm transition-all active:scale-95 cursor-pointer whitespace-nowrap"
          >
            Clear Chat
          </button>
        )}
      </div>
    </header>
  );
}
