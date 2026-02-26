import axios from 'axios';
import dotenv from 'dotenv';
dotenv.config();

const OLLAMA_HOST = process.env.OLLAMA_HOST || 'http://127.0.0.1:11434';
const OLLAMA_TIMEOUT = 30000; // 30 segundos
const OLLAMA_TEMPERATURE = Number(process.env.OLLAMA_TEMPERATURE || '0.2');
const OLLAMA_TOP_P = Number(process.env.OLLAMA_TOP_P || '0.9');
const OLLAMA_REPEAT_PENALTY = Number(
  process.env.OLLAMA_REPEAT_PENALTY || '1.1',
);
const OLLAMA_NUM_PREDICT = Number(process.env.OLLAMA_NUM_PREDICT || '220');

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
        stream: true, // instrui ollma a enviar respostas em pedaços
        options: {
          temperature: OLLAMA_TEMPERATURE,
          top_p: OLLAMA_TOP_P,
          repeat_penalty: OLLAMA_REPEAT_PENALTY,
          num_predict: OLLAMA_NUM_PREDICT,
        },
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
