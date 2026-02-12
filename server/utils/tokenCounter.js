export function estimateTokens(text) {
  if (!text) return 0;

  return Math.ceil(text.length / 4);
}

export function countMessageTokens(messages) {
  return messages.reduce((total, msg) => {
    return total + estimateTokens(msg.content);
  }, 0);
}
