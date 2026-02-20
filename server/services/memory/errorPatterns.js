/**
 * Padrões de erros comuns para detecção automática
 * Cada padrão contém: nome do erro, regex de detecção, e descrição
 */
export const ERROR_PATTERNS = [
  {
    name: 'present perfect',
    patterns: [
      /have\s+(forgot|forgotted|went|know|eat|seen|done)/gi,
      /has\s+(forgot|forgotted|went|know|eat|seen|done)/gi,
      /i\s+have\s+went/gi,
      /he\s+have\s+gone/gi,
    ],
    keywords: ['present perfect', 'have gone', 'has went'],
    description: 'Incorrect use of present perfect tense',
  },
  {
    name: 'noun-verb agreement',
    patterns: [
      /\b(he|she|it)\s+(go|come|eat|see|have|run|walk)\b(?!\s*ing)/gi,
      /\b(I|we|they)\s+(goes|comes|eats|sees|has|runs|walks)\b/gi,
    ],
    keywords: ['agreement', 'singular verb', 'plural verb'],
    description: 'Subject-verb agreement errors',
  },
  {
    name: 'article error',
    patterns: [
      /\b(a)\s+[aeiou]/gi, // "a apple" instead of "an apple"
      /\b(an)\s+[^aeiou]/gi, // "an book" instead of "a book" (simplified)
    ],
    keywords: ['a/an', 'article'],
    description: 'Incorrect use of articles (a/an)',
  },
  {
    name: 'word order',
    patterns: [
      /\b(very|really|so)\s+(good|bad|big|small|nice)\s+(very|really|so)\b/gi,
      /adverb\s+placement/gi,
    ],
    keywords: ['word order', 'adverb placement'],
    description: 'Incorrect word order in sentences',
  },
  {
    name: 'preposition',
    patterns: [
      /\bon\s+(the|a)\s+(bed|table|floor|ground)\s+(of|in)/gi,
      /\bat\s+(in|on)/gi,
    ],
    keywords: ['preposition', 'at/in', 'on/in'],
    description: 'Incorrect preposition usage',
  },
];

/**
 * Detecta erros na mensagem do usuário baseado em padrões pré-definidos
 * @param {string} message - Mensagem do usuário
 * @returns {string[]} Array com nomes dos erros detectados
 */
export function detectErrorPatterns(message) {
  const detected = [];
  const messageLower = message.toLowerCase();

  for (const errorPattern of ERROR_PATTERNS) {
    let found = false;

    // verifica regex patterns
    for (const regex of errorPattern.patterns) {
      if (regex.test(message)) {
        found = true;
        break;
      }
    }

    // verifica keywords se regex não encontrou
    if (!found) {
      for (const keyword of errorPattern.keywords) {
        if (messageLower.includes(keyword)) {
          found = true;
          break;
        }
      }
    }

    if (found && !detected.includes(errorPattern.name)) {
      detected.push(errorPattern.name);
    }
  }

  return detected;
}

/**
 * Lista todos os erros disponíveis para uma UI future
 * @returns {string[]} Array com nomes de todos os erros cadastrados
 */
export function getAvailableErrorPatterns() {
  return ERROR_PATTERNS.map((p) => p.name);
}
