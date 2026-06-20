import config from '../data/analysisResultConfig.json';

export const capitalizeName = (str: string): string => {
  if (!str) return '';
  return str
    .toLowerCase()
    .split(' ')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
};

export const getFormulaComponents = (formula: string): string[] => {
  try {
    const match = formula.match(/\(([^)]+)\)/);
    if (match && match[1]) {
      return match[1].split('+').map((item) => item.trim());
    }
  } catch (e) {
    console.error('Error parsing formula components:', e);
  }
  return ['Name Energy', 'Emotional Index', 'Compatibility Factor'];
};

export const getAbbreviation = (name: string): string => {
  return name
    .split(' ')
    .map((w) => w[0])
    .join('')
    .toUpperCase();
};

/**
 * Normalizes both names (trim and lowercase) and sorts them alphabetically
 * to ensure that the same pair (e.g., Alice & Bob vs Bob & Alice) always
 * maps to the exact same record.
 */
export const normalizeAndSortNames = (name1: string, name2: string): [string, string] => {
  return [name1, name2]
    .map((name) => name.trim().toLowerCase())
    .sort() as [string, string];
};

/**
 * Randomly picks a message and a paragraph from the configuration
 * JSON based on the score. This allows variation in description
 * text for repeated queries (like clicking Try Again).
 */
export const getRandomText = (
  score: number
): { message: string; paragraph: string } => {
  const matchingRange = config.scoreRanges.find(
    (range) => score >= range.min && score <= range.max
  );

  if (!matchingRange) {
    return {
      message: 'Good compatibility.',
      paragraph: 'The emotional alignment check indicates a positive match between both individuals.',
    };
  }

  const messageIndex = Math.floor(Math.random() * matchingRange.messages.length);
  const paragraphIndex = Math.floor(Math.random() * matchingRange.paragraphs.length);

  return {
    message: matchingRange.messages[messageIndex],
    paragraph: matchingRange.paragraphs[paragraphIndex],
  };
};
