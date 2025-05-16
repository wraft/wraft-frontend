import { CSSObject } from "@xstyled/emotion";

import { WuiTheme } from "../types";

import { ThemeFocus } from "./focus";

import { hexToRGBA } from "@/utils";

type CommonAttributesButton = CSSObject;

type SizeAttributesButton = CSSObject;

type Variant = "primary" | "secondary" | "tertiary" | "ghost";
type Size = "xs" | "sm" | "md" | "lg";
type Icon = "only" | "default";

export type ThemeButtons = Record<Variant | "danger", CommonAttributesButton> &
  Record<"hover", Record<Variant | "danger", CommonAttributesButton>> &
  Record<"focus", Record<Variant | "danger", unknown>> &
  Record<"active", Record<Variant | "danger", CommonAttributesButton>> &
  Record<
    "disabled",
    CommonAttributesButton & { "&:focus": ReturnType<ThemeFocus> }
  > &
  Record<"sizes", Record<Size, SizeAttributesButton>> &
  Record<"icon", Record<Icon, Record<Size, string>>>;

export const getButtons = (theme: WuiTheme): ThemeButtons => {
  const { colors, focus, fontWeights, radii, space, texts, toRem } = theme;
  const defaults = {
    ...texts.xs,
    color: "text",
    fontWeight: fontWeights.bold,
    letterSpacing: 0,
    borderRadius: radii.sm2,
    gap: space.sm,
  };

  return {
    primary: {
      ...defaults,
      color: "#fff !important",
      backgroundColor: "primary",
      borderColor: "primary",
    },
    secondary: {
      ...defaults,
      backgroundColor: "button-secondary-bg",
      borderColor: "border",
    },
    tertiary: {
      ...defaults,
      color: "primary",
      backgroundColor: "transparent",
      borderColor: "primary",
    },
    ghost: {
      ...defaults,
      color: "text",
      backgroundColor: "transparent",
      borderColor: "transparent",
    },
    danger: {
      primary: {
        color: "#fff",
        background: colors["red"]["500"],
        borderColor: colors["red"]["600"],
      },
      tertiary: {
        backgroundColor: "transparent",
        color: colors["red"]["800"],
        borderColor: colors["red"]["800"],
      },
      ghost: {
        color: colors["red"]["800"],
        backgroundColor: "transparent",
        borderColor: "transparent",
      },
    },
    hover: {
      primary: {
        backgroundColor: "green.500",
        borderColor: "green.500",
      },
      secondary: {
        backgroundColor: colors["neutral-70"],
        borderColor: "transparent",
      },
      tertiary: {
        backgroundColor: hexToRGBA(colors["neutral-90"], 0.1),
      },
      ghost: {
        backgroundColor: hexToRGBA(colors["neutral-90"], 0.1),
      },
      danger: {
        primary: {
          backgroundColor: colors["red"]["200"],
          borderColor: colors["red"]["300"],
        },
        tertiary: {
          backgroundColor: colors["red-10"],
        },
        ghost: {
          backgroundColor: colors["red-10"],
        },
      },
    },
    focus: {
      primary: { ...focus(colors["primary-20"]) },
      secondary: { ...focus(colors["neutral-40"]) },
      tertiary: { ...focus(colors["neutral-40"]) },
      ghost: { ...focus(colors["neutral-40"]) },
      danger: {
        primary: { ...focus(colors["red-40"]) },
        tertiary: { ...focus(colors["red-40"]) },
        ghost: { ...focus(colors["red-40"]) },
      },
    },
    active: {
      primary: {
        backgroundColor: colors["primary-10"],
        borderColor: colors["primary-10"],
      },
      secondary: {
        backgroundColor: colors["neutral-50"],
        borderColor: colors["neutral-50"],
      },
      tertiary: {
        backgroundColor: hexToRGBA(colors["neutral-90"], 0.4),
      },
      ghost: {
        backgroundColor: hexToRGBA(colors["neutral-90"], 0.4),
      },
      danger: {
        primary: {
          backgroundColor: colors["red-50"],
          borderColor: colors["red-50"],
        },
        tertiary: {
          backgroundColor: colors["red-20"],
        },
        ghost: {
          backgroundColor: colors["red-20"],
        },
      },
    },
    disabled: {
      ...defaults,
      color: colors["beige-70"],
      backgroundColor: colors["beige-40"],
      borderColor: colors["beige-40"],
      "&:focus": { ...focus(colors["beige-10"]) },
    },
    sizes: {
      xs: {
        height: toRem(24),
        padding: `${space.xs} ${space.sm}`,
      },
      sm: {
        ...texts.sm,
        height: toRem(32),
        padding: `${space.sm} ${space.md}`,
      },
      md: {
        ...texts.base,
        fontWeight: fontWeights.bold,
        height: toRem(40),
        padding: `${space.sm} ${space.lg}`,
      },
      lg: {
        ...texts.base,
        fontWeight: fontWeights.bold,
        height: toRem(48),
        padding: `${space.md} ${space.xl}`,
      },
    },
    icon: {
      only: {
        xs: toRem(16),
        sm: toRem(16),
        md: toRem(16),
        lg: toRem(24),
      },
      default: {
        xs: toRem(12),
        sm: toRem(16),
        md: toRem(16),
        lg: toRem(16),
      },
    },
  };
};
