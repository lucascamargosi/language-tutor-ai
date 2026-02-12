import axios from 'axios';
import dotenv from 'dotenv';
dotenv.config();

const OLLAMA_HOST = process.env.OLLAMA_HOST || 'http://127.0.0.1:11434';

export async function stremResponse({ model, messages, onToken }) {
  const response = await axios.post(
    `${OLLAMA_HOST}/api/chat`,
    {
      model,
      messages,
      stream: true, // habilita o straming no Ollama
    },
    {
      responseType: 'stream', // axios trata como fluxo
      headers: { 'Content-Type': 'application/json' },
    },
  );

  for await (const chunk of response.data) {
    const lines = chunk.toString().split('\n').filter(Boolean);

    for (const line of lines) {
      const data = JSON.parse(line);

      if (data.message?.content) {
        onToken(data.message.content);
      }

      if (data.done) {
        return;
      }
    }
  }
}
