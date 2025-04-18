import { CSSObject } from "@xstyled/emotion";

import { WuiTheme } from "../types";

export type ThemeTextareas = CSSObject;

export const getTextareas = (theme: WuiTheme): ThemeTextareas => {
  const { space, toRem } = theme;

  return {
    minHeight: toRem(130),
    padding: space.md,
  };
};
