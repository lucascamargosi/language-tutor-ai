import { generateResponse } from '../services/ai/ollama.provider.js';

export async function chatController(req, res) {
  try {
    const { message } = req.body;

    if (!message) {
      return res.status(400).json({ error: 'Message is required' });
    }

    const messages = [
      {
        role: 'user',
        content: message,
      },
    ];

    const reply = await generateResponse({
      model: process.env.DEFAULT_MODEL, 
      messages,
    });
    res.json({ reply });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: 'Internal server error' });
  }
}
