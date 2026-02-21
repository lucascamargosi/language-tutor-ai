import { useEffect, useState } from 'react';
import { ChatProvider } from './context/ChatContext';
import { Conversation } from './components/chat/Conversation';
import { InputArea } from './components/chat/InputArea';
import { ChatHeader } from './components/chat/ChatHeader';
import { ChatSidebar } from './components/chat/ChatSidebar';
import { useConversations } from './hooks/useConversations';

function App() {
  const {
    conversations,
    activeConversationId,
    isLoading,
    fetchConversations,
    createNewConversation,
    deleteConversationById,
    switchConversation,
  } = useConversations();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // carrega conversas ao iniciar (apenas uma vez)
  useEffect(() => {
    fetchConversations();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // se não há conversa ativa, cria uma (apenas após carregar)
  useEffect(() => {
    if (!isLoading && conversations.length === 0 && !activeConversationId) {
      createNewConversation();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [conversations.length, activeConversationId, isLoading]);

  const handleSelectConversation = (conversationId) => {
    switchConversation(conversationId);
    setIsSidebarOpen(false);
  };

  const handleNewChat = async () => {
    const id = await createNewConversation();
    setIsSidebarOpen(false);
    return id;
  };

  return (
    <ChatProvider
      conversationId={activeConversationId}
      onConversationUpdate={fetchConversations}
    >
      <div className="flex h-[100dvh] bg-slate-100 relative overflow-hidden">
        {isSidebarOpen && (
          <div
            className="fixed inset-0 bg-black/40 z-20 md:hidden"
            onClick={() => setIsSidebarOpen(false)}
          />
        )}
        {/* Sidebar */}
        <ChatSidebar
          conversations={conversations}
          activeConversationId={activeConversationId}
          onSelectConversation={handleSelectConversation}
          onNewChat={handleNewChat}
          onDeleteConversation={deleteConversationById}
          isOpen={isSidebarOpen}
          onClose={() => setIsSidebarOpen(false)}
        />

        {/* Main Chat Area */}
        <div className="flex-1 flex flex-col min-w-0">
          <ChatHeader
            onToggleSidebar={() => setIsSidebarOpen((open) => !open)}
          />

          <main className="flex-1 overflow-hidden flex flex-col relative min-w-0">
            {activeConversationId && (
              <Conversation key={activeConversationId} />
            )}
          </main>

          <footer className="bg-white border-t border-slate-200 p-4 shrink-0">
            <div className="max-w-4xl mx-auto">
              {activeConversationId && <InputArea key={activeConversationId} />}
            </div>
          </footer>
        </div>
      </div>
    </ChatProvider>
  );
}

export default App;
