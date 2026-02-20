import { useState } from 'react';

export function ChatSidebar({
  conversations,
  activeConversationId,
  onSelectConversation,
  onNewChat,
  onDeleteConversation,
  isOpen,
  onClose,
}) {
  const [hoveredId, setHoveredId] = useState(null);

  const handleDeleteClick = (e, conversationId) => {
    e.stopPropagation();
    if (window.confirm('Tem certeza que deseja deletar este chat?')) {
      onDeleteConversation(conversationId);
    }
  };

  // formata data relativa (hoje, ontem, etc)
  const formatRelativeDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInDays = Math.floor((now - date) / (1000 * 60 * 60 * 24));

    if (diffInDays === 0) return 'Hoje';
    if (diffInDays === 1) return 'Ontem';
    if (diffInDays < 7) return `${diffInDays} dias atrás`;
    return date.toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' });
  };

  return (
    <aside
      className={`fixed inset-y-0 left-0 z-30 w-72 bg-slate-900 text-white flex flex-col border-r border-slate-700 shrink-0 transform transition-transform duration-200 md:static md:translate-x-0 md:w-64 ${
        isOpen ? 'translate-x-0' : '-translate-x-full'
      }`}
    >
      {/* Header */}
      <div className="p-4 border-b border-slate-700 flex items-center gap-3">
        <button
          onClick={onClose}
          className="md:hidden text-slate-300 hover:text-white"
          aria-label="Close sidebar"
        >
          <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>
        <button
          onClick={onNewChat}
          className="flex-1 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-all active:scale-95 cursor-pointer"
        >
          + New Chat
        </button>
      </div>

      {/* Lista de Conversas */}
      <nav className="flex-1 overflow-y-auto p-2">
        {conversations.length === 0 ? (
          <p className="text-slate-400 text-sm p-4 text-center">
            Clique em "New Chat" para começar
          </p>
        ) : (
          <ul className="space-y-1">
            {conversations
              .filter((c) => c && c.id)
              .map((conversation) => (
                <li key={conversation.id}>
                  <div
                    onClick={() => onSelectConversation(conversation.id)}
                    onMouseEnter={() => setHoveredId(conversation.id)}
                    onMouseLeave={() => setHoveredId(null)}
                    className={`w-full text-left px-3 py-2.5 rounded-lg transition-all flex flex-col group cursor-pointer ${
                      activeConversationId === conversation.id
                        ? 'bg-blue-600 text-white'
                        : 'hover:bg-slate-800 text-slate-300'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <span className="truncate flex-1 text-sm font-medium leading-tight">
                        {conversation.title || 'New Chat'}
                      </span>

                      {/* Botão deletar aparece no hover */}
                      {hoveredId === conversation.id && (
                        <button
                          onClick={(e) => handleDeleteClick(e, conversation.id)}
                          className="flex-shrink-0 p-1 hover:bg-red-600 rounded transition-all"
                          title="Deletar chat"
                        >
                          <svg
                            className="w-4 h-4"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M6 18L18 6M6 6l12 12"
                            />
                          </svg>
                        </button>
                      )}
                    </div>

                    {/* Data/hora da última atualização */}
                    <span
                      className={`text-xs mt-1 ${
                        activeConversationId === conversation.id
                          ? 'text-blue-200'
                          : 'text-slate-500'
                      }`}
                    >
                      {formatRelativeDate(conversation.updated_at)}
                    </span>
                  </div>
                </li>
              ))}
          </ul>
        )}
      </nav>

      {/* Footer */}
      <div className="border-t border-slate-700 p-4 text-xs text-slate-400">
        <p>Language Tutor AI</p>
        <p className="text-slate-500 mt-1">{conversations.length} conversas</p>
      </div>
    </aside>
  );
}
