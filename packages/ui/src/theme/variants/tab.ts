import { CSSObject } from "@xstyled/emotion";

import { WuiTheme } from "../types";

type Size = "sm" | "md";

export type ThemeTabs = {
  activeBar: {
    horizontal: CSSObject;
    vertical: CSSObject;
  };
  badge: CSSObject;
  icon: CSSObject;
  item: {
    active: CSSObject;
    default: CSSObject;
    disabled: CSSObject;
    focus: CSSObject;
    size: Record<Size, CSSObject>;
  };
  panel: {
    horizontal: CSSObject;
    vertical: CSSObject;
  };
  tabsBorder: {
    horizontal: CSSObject;
    vertical: CSSObject;
  };
};

export const getTabs = (theme: WuiTheme): ThemeTabs => {
  const { borderWidths, colors, fontSizes, fontWeights, lineHeights, space } =
    theme;

  return {
    tabsBorder: {
      horizontal: {
        boxShadow: `inset 0 -${borderWidths.sm} 0 ${colors["gray"]["300"]}`,
      },
      vertical: {
        boxShadow: `inset -${borderWidths.sm} 0 0 ${colors["gray"]["300"]}`,
      },
    },
    item: {
      default: {
        color: colors["gray"]["700"],
        fontWeight: fontWeights.medium,
        textDecoration: "none",
        lineHeight: lineHeights.md,
      },
      active: {
        color: colors["gray"]["1000"],
      },
      focus: {
        color: colors["gray"]["900"],
      },
      disabled: {
        color: colors["gray"]["500"],
      },
      size: {
        sm: {
          fontSize: fontSizes.sm,
        },
        md: {
          fontSize: fontSizes.md,
        },
      },
    },
    panel: {
      vertical: {
        "&:focus": {
          outline: "none",
        },
      },
      horizontal: {
        marginTop: space.xl,
        "&:focus": {
          outline: "none",
        },
      },
    },
    activeBar: {
      horizontal: {
        background: colors["green"]["800"],
        height: borderWidths.md,
      },
      vertical: {
        background: colors["green"]["800"],
        width: borderWidths.md,
      },
    },
    icon: {
      maxWidth: space.lg,
      maxHeight: space.lg,
    },
    badge: {
      maxHeight: space.lg,
    },
  };
};
