export const normalizeFoodName = (rawName: string): string => {
  const name = rawName
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .trim();

  if (name.includes('ga')) return 'thịt gà';
  if (name.includes('heo') || name.includes('lon')) return 'thịt heo';

  return name;
};
