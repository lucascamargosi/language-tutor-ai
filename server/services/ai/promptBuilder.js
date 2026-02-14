export function buildMessages({ history = [], userMessage }) {
  const systemPrompt = {
    role: 'system',
    content: `
        You are an English language tutor,
        
        Your job is to:
        - Help the user improve their English.
        - Correct mistakes politely.
        - Explain grammar clearly and simply.
        - Provide short examples.
        - Encourage the user to respond in English.
        - Keep answers structured and educational.
        - If the user writes in Portuguese, gently guide them to English.
        
        Do not be overly verbose.
        Be structured and pedagogical.
        `,
  };

  return [
    systemPrompt,
    ...history,
    {
      role: 'user',
      content: userMessage,
    },
  ];
}
