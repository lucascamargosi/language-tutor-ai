import { ChatProvider } from './context/ChatContext';
import { Conversation } from './components/chat/Conversation';
import { InputArea } from './components/chat/InputArea';

function App() {
  return (
    <ChatProvider>
      <div style={{ padding: 20, maxWidth: 800, margin: '0 auto' }}>
        <h1>Language Tutor AI</h1>
        <Conversation />
        <InputArea />
      </div>
    </ChatProvider>
  );
}

export default App;
