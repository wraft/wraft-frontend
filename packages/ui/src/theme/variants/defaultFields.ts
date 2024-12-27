import { CSSObject } from "@xstyled/emotion";

import { Size } from "../../utils";

// import { WuiTheme } from "../types";

export type ThemeFocus = (
  color?: string,
  transparency?: number,
) => {
  boxShadow: CSSObject["boxShadow"];
};

export type ThemeDefaultFields = {
  default: CSSObject;
  sizes: Record<Size, CSSObject>;
  iconPlacement: Record<Size, CSSObject>;
  checkableField: {
    checked: CSSObject;
    disabled: CSSObject;
  };
  disabled: CSSObject;
  placeholder: CSSObject;
  focused: {
    default: CSSObject & ReturnType<ThemeFocus>;
    error: CSSObject & ReturnType<ThemeFocus>;
    warning: CSSObject & ReturnType<ThemeFocus>;
    success: CSSObject & ReturnType<ThemeFocus>;
    info: CSSObject & ReturnType<ThemeFocus>;
  };
  checkablelabel: {
    default: CSSObject;
    checked: CSSObject;
  };
  select: {
    default: CSSObject;
    existing: CSSObject;
    highlighted: CSSObject;
    selectedAndHighlighted: CSSObject;
    selected: CSSObject;
    disabled: CSSObject;
  };
  fieldset: CSSObject;
};

export const getDefaultFields = (theme: any): ThemeDefaultFields => {
  const {
    borderWidths,
    colors,
    focus,
    fontSizes,
    fontWeights,
    radii,
    spaceV2: space,
    toRem,
  } = theme;

  return {
    default: {
      backgroundColor: "transparent",
      color: colors["text"],
      fontSize: fontSizes.base,
      lineHeight: "1rem",
      fontWeight: fontWeights.body,
      borderColor: colors.border,
      borderWidth: borderWidths.sm,
      borderStyle: "solid",
      outline: "none",
      borderRadius: radii.md,
    },
    sizes: {
      xs: {
        height: toRem(24),
        paddingTop: space.xs,
        paddingRight: space.sm,
        paddingBottom: space.xs,
        paddingLeft: space.sm,
      },
      sm: {
        height: toRem(32),
        paddingTop: space.sm,
        paddingRight: space.md,
        paddingBottom: space.sm,
        paddingLeft: space.md,
      },
      md: {
        height: toRem(40),
        paddingTop: space.md,
        paddingRight: space.md,
        paddingBottom: space.md,
        paddingLeft: space.md,
      },
      lg: {
        height: toRem(48),
        paddingTop: space.lg,
        paddingRight: space.md,
        paddingBottom: space.lg,
        paddingLeft: space.md,
      },
    },
    iconPlacement: {
      xs: {
        left: toRem(8),
        right: toRem(8),
      },
      sm: {
        left: toRem(12),
        right: toRem(12),
      },
      md: {
        left: toRem(12),
        right: toRem(12),
      },
      lg: {
        left: toRem(12),
        right: toRem(12),
      },
    },
    checkableField: {
      checked: {
        color: "black",
      },
      disabled: {
        opacity: 0.4,
      },
    },
    disabled: {
      backgroundColor: colors["nude-400"],
      color: "#474543",
      cursor: "not-allowed",
    },
    placeholder: {
      color: "gray.500",
    },
    focused: {
      default: {
        ...focus(colors["gray"]["300"]),
        // borderColor: "transparent",
      },
      error: { ...focus(colors["red"]["300"]) },
      warning: { ...focus(colors["orange"]["300"]) },
      success: { ...focus(colors["green"]["300"]) },
      info: { ...focus(colors["gray"]["400"]) },
    },
    checkablelabel: {
      default: {},
      checked: {
        color: "rgba(0, 0, 0, 1)",
        "-webkit-text-stroke": "0.04em",
      },
    },
    select: {
      default: {
        maxHeight: toRem(155),
        borderRadius: radii.md,
        backgroundColor: "background",
        borderStyle: "solid",
        borderWidth: borderWidths.sm,
        borderColor: colors.border,
      },
      existing: {
        color: "#D6D2CC",
        cursor: "not-allowed",
      },
      highlighted: {
        backgroundColor: "#F6F3EF",
        cursor: "default",
      },
      selectedAndHighlighted: {
        backgroundImage:
          "linear-gradient(0deg, rgba(0, 0, 0, 0.08), rgba(0, 0, 0, 0.08) 100%)",
      },
      selected: {
        color: "rgba(0, 0, 0, 1)",
        fontWeight: fontWeights.bold,
      },
      disabled: {
        color: "#8F8C88",
        cursor: "not-allowed",
      },
    },
    fieldset: {
      "border-width": "0",
    },
  };
};
