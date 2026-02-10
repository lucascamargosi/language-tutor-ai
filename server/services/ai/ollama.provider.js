import axios from 'axios';
import dotenv from 'dotenv'
dotenv.config()

const OLLAMA_HOST = process.env.OLLAMA_HOST || 'http://127.0.0.1:11434';

export async function generateResponse({ model, messages }) {
  const response = await axios.post(
    `${OLLAMA_HOST}/api/chat`, 
    {
      model,
      messages,
      stream: false,
    },
    {
      headers: {
        'Content-Type': 'application/json',
      },
    },
  );

  return response.data.message.content;
}
