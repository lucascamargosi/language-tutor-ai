import axios from 'axios';

const OLLAMA_HOST = process.env.OLLAMA_HOST;

export async function generateResponse({ model, messages }) {
  const response = await axios.post(
    `${OLLAMA_HOST}/api/chat`, // usa a variável de ambiente configurada no arquivo .env para saber o endereço 
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
