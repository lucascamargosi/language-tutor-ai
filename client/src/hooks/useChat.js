import { useState, useEffect, useCallback } from 'react';

const createMessage = (role, content) => ({
  id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
  role,
  content,
});

export function useChat(conversationId, onConversationUpdate) {
  const [messages, setMessages] = useState([]);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(false);

  // useCallback para que a função não muda a cada renderização
  const fetchProfile = useCallback(async () => {
    try {
      const response = await fetch('/api/profile');
      const data = await response.json();
      setProfile(data);
    } catch (error) {
      console.log('Error fetching profile:', error);
    }
  }, []);

  // busca histórico da conversa ativa
  const fetchMessages = useCallback(async () => {
    if (!conversationId) return;

    try {
      const response = await fetch(
        `/api/conversations/${conversationId}/history`,
      );
      const data = await response.json();
      const normalized = (data || []).map((msg) => ({
        id: msg.id || `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
        role: msg.role,
        content: msg.content,
      }));
      setMessages(normalized);
    } catch (error) {
      console.log('Error ao carregar histórico:', error);
    }
  }, [conversationId]);

  // carregamento inicial
  useEffect(() => {
    const loadInitialData = async () => {
      await fetchProfile();
      await fetchMessages();
    };

    loadInitialData();
  }, [fetchProfile, fetchMessages]);

  const sendMessage = async (input) => {
    if (!input.trim() || loading || !conversationId) return;

    // adiciona mensagem do usuário na tela
    const userMessage = createMessage('user', input);
    setMessages((prev) => [...prev, userMessage]);
    setLoading(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: input,
          conversationId,
        }),
      });

      if (!response.ok) {
        throw new Error(`Erro do servidor: ${response.statusText}`);
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder('utf-8');

      // inicializa a bolha da IA vazia
      const assistantMessage = createMessage('assistant', '');
      setMessages((prev) => [...prev, assistantMessage]);

      let accumulatedContent = '';

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value);
        accumulatedContent += chunk;

        // atualiza a última mensagem (da IA) com o novo conteúdo acumulado
        setMessages((prev) =>
          prev.map((msg) =>
            msg.id === assistantMessage.id
              ? { ...msg, content: accumulatedContent }
              : msg,
          ),
        );
      }

      // atualiza o perfil após a resposta da IA chegar
      await fetchProfile();

      // notifica que a conversa foi atualizada (para atualizar título se necessário)
      if (onConversationUpdate) {
        onConversationUpdate();
      }
    } catch (error) {
      console.error('Erro ao enviar mensagem:', error);
      // remove a última mensagem do usuário se houver erro
      setMessages((prev) => prev.filter((msg) => msg.id !== userMessage.id));
    } finally {
      setLoading(false);
    }
  };

  const clearChat = async () => {
    if (!window.confirm('Apagar histórico?')) return;

    try {
      const response = await fetch(
        `/api/conversations/${conversationId}/history`,
        {
          method: 'DELETE',
        },
      );
      if (response.ok) setMessages([]); // limpa a tela
    } catch (error) {
      console.log('Erro ao limpar histórico:', error);
    }
  };

  return {
    messages,
    loading,
    sendMessage,
    clearChat,
    profile,
    fetchProfile,
  };
}
