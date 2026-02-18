import { useState, useEffect } from 'react';

export function useChat() {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const loadHistory = async () => {
      try {
        const response = await fetch('/api/history');
        const data = await response.json();
        setMessages(data);
      } catch (error) {
        console.error('Erro ao carregar histórico:', error);
      }
    };
    loadHistory();
  }, []);

  const sendMessage = async (input) => {
    if (!input.trim()) return;

    const userMessage = { role: 'user', content: input };
    setMessages((prev) => [...prev, userMessage]);
    setLoading(true);

    const response = await fetch('/api/chat', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        message: input,
      }),
    });

    const reader = response.body.getReader();
    const decoder = new TextDecoder('utf-8');

    let assistantMessage = { role: 'assistant', content: '' };

    setMessages((prev) => [...prev, assistantMessage]);

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      const chunk = decoder.decode(value);
      assistantMessage.content += chunk;

      setMessages((prev) => {
        const updated = [...prev];
        updated[updated.length - 1] = { ...assistantMessage };
        return updated;
      });
    }

    setLoading(false);
  };

  const clearChat = async () => {
    try {
      const response = await fetch('/api/history', { method: 'DELETE' });
      if (response.ok) {
        setMessages([]); // limpa a tela
      }
    } catch (error) {
      console.log('Erro ao limpar histórico:', error);
    }
  };

  return {
    messages,
    loading,
    sendMessage,
    clearChat,
  };
}
