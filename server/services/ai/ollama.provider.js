import axios from 'axios';
import dotenv from 'dotenv';
dotenv.config();

const OLLAMA_HOST = process.env.OLLAMA_HOST || 'http://127.0.0.1:11434';
const OLLAMA_TIMEOUT = 30000; // 30 segundos

export async function streamResponse({ model, messages, onToken }) {
  try {
    // verifica se Ollama está disponível
    await axios.get(`${OLLAMA_HOST}/api/tags`, { timeout: 5000 });
  } catch (error) {
    throw new Error(
      `Ollama não está disponível em ${OLLAMA_HOST}. Verifique se está rodando`,
    );
  }

  try {
    const response = await axios.post(
      `${OLLAMA_HOST}/api/chat`,
      {
        model,
        messages,
        stream: true,
      },
      {
        responseType: 'stream',
        headers: { 'Content-Type': 'application/json' },
        timeout: OLLAMA_TIMEOUT,
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
  } catch (error) {
    throw new Error(`Erro ao conectar com Ollama: ${error.message}`);
  }
}
