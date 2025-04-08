import { CSSObject } from "@xstyled/emotion";

import { Primary } from "../Button/Button.stories";

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
      borderColor: colors["gray"]["600"],
    },
    checked: {
      color: "#fff",
      backgroundColor: "primary",
      borderColor: colors["green"]["400"],
    },
  };
};
