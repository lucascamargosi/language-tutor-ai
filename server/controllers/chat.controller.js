import { stremResponse } from '../services/ai/ollama.provider.js';

export async function chatController(req, res) {
  try {
    const { message } = req.body;

    if (!message) {
      return res.status(400).json({ error: 'Message is required' });
    }

    // configuração dos headers para streaming
    res.setHeader('Content-Type', 'text/plain; charset=utf-8');
    res.setHeader('Transfer-Encoding', 'chunked');

    const messages = [
      {
        role: 'user',
        content: message,
      },
    ];

    await stremResponse({
      model: process.env.DEFAULT_MODEL,
      messages,
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
