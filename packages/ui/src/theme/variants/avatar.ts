import { CSSObject } from "@xstyled/emotion";

import { WuiTheme } from "../types";

export type Size = "xs" | "sm" | "md" | "lg" | "xl" | "xxl";

export type ThemeAvatars = {
  sizes: Record<
    Size,
    {
      size: string;
      fontSize: string;
    }
  >;
  text: CSSObject;
};

export const getAvatars = (theme: WuiTheme): ThemeAvatars => {
  const { colors, fontWeights, toRem } = theme;

  return {
    sizes: {
      xs: {
        size: toRem(20),
        fontSize: toRem(10),
      },
      sm: {
        size: toRem(24),
        fontSize: toRem(12),
      },
      md: {
        size: toRem(30),
        fontSize: toRem(14),
      },
      lg: {
        size: toRem(40),
        fontSize: toRem(16),
      },
      xl: {
        size: toRem(50),
        fontSize: toRem(18),
      },
      xxl: {
        size: toRem(60),
        fontSize: toRem(20),
      },
    },
    text: {
      color: colors["neutral-90"],
      fontWeight: fontWeights.bold,
    },
  };
};
