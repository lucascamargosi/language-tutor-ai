/* eslint-disable react-refresh/only-export-components*/
import { createContext, useContext } from 'react';
import { useChat } from '../hooks/useChat.js';

const ChatContext = createContext();

export function ChatProvider({ children }) {
  const chat = useChat();

  return <ChatContext.Provider value={chat}>{children}</ChatContext.Provider>;
}

export function useChatContext() {
  return useContext(ChatContext);
}
