import { ChatProvider } from './context/ChatContext';
import { Conversation } from './components/chat/Conversation';
import { InputArea } from './components/chat/InputArea';

function App() {
  return (
    <ChatProvider>
      <div className="flex flex-col h-screen bg-slate-100">
        <header className="h-16 bg-brand-dark border-b border-white/10 flex items-center px-6 shadow-lg z-10 shrink-0">
          <h1 className="text-xl font-bold text-white tracking-tight">
            Language <span className="text-blue-400">Tutor</span> AI
          </h1>
          <div className="ml-auto px-3 py-1 bg-white/10 text-blue-200 rounded-full text-xs font-medium border border-white/20">
            A2 Level • English
          </div>
        </header>

        <main className="flex-1 overflow-hidden flex flex-col relative">
          <Conversation />
        </main>

        <footer className="bg-white border-t border-slate-200 p-4 shrink-0">
          <div className="max-w-4xl mx-auto">
            <InputArea />
          </div>
        </footer>
      </div>
    </ChatProvider>
  );
}

export default App;
