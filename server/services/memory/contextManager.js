import { countMessageTokens } from '../../utils/tokenCounter.js';
import { getLatestMessages } from './historyService.js';
import { buildMessages } from '../ai/promptBuilder.js';

const CONTEXT_LIMIT = parseInt(process.env.CONTEXT_LIMIT || '6000');
const RESERVED_FOR_OUTPUT = 1000;

export function getSmartContext(userMessage) {
  const maxInputTokens = CONTEXT_LIMIT - RESERVED_FOR_OUTPUT;

  // busca últimas 30 mensagens o histórico
  // Nota: não busca a mensagem atual, pois o buildMessages vai adicioná-la
  const rawHistory = getLatestMessages(30);

  // monta o prompt completo (System + History + UserMessage)
  let fullContext = buildMessages({
    history: rawHistory,
    userMessage,
  });

  // Sliding Window: remove as mensagens mais antigas se estourar o limite
  // o índice [0] é o System Prompt; remove sempre o [1] (a msg mais antiga do histórico)
  while (
    countMessageTokens(fullContext) > maxInputTokens &&
    fullContext.length > 2 // garante que sobra o System e a UserMessage
  ) {
    fullContext.splice(1, 1);
  }

  return fullContext;
}
