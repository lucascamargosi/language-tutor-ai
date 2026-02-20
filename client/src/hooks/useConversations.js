import { useState, useCallback } from 'react';

export function useConversations() {
  const [conversations, setConversations] = useState([]);
  const [activeConversationId, setActiveConversationId] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // busca todas as conversas
  const fetchConversations = useCallback(async () => {
    try {
      setIsLoading(true);
      const response = await fetch('/api/conversations');
      const data = await response.json();
      setConversations(data);

      // define como ativa a mais recente se não houver nenhuma ativa
      setActiveConversationId((currentId) => {
        if (data.length > 0 && !currentId) {
          return data[0].id;
        }
        return currentId;
      });
    } catch (error) {
      console.error('Erro ao buscar conversas:', error);
    } finally {
      setIsLoading(false);
    }
  }, []); // sem dependências - usa functional update

  // cria nova conversa
  const createNewConversation = useCallback(async (title = null) => {
    try {
      // se title for um evento (objeto com target), ignore
      const actualTitle =
        title && typeof title === 'string' ? title : 'New Chat';

      console.log('[Client] Criando nova conversa...');
      const response = await fetch('/api/conversations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title: actualTitle }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error(
          '[Client Error] Resposta não OK:',
          response.status,
          errorData,
        );
        return null;
      }

      const newConversation = await response.json();
      console.log('[Client] Conversa recebida:', newConversation);

      if (!newConversation || !newConversation.id) {
        console.error(
          '[Client Error] Conversa inválida recebida:',
          newConversation,
        );
        return null;
      }

      // adiciona à lista e torna ativa
      setConversations((prev) => [newConversation, ...prev]);
      setActiveConversationId(newConversation.id);

      return newConversation.id;
    } catch (error) {
      console.error('[Client Error] Erro ao criar conversa:', error);
      return null;
    }
  }, []);

  // renomeia uma conversa
  const renameConversationById = useCallback(
    async (conversationId, newTitle) => {
      try {
        await fetch(`/api/conversations/${conversationId}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ title: newTitle }),
        });

        // atualiza na lista
        setConversations((prev) =>
          prev.map((conv) =>
            conv.id === conversationId ? { ...conv, title: newTitle } : conv,
          ),
        );
      } catch (error) {
        console.error('Erro ao renomear conversa:', error);
      }
    },
    [],
  );

  // deleta uma conversa
  const deleteConversationById = useCallback(
    async (conversationId) => {
      try {
        await fetch(`/api/conversations/${conversationId}`, {
          method: 'DELETE',
        });

        // remove da lista
        const updatedConversations = conversations.filter(
          (conv) => conv.id !== conversationId,
        );
        setConversations(updatedConversations);

        // se era a ativa, torna ativa a próxima
        if (activeConversationId === conversationId) {
          setActiveConversationId(
            updatedConversations.length > 0 ? updatedConversations[0].id : null,
          );
        }
      } catch (error) {
        console.error('Erro ao deletar conversa:', error);
      }
    },
    [conversations, activeConversationId],
  );

  // alterna para outra conversa
  const switchConversation = useCallback((conversationId) => {
    setActiveConversationId(conversationId);
  }, []);

  return {
    conversations,
    activeConversationId,
    isLoading,
    fetchConversations,
    createNewConversation,
    deleteConversationById,
    switchConversation,
    renameConversationById,
  };
}
