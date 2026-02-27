export type NutritionInfo = {
  kcalPer100g: number;
  gramPerUnit?: number;
};

export const NUTRITION_DB: Record<string, NutritionInfo> = {
  /* ================= THỊT ================= */
  'thịt gà': { kcalPer100g: 239, gramPerUnit: 1200 },
  'thịt bò': { kcalPer100g: 250 },
  'thịt heo': { kcalPer100g: 242 },
  'sườn heo': { kcalPer100g: 290 },
  'thịt vịt': { kcalPer100g: 337, gramPerUnit: 1800 },
  'thịt cừu': { kcalPer100g: 294 },

  /* ================= HẢI SẢN ================= */
  'cá hồi': { kcalPer100g: 208 },
  'cá basa': { kcalPer100g: 124 },
  'cá ngừ': { kcalPer100g: 132 },
  'cá thu': { kcalPer100g: 205 },
  'tôm': { kcalPer100g: 99 },
  'mực': { kcalPer100g: 92 },
  'cua': { kcalPer100g: 83 },

  /* ================= TRỨNG – SỮA ================= */
  'trứng gà': { kcalPer100g: 155, gramPerUnit: 60 },
  'trứng vịt': { kcalPer100g: 185, gramPerUnit: 70 },
  'sữa tươi': { kcalPer100g: 42 },
  'sữa đặc': { kcalPer100g: 321 },
  'phô mai': { kcalPer100g: 402 },
  'bơ sữa': { kcalPer100g: 717 },

  /* ================= RAU CỦ ================= */
  'cà chua': { kcalPer100g: 18, gramPerUnit: 100 },
  'cà rốt': { kcalPer100g: 41, gramPerUnit: 80 },
  'khoai tây': { kcalPer100g: 77, gramPerUnit: 150 },
  'khoai lang': { kcalPer100g: 86, gramPerUnit: 150 },
  'hành tây': { kcalPer100g: 40, gramPerUnit: 120 },
  'tỏi': { kcalPer100g: 149 },
  'ớt': { kcalPer100g: 40 },
  'rau muống': { kcalPer100g: 19 },
  'bắp cải': { kcalPer100g: 25 },
  'dưa leo': { kcalPer100g: 16 },

  /* ================= TRÁI CÂY ================= */
  'chuối': { kcalPer100g: 89, gramPerUnit: 120 },
  'táo': { kcalPer100g: 52, gramPerUnit: 180 },
  'cam': { kcalPer100g: 47, gramPerUnit: 150 },
  'xoài': { kcalPer100g: 60, gramPerUnit: 200 },
  'dưa hấu': { kcalPer100g: 30 },
  'nho': { kcalPer100g: 69 },

  /* ================= TINH BỘT ================= */
  'gạo trắng': { kcalPer100g: 130 },
  'gạo lứt': { kcalPer100g: 123 },
  'bún': { kcalPer100g: 110 },
  'phở': { kcalPer100g: 120 },
  'mì': { kcalPer100g: 138 },
  'bánh mì': { kcalPer100g: 265, gramPerUnit: 90 },

  /* ================= GIA VỊ ================= */
  'dầu ăn': { kcalPer100g: 884 },
  'dầu olive': { kcalPer100g: 884 },
  'nước mắm': { kcalPer100g: 35 },
  'nước tương': { kcalPer100g: 53 },
  'đường': { kcalPer100g: 387 },
  'muối': { kcalPer100g: 0 },
};
