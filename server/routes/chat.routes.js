import { Router } from 'express';
import { chatController } from '../controllers/chat.controller.js';
import { getLatestMessages } from '../services/memory/historyService.js';

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

export default router;
