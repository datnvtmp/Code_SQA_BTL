import { getScaleFactor } from './scaling';

// Base font sizes (không scale)
export const BASE_FONT_SIZES = {
  xs: 12,
  sm: 14,
  base: 16,
  lg: 18,
  xl: 20,
  '2xl': 24,
  '3xl': 30,
  '4xl': 36,
  '5xl': 48,
  '6xl': 60,
} as const;

// Base line heights
export const BASE_LINE_HEIGHTS = {
  xs: 16,
  sm: 20,
  base: 24,
  lg: 28,
  xl: 28,
  '2xl': 32,
  '3xl': 36,
  '4xl': 40,
  '5xl': 1,
  '6xl': 1,
} as const;

// Function để get scaled font size
export const getScaledFontSize = (size: keyof typeof BASE_FONT_SIZES): number => {
  return BASE_FONT_SIZES[size] * getScaleFactor();
};

// Function để get scaled line height
export const getScaledLineHeight = (size: keyof typeof BASE_LINE_HEIGHTS): number => {
  const baseLineHeight = BASE_LINE_HEIGHTS[size];
  if (baseLineHeight === 1) return 1; // Line height 1 không scale
  return baseLineHeight * getScaleFactor();
};

// Function để get scaled font style object
export const getScaledFontStyle = (size: keyof typeof BASE_FONT_SIZES) => {
  return {
    fontSize: getScaledFontSize(size),
    lineHeight: getScaledLineHeight(size),
  };
};
