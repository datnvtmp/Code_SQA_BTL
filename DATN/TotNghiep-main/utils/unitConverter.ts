import { NutritionInfo } from './nutrition.db';

export const toGrams = (
  quantity: number,
  unit: string,
  nutrition?: NutritionInfo
): number => {
  switch (unit) {
    case 'g':
      return quantity;

    case 'kg':
      return quantity * 1000;

    case 'lạng':
      return quantity * 100;

    case 'con':
    case 'quả':
    case 'cái':
      return nutrition?.gramPerUnit
        ? quantity * nutrition.gramPerUnit
        : 0;

    default:
      return 0;
  }
};
