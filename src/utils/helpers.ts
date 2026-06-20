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
