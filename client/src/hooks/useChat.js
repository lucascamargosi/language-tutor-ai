import { useState, useEffect, useCallback } from 'react';

export function useChat() {
  const [messages, setMessages] = useState([]);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(false);

  // useCallback para que a funcão no muda a cada renderizacão
  const fetchProfile = useCallback(async () => {
    try {
      const response = await fetch('/api/profile');
      const data = await response.json();
      setProfile(data);
    } catch (error) {
      console.log('Error fetching profile:', error);
    }
  }, []);

  // carregamento inicial unificado em um único Effect limpo
  useEffect(() => {
    const loadInitialData = async () => {
      await fetchProfile(); // busca o perfil (A2, B2)

      try {
        const response = await fetch('api/history');
        const data = await response.json();
        setMessages(data); // busca mensagens do SQLite
      } catch (error) {
        console.log('Error ao carregar histórico:', error);
      }
    };

    loadInitialData();
  }, [fetchProfile]); // fetchProfile é uma dependência estável

  const sendMessage = async (input) => {
    if (!input.trim() || loading) return;

    // adiciona mensagem do usuário na tela
    setMessages((prev) => [...prev, { role: 'user', content: input }]);
    setLoading(true);

    try {
      const response = await fetch('api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: input }),
      });

      if (!response.ok) {
        throw new Error(`Erro do servidor: ${response.statusText}`);
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder('utf-8');

      // inicializa a bolha da IA vazia
      setMessages((prev) => [...prev, { role: 'assistant', content: '' }]);

      let accumulatedContent = '';

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value);
        accumulatedContent += chunk;

        // atualiza a última mensagem (da IA) com o novo conteúdo acumulado
        setMessages((prev) => {
          const updated = [...prev];
          const lastIndex = updated.length - 1;
          updated[lastIndex] = {
            ...updated[lastIndex],
            content: accumulatedContent,
          };
          return updated;
        });
      }

      // atualiza o perfil após a resposta da IA chegar
      // (detecta erros comuns que foram adicionados ao perfil)
      await fetchProfile();
    } catch (error) {
      console.error('Erro ao enviar mensagem:', error);
      // remove a última mensagem do usuário se houver erro
      setMessages((prev) => prev.slice(0, -1));
    } finally {
      setLoading(false);
    }
  };

  const clearChat = async () => {
    if (!window.confirm('Apagar histórico?')) return;

    try {
      const response = await fetch('/api/history', { method: 'DELETE' });
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
