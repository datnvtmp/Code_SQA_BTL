import { NUTRITION_DB } from './nutrition.db';
import { normalizeFoodName } from './foodNormalizer';
import { toGrams } from './unitConverter';

export type IngredientInput = {
  quantity: number;
  unit: string;
  rawName: string;
};

export type NutritionResult = {
  name: string;
  grams: number;
  calories: number;
  warning?: string;
};

export const calculateNutrition = (
  ingredients: IngredientInput[]
): NutritionResult[] => {
  return ingredients.map((item) => {
    const key = normalizeFoodName(item.rawName);
    const nutrition = NUTRITION_DB[key];

    if (!nutrition) {
      return {
        name: item.rawName,
        grams: 0,
        calories: 0,
        warning: 'Chưa có dữ liệu dinh dưỡng',
      };
    }

    const grams = toGrams(
      item.quantity,
      item.unit,
      nutrition
    );

    const calories = Math.round(
      (grams / 100) * nutrition.kcalPer100g
    );

    return {
      name: item.rawName,
      grams,
      calories,
    };
  });
};
