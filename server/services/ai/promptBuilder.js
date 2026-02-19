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
        
        INSTRUCTIONS:
          - Do NOT start every response mentioning the student's mistakes.
          - Only address the "Known Areas for Improvement" if the student actually makes a mistake related to them during the conversation.
          - Focus on the flow of the conversation first. 
          - Your primary goal is to be a conversation partner, correcting errors only when they happen (Just-in-time feedback).
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
