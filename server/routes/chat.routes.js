import { Router } from 'express';
import { chatController } from '../controllers/chat.controller.js';
import { getLatestMessages } from '../services/memory/historyService.js';
import db from '../database/db.js';

const router = Router();

router.post('/chat', chatController);

router.get('/history', (req, res) => {
  try {
    const history = getLatestMessages(20); // busca as 20 ultimas mensagens
    res.json(history);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch history' });
  }
});

// rota para deletar o histórico
router.delete('/history', (req, res) => {
  try {
    db.prepare('DELETE FROM messages').run();
    res.json({ message: 'History cleared!' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to clear history' });
  }
});

export default router;
