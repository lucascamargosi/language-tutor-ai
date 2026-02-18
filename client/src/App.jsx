import { ChatProvider } from './context/ChatContext';
import { Conversation } from './components/chat/Conversation';
import { InputArea } from './components/chat/InputArea';
import { ChatHeader } from './components/chat/ChatHeader';

function App() {
  return (
    <ChatProvider>
      <div className="flex flex-col h-screen bg-slate-100">
        <ChatHeader /> 

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
