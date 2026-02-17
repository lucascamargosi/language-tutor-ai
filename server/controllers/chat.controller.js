import { stremResponse } from '../services/ai/ollama.provider.js';
import { getSmartContext } from '../services/memory/contextManager.js';
import { buildMessages } from '../services/ai/promptBuilder.js';
import {
  updateUserProfile,
  getUserProfile,
} from '../services/memory/memoryManager.js';
import { saveMessage } from '../services/memory/historyService.js';

export async function chatController(req, res) {
  try {
    const { message } = req.body; 

    if (!message) {
      return res.status(400).json({ error: 'Message is required' });
    }

    // persistencia imediata (User)
    saveMessage('user', message);

    // obtém o contexto inteligente (Já filtrado por tokens e vindo do SQLite)
    const contextMessages = getSmartContext(message)

    // configuração de streaming
    res.setHeader('Content-Type', 'text/plain; charset=utf-8');
    res.setHeader('Transfer-Encoding', 'chunked');

    let fullAiResponse = '';
    await stremResponse({
      model: process.env.DEFAULT_MODEL,
      messages: contextMessages,
      onToken: (token) => {
        fullAiResponse += token;
        res.write(token);
      },
    });

    // persistência da resposta (AI)
    saveMessage('assistant', fullAiResponse)

    // Inteligencia Adaptativa (ex. do Present Perfect)
    if (message.toLowerCase().includes('present perfect')) {
      const profile = getUserProfile();
      // Verifica se o erro já não está lá para não duplicar no array
      if (profile && !profile.common_mistakes.includes('present perfect')) {
        updateUserProfile({
          common_mistakes: [...profile.common_mistakes, 'present perfect'],
        });
      }
    }

    res.end(); // finaliza requisição
  } catch (error) {
    console.log(error);
    res.status(500).end();
  }
}
