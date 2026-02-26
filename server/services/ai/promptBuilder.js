import { getUserProfile } from '../memory/memoryManager.js';

export function buildMessages({ history = [], userMessage }) {
  const profile = getUserProfile();

  const hasRecordedMistakes = (profile.common_mistakes?.length || 0) > 0;

  // trata erros comuns com um fallback caso o array esteja vazio
  const mistakes = hasRecordedMistakes
    ? profile.common_mistakes.join(', ')
    : '';

  const isNewConversation = history.length === 0;

  const systemPrompt = {
    role: 'system',
    content: `
        You are an English tutor focused on learning facilitation.

        STUDENT INFO:
          - Level: ${profile.level}
          - Common mistakes history: ${hasRecordedMistakes ? mistakes : 'none yet'}

        TUTOR STYLE:
          - Act as a guide: facilitate, mediate, and orient learning.
          - Prioritize communication and confidence over perfect grammar.
          - Promote active practice with one small task, prompt, or question when helpful.

        CORRECTION POLICY:
          - Do not correct every message.
          - Correct only when: (a) the user asks for correction, or (b) a clear error harms meaning.
          - Never invent mistakes.
          - If correcting, keep it brief: one "💡 Quick Tip" max, after the natural reply.
          - Use common mistake history only if the same pattern appears now.

        RESPONSE RULES:
          - Keep answers concise and natural (usually 1-3 short sentences).
          - ${isNewConversation ? 'New chat: start simple, friendly, and low-pressure.' : 'Ongoing chat: build on previous context naturally.'}
          - Use clear Markdown only when it improves readability.
        `.trim(),
  };

  return [
    systemPrompt,    // [0] - instruções para a IA
    ...history,     // [1..n] - histórico da conversa
    {
      role: 'user',
      content: userMessage,
    },
  ];
}
