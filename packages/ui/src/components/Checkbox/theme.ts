import { CSSObject } from "@xstyled/emotion";

export type ThemeCheckboxes = {
  checked: CSSObject;
  default: CSSObject;
  disabled: CSSObject;
};

export const getCheckboxes = (theme: any): ThemeCheckboxes => {
  const { colors, radii, toRem } = theme;
  return {
    default: {
      width: toRem(16),
      height: toRem(16),
      flexShrink: 0,
      borderRadius: radii.sm,
    },
    disabled: {
      borderColor: colors["beige-60"],
    },
    checked: {
      color: colors["neutral-90"],
      backgroundColor: colors["primary-40"],
      borderColor: colors["primary-40"],
    },
  };
};
