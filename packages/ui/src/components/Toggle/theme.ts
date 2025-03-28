import { CSSObject } from "@xstyled/emotion";

// To allow for line-height of text in label
const XS_LINE_HEIGHT_ADJUSTMENTS = "0.32rem !important";
const SM_LINE_HEIGHT_ADJUSTMENTS = "0.12rem ! important";

export type Size = "xs" | "sm" | "md";
type State = "default" | "checked" | "disabled";

export type ThemeToggles = {
  after: Record<State | "sizes", CSSObject>;
  icon: Record<"sizes" | "position", CSSObject>;
  item: Record<State | "sizes", CSSObject>;
};

export const getToggles = (theme: any): ThemeToggles => {
  const { borderWidths, colors, focus, toRem } = theme;

  return {
    item: {
      default: {
        backgroundColor: "background-secondary",
        borderColor: "border",
        borderWidth: borderWidths.sm,
        borderStyle: "solid",
        borderRadius: toRem(16),

        "&:focus": {
          borderColor: colors["primary-30"],
          ...focus(colors["primary-30"]),
        },
      },
      sizes: {
        xs: {
          width: toRem(28),
          height: toRem(16),
          marginTop: XS_LINE_HEIGHT_ADJUSTMENTS,
        },
        sm: {
          width: toRem(36),
          height: toRem(20),
          marginTop: SM_LINE_HEIGHT_ADJUSTMENTS,
        },
        md: {
          width: toRem(44),
          height: toRem(24),
          marginTop: "0 !important",
        },
      },
      checked: {
        backgroundColor: "primary",
        borderColor: "primary",
      },
      disabled: {
        borderColor: colors["beige-60"],
        backgroundColor: colors["beige-40"],
      },
    },
    after: {
      default: {
        backgroundColor: "#fff",
        borderColor: "border",
        borderWidth: borderWidths.sm,
        borderStyle: "solid",
        borderRadius: "50%",
      },
      checked: {
        backgroundColor: "#fff",
        borderColor: "primary",
      },
      disabled: {
        borderColor: "transparent",
        backgroundColor: colors["beige-60"],
      },
      sizes: {
        xs: {
          width: toRem(12),
          height: toRem(12),
        },
        sm: {
          width: toRem(16),
          height: toRem(16),
        },
        md: {
          width: toRem(20),
          height: toRem(20),
        },
      },
    },
    icon: {
      position: {
        xs: {
          left: "2px",
          right: "2px",
        },
        sm: {
          left: "4px",
          right: "4px",
        },
        md: {
          left: "4px",
          right: "4px",
        },
      },
      sizes: {
        xs: {
          width: toRem(10),
          height: toRem(10),
          fontSize: toRem(10),
        },
        sm: {
          width: toRem(12),
          height: toRem(12),
          fontSize: toRem(12),
        },
        md: {
          width: toRem(16),
          height: toRem(16),
          fontSize: toRem(16),
        },
      },
    },
  };
};
