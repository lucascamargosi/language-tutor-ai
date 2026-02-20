import { streamResponse } from '../services/ai/ollama.provider.js';
import { getSmartContext } from '../services/memory/contextManager.js';
import { buildMessages } from '../services/ai/promptBuilder.js';
import {
  updateUserProfile,
  getUserProfile,
} from '../services/memory/memoryManager.js';
import {
  saveMessage,
  getLatestMessages,
  generateConversationTitle,
  renameConversation,
  countMessagesInConversation,
} from '../services/memory/historyService.js';
import { detectErrorPatterns } from '../services/memory/errorPatterns.js';

export async function chatController(req, res) {
  try {
    const { message, conversationId } = req.body;

    if (!message) {
      return res.status(400).json({ error: 'Message is required' });
    }

    // persistencia imediata (User)
    saveMessage('user', message, conversationId);

    // se for a primeira mensagem do usuário (contando só mensagens 'user'), gera título automaticamente
    const messageCount = countMessagesInConversation(conversationId);
    if (messageCount === 1) {
      // é a primeira mensagem (acabamos de salvar)
      const autoTitle = generateConversationTitle(message);
      renameConversation(conversationId, autoTitle);
    }

    // obtém o contexto inteligente (Já filtrado por tokens e vindo do SQLite)
    const contextMessages = getSmartContext(message, conversationId);

    // configuração de streaming
    res.setHeader('Content-Type', 'text/plain; charset=utf-8');
    res.setHeader('Transfer-Encoding', 'chunked');

    let fullAiResponse = '';
    await streamResponse({
      model: process.env.DEFAULT_MODEL,
      messages: contextMessages,
      onToken: (token) => {
        fullAiResponse += token;
        res.write(token);
      },
    });

    // persistência da resposta (AI)
    saveMessage('assistant', fullAiResponse, conversationId);

    // Inteligencia Adaptativa: detecta erros comuns e atualiza perfil
    const detectedErrors = detectErrorPatterns(message);
    if (detectedErrors.length > 0) {
      const profile = getUserProfile();
      const currentMistakes = profile.common_mistakes || [];

      // adiciona novos erros ao perfil (evita duplicação)
      const newMistakes = currentMistakes;
      let updated = false;

      for (const error of detectedErrors) {
        if (!newMistakes.includes(error)) {
          newMistakes.push(error);
          updated = true;
          console.log(`[AI Tutor] Erro detectado: ${error}`);
        }
      }

      if (updated) {
        updateUserProfile({
          common_mistakes: newMistakes,
        });
      }
    }

    res.end(); // finaliza requisição
  } catch (error) {
    console.log(error);
    res.status(500).end();
  }
}
