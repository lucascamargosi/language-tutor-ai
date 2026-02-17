import { stremResponse } from '../services/ai/ollama.provider.js';
import { buildContext } from '../services/memory/contextManager.js';
import { buildMessages } from '../services/ai/promptBuilder.js';
import {
  updateUserProfile,
  getUserProfile,
} from '../services/memory/memoryManager.js';
import { saveMessage } from '../services/memory/historyService.js';

export async function chatController(req, res) {
  try {
    const { message, history = [] } = req.body;

    if (!message) {
      return res.status(400).json({ error: 'Message is required' });
    }

    // persistencia (User)
    saveMessage('user', message);

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

    let fullAiResponse = '';
    await stremResponse({
      model: process.env.DEFAULT_MODEL,
      messages: contextMessages,
      onToken: (token) => {
        fullAiResponse += token;
        res.write(token);
      },
    });

    // persistencia (AI)
    saveMessage('assistant', fullAiResponse)

    // Usa o message (que veio do req.body) para o teste
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
