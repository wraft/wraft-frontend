import { th } from "@xstyled/emotion";

export type Variant = "error" | "focused" | "info" | "success" | "warning";

export const VARIANTS: Record<Variant, string> = {
  error: "red-400",
  focused: "gray.400",
  info: "info-500",
  success: "green.400",
  warning: "yellow.400",
};

export const getVariantColor = (variant: Variant): ReturnType<any> => {
  const key = VARIANTS[variant];
  return key ? key : null;
};
