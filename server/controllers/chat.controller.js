import { stremResponse } from '../services/ai/ollama.provider.js';
import { buildContext } from '../services/memory/contextManager.js';

export async function chatController(req, res) {
  try {
    const { message, history = [] } = req.body;

    if (!message) {
      return res.status(400).json({ error: 'Message is required' });
    }

    // monta histórico completo
    const fullConversation = [
      ...history,
      {
        role: 'user',
        content: message,
      },
    ];

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

    res.end();
  } catch (error) {
    console.log(error);
    res.status(500).end();
  }
}
