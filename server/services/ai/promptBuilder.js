import { getUserProfile } from '../memory/memoryManager.js';

export function buildMessages({ history = [], userMessage }) {
  const profile = getUserProfile();

  // trata erros comuns com um fallback caso o array esteja vazio
  const mistakes =
    profile.common_mistakes?.length > 0
      ? profile.common_mistakes.join(', ')
      : 'None recorded yet';

  const systemPrompt = {
    role: 'system',
    content: `
        You are an English language tutor.

        STUDENT PROFILE: 
          - Level: ${profile.level}
          - Goal: ${profile.goal}
          - Common Mistakes: ${mistakes}
        
        Your job is to:
        - Use the student profile to adapt vocabulary and explanations.
        - Help the user improve their English.
        - Correct mistakes politely.
        - Explain grammar clearly and simply.
        - Provide short examples.
        - Encourage the user to respond in English.
        - Keep answers structured and educational.
        - If the user writes in Portuguese, gently guide them to English.
        
        Do not be overly verbose. Be structured and pedagogical.
        `.trim(),
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
