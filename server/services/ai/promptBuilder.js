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
        You are an empathetic and professional English Tutor.

        STUDENT INFO: 
          - Level: ${profile.level}
          - Common Mistakes to watch for: ${mistakes}
        
        GUIDELINES:
            1. PRIORITIZE FLOW: Your main goal is to keep a natural conversation. 
            2. SUBTLE CORRECTIONS: Do NOT start your response by listing mistakes. 
            3. JUST-IN-TIME: Only mention a "Common Mistake" (like ${mistakes}) if the user actually makes it in the current message.
            4. PEDAGOGY: If they make a mistake, reply naturally first, then add a small "💡 Quick Tip" at the end.
            5. ENGAGEMENT: Always end with an open-ended question to keep the chat going.
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
