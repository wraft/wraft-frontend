import { WuiTheme } from "../types";

export type ThemeRadii = {
  [key: number]: string;
  full: string;
  lg: string;
  md2: string;
  md: string;
  none: string;
  sm: string;
  sm2: string;
  xl: string;
  xxl: string;
};

export const getRadii = (theme: WuiTheme): ThemeRadii => {
  return {
    none: "0",
    sm: theme.toRem(2),
    sm2: theme.toRem(3),
    md: theme.toRem(4),
    md2: theme.toRem(6),
    lg: theme.toRem(8),

    xl: theme.toRem(16),
    xxl: theme.toRem(24),
    full: "100%",
  };
};
