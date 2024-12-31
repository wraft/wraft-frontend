import { CSSObject } from "@xstyled/emotion";

import { WuiTheme } from "../types";

export type Options = {
  [param: string]: unknown;
  defaultFontFamily?: string;
  defaultFontSize?: number;
  defaultLetterSpacing?: string;
  defaultLineHeight?: number;
  headingFontFamily?: string;
  iconFontFamily?: string;
};

export type ThemeFontSizes = {
  [key: number]: string;
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
    xs: convert(10),
    sm: convert(12),
    base: convert(14),
    lg: convert(16),
    xl: convert(18),
    "2xl": convert(20),
    "3xl": convert(24),
    "4xl": convert(30),
    "5xl": convert(36),
    "6xl": convert(48),
    "7xl": convert(60),
    "8xl": convert(72),
    "9xl": convert(96),
  };
};

export type ThemeLineHeights = {
  [key: number]: number | string;
  xs: number | string;
  sm: number | string;
  base: number | string;
  lg: number | string;
  xl: number | string;
  "2xl": number | string;
  "3xl": number | string;
  "4xl": number | string;
  "5xl": number | string;
  "6xl": number | string;
  "7xl": number | string;
  "8xl": number | string;
  "9xl": number | string;
};

export const getLineHeights = ({
  defaultLineHeight,
  toRem,
}: {
  defaultLineHeight: number;
  toRem: (value: number) => string;
}): ThemeLineHeights => {
  return {
    xs: toRem(14),
    sm: toRem(16),
    base: toRem(20),
    lg: toRem(24),
    xl: toRem(28),
    "2xl": toRem(28),
    "3xl": toRem(32),
    "4xl": toRem(36),
    "5xl": toRem(16),
    "6xl": toRem(16),
    "7xl": toRem(16),
    "8xl": toRem(16),
    "9xl": toRem(16),
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

export type ThemeLetterSpacings = {
  [key: string]: string;
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

export const getLetterSpacings = ({
  defaultLetterSpacing,
  toRem,
}: {
  defaultLetterSpacing: string;
  toRem: (value: number) => string;
}): ThemeLetterSpacings => {
  return {
    xs: toRem(-0.2),
    sm: toRem(-0.2),
    base: defaultLetterSpacing,
    lg: defaultLetterSpacing,
    xl: defaultLetterSpacing,
    "2xl": toRem(-0.5),
    "3xl": toRem(-0.5),
    "4xl": toRem(-0.5),
    "5xl": toRem(-0.6),
    "6xl": toRem(-0.9),
    "7xl": toRem(-1),
    "8xl": toRem(-1.2),
    "9xl": toRem(-1.7),
  };
};

export type ThemeTextsFontWeights = {
  [key: string]: number;
  xs: number;
  sm: number;
  base: number;
  lg: number;
  xl: number;
  "2xl": number;
  "3xl": number;
  "4xl": number;
  "5xl": number;
  "6xl": number;
  "7xl": number;
  "8xl": number;
  "9xl": number;
};

export const getTextsFontWeights = (theme: WuiTheme): ThemeTextsFontWeights => {
  const { fontWeights } = theme;
  return {
    xs: fontWeights.regular,
    sm: fontWeights.regular,
    base: fontWeights.regular,
    lg: fontWeights.regular,
    xl: fontWeights.regular,
    "2xl": fontWeights.bold,
    "3xl": fontWeights.bold,
    "4xl": fontWeights.bold,
    "5xl": fontWeights.bold,
    "6xl": fontWeights.bold,
    "7xl": fontWeights.bold,
    "8xl": fontWeights.bold,
    "9xl": fontWeights.bold,
  };
};

export type ThemeTextsFontFamily = {
  [key: string]: string;
  "2xl": string;
  "3xl": string;
  "4xl": string;
  "5xl": string;
  "6xl": string;
  "7xl": string;
  "8xl": string;
  "9xl": string;
};

export const getTextsFontFamily = (theme: WuiTheme): ThemeTextsFontFamily => {
  const { fonts } = theme;

  return {
    "2xl": fonts.headings,
    "3xl": fonts.headings,
    "4xl": fonts.headings,
    "5xl": fonts.headings,
    "6xl": fonts.headings,
    "7xl": fonts.headings,
    "8xl": fonts.headings,
    "9xl": fonts.headings,
  };
};

export type ThemeTexts = {
  [key: string]: Partial<{
    fontFamily: CSSObject["fontFamily"];
    fontSize: CSSObject["fontSize"];
    fontWeight: CSSObject["fontWeight"];
    letterSpacing: CSSObject["letterSpacing"];
    lineHeight: CSSObject["lineHeight"];
    textTransform: CSSObject["textTransform"];
  }>;
};

export const getTexts = (theme: WuiTheme): ThemeTexts => {
  const {
    fontSizes,
    letterSpacings,
    lineHeights,
    textsFontFamily,
    textsFontWeights,
  } = theme;

  return Object.keys(fontSizes).reduce((acc, key) => {
    return {
      ...acc,
      [key]: {
        fontFamily:
          textsFontFamily[key as keyof ThemeTextsFontFamily] || undefined,
        fontWeight: textsFontWeights[key as keyof ThemeTextsFontFamily],
        fontSize: fontSizes[key as keyof ThemeFontSizes],
        lineHeight:
          lineHeights[key as keyof ThemeLineHeights] || lineHeights.lg,
        letterSpacing:
          letterSpacings[key as keyof ThemeLetterSpacings] || undefined,
      },
    };
  }, {});
};

export type ThemeFonts = {
  headings: string;
  icons: string;
  texts: string;
};

export const getFonts = (
  defaultFontFamily: Options["defaultFontFamily"],
  headingFontFamily: Options["headingFontFamily"],
  iconFontFamily: Options["iconFontFamily"],
): ThemeFonts => {
  return {
    texts: [defaultFontFamily, "sans-serif"].join(", "),
    headings: [headingFontFamily, "sans-serif"].join(", "),
    icons: iconFontFamily,
  };
};
