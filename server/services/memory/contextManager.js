import { countMessageTokens } from '../../utils/tokenCounter.js';

const CONTEXT_LIMIT = parseInt(process.env.CONTEXT_LIMIT || '6000');
const RESERVED_FOR_OUTPUT = 1000;

export function buildContext(messages) {
  const maxInputTokens = CONTEXT_LIMIT - RESERVED_FOR_OUTPUT;

  let trimmedMessages = [...messages];

  while (
    countMessageTokens(trimmedMessages) > maxInputTokens &&
    trimmedMessages.length > 1
  ) {
    // remove a mensagem mais antiga
    trimmedMessages.shift();
  }

  return trimmedMessages;
}
