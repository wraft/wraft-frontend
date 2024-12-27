import { WuiTheme } from "../types";

export type ThemeFontSizes = {
  [key: number]: string;
  xxs: string;
  xs: string;
  sm: string;
  base: string;
  lg: string;
  xl: string;
  "2xl": string;
  "3xl": string;
  "4xl": string;
  "5xl": string;
  "6xl": string;
  "7xl": string;
  "8xl": string;
  "9xl": string;
};

export const getFontSizes = (unit: string, theme: WuiTheme): ThemeFontSizes => {
  const { toEm, toRem } = theme;
  const convert = unit === "em" ? toEm : toRem;

  return {
    xxs: convert(10),
    xs: convert(12),
    sm: convert(14),
    base: convert(16),
    lg: convert(18),
    xl: convert(20),
    "2xl": convert(24),
    "3xl": convert(30),
    "4xl": convert(36),
    "5xl": convert(48),
    "6xl": convert(60),
    "7xl": convert(72),
    "8xl": convert(96),
    "9xl": convert(128),
  };
};

export type ThemeFontWeights = {
  [key: string]: number;
  bold: number;
  heading: number;
  body: number;
};

export const fontWeights: ThemeFontWeights = {
  body: 400,
  heading: 500,
  bold: 700,
};
