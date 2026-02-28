/* eslint-disable react-refresh/only-export-components*/
import { createContext, useContext } from 'react';
import { useChat } from '../hooks/useChat.js';

const ChatContext = createContext();

export function ChatProvider({
  children,
  conversationId,
  onConversationUpdate,
}) {
  const chat = useChat(conversationId, onConversationUpdate);

  return (
    <ChatContext.Provider value={{ ...chat, conversationId }}>
      {children}
    </ChatContext.Provider>
  );
}

export function useChatContext() {
  return useContext(ChatContext);
}
