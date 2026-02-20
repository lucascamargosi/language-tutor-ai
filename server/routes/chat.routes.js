import { Router } from 'express';
import { chatController } from '../controllers/chat.controller.js';
import {
  getLatestMessages,
  deleteConversationMessages,
  getAllConversations,
  createConversation,
  deleteConversation,
  renameConversation,
  generateConversationTitle,
} from '../services/memory/historyService.js';
import { getUserProfile } from '../services/memory/memoryManager.js';

const router = Router();

// rota de chat (envia e recebe mensagem)
router.post('/chat', chatController);

// rota para listar todas as conversas
router.get('/conversations', (req, res) => {
  try {
    const conversations = getAllConversations();
    res.json(conversations);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch conversations' });
  }
});

// rota para criar nova conversa
router.post('/conversations', (req, res) => {
  try {
    const { title } = req.body;
    const conversation = createConversation(title);

    if (!conversation) {
      console.error('[API Error] createConversation retornou null');
      return res
        .status(500)
        .json({ error: 'Failed to create conversation - database error' });
    }

    console.log('[API Success] Conversa criada:', conversation);
    res.json(conversation);
  } catch (error) {
    console.error('[API Error] Erro ao criar conversa:', error);
    res
      .status(500)
      .json({ error: 'Failed to create conversation', details: error.message });
  }
});

// rota para renomear uma conversa
router.patch('/conversations/:id', (req, res) => {
  try {
    const { id } = req.params;
    const { title } = req.body;
    renameConversation(parseInt(id), title);
    res.json({ id: parseInt(id), title });
  } catch (error) {
    res.status(500).json({ error: 'Failed to rename conversation' });
  }
});

// rota para deletar uma conversa
router.delete('/conversations/:id', (req, res) => {
  try {
    const { id } = req.params;
    deleteConversation(parseInt(id));
    res.json({ message: 'Conversation deleted' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete conversation' });
  }
});

// rota para obter histórico de uma conversa específica
router.get('/conversations/:id/history', (req, res) => {
  try {
    const { id } = req.params;
    const history = getLatestMessages(50, parseInt(id));
    res.json(history);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch conversation history' });
  }
});

// rota para deletar histórico de uma conversa específica
router.delete('/conversations/:id/history', (req, res) => {
  try {
    const { id } = req.params;
    deleteConversationMessages(parseInt(id));
    res.json({ message: 'Conversation history cleared' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to clear conversation history' });
  }
});

// rota legada para obter histórico (usa conversa ativa)
router.get('/history', (req, res) => {
  try {
    const history = getLatestMessages(20);
    res.json(history);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch history' });
  }
});

// rota legada para deletar histórico (usa conversa ativa)
router.delete('/history', (req, res) => {
  try {
    deleteConversationMessages();
    res.json({ message: 'History cleared!' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to clear history' });
  }
});

// rota para o perfil do usuário
router.get('/profile', (req, res) => {
  try {
    const profile = getUserProfile();
    res.json(profile);
  } catch (error) {
    res.status(500).json({ error: 'Failed to load profile' });
  }
});

export default router;
