import { th } from "@xstyled/emotion";

export type Variant = "error" | "focused" | "info" | "success" | "warning";

export const VARIANTS: Record<Variant, string> = {
  error: "danger-400",
  focused: "primary-200",
  info: "info-500",
  success: "success-400",
  warning: "warning-400",
};

export const getVariantColor = (variant: Variant): ReturnType<any> => {
  const key = VARIANTS[variant];
  return key ? key : null;
};
