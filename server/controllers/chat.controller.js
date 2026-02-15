import { stremResponse } from '../services/ai/ollama.provider.js';
import { buildContext } from '../services/memory/contextManager.js';
import { buildMessages } from '../services/ai/promptBuilder.js';
import {
  updateUserProfile,
  getUserProfile,
} from '../services/memory/memoryManager.js';

export async function chatController(req, res) {
  try {
    const { message, history = [] } = req.body;

    if (!message) {
      return res.status(400).json({ error: 'Message is required' });
    }

    // monta histórico completo
    const fullConversation = buildMessages({
      history,
      userMessage: message,
    });

    // aplica sliding window
    const contextMessages = buildContext(fullConversation);

    // configuração dos headers para streaming
    res.setHeader('Content-Type', 'text/plain; charset=utf-8');
    res.setHeader('Transfer-Encoding', 'chunked');

    await stremResponse({
      model: process.env.DEFAULT_MODEL,
      messages: contextMessages,
      onToken: (token) => {
        res.write(token);
      },
    });

    // Usamos o message (que veio do req.body) para o teste
    if (message.toLowerCase().includes('present perfect')) {
      const profile = getUserProfile();
      // Verificamos se o erro já não está lá para não duplicar no array
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
