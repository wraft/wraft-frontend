import { css, th, useTheme } from "@xstyled/emotion";

import { getVariantColor, Variant } from "./variants";

type FieldIconSizes = {
  xs: "xs";
  sm: "sm";
  md: "sm";
  lg: "sm";
};
export const FIELD_ICON_SIZE: FieldIconSizes = {
  xs: "xs",
  sm: "sm",
  md: "sm",
  lg: "sm",
};

export type Size = "xs" | "sm" | "md" | "lg";
export type FieldIconSize = "xs" | "sm";
export type DefaultFieldStylesProps = Partial<{
  size: Size;
  variant: Variant;
  transparent?: boolean;
  isClearable?: boolean;
  hasIcon?: boolean;
  iconPlacement?: "right" | "left" | "both";
}>;
type DefaultFieldStyles = (
  args: DefaultFieldStylesProps,
) => ReturnType<typeof css>;

export const defaultFieldStyles: DefaultFieldStyles = ({
  iconPlacement,
  isClearable,
  size = "xs",
  transparent,
  variant,
}) => {
  const theme = useTheme();
  const iconSize = FIELD_ICON_SIZE[size];

  return css`
    ${th("defaultFields.default") as any}
    width: 100%;
    transition: medium;
    border-color: ${getVariantColor(variant as any) as any};
    appearance: none;
    ${size && (th(`defaultFields.sizes.${size}`) as any)};

    /* left icon or both */
    ${(iconPlacement === "left" || iconPlacement === "both") &&
    `padding-left: 
      calc(${theme["defaultFields"]["sizes"][size].paddingLeft} + ${theme["icons"][iconSize]} + ${theme["space"]["sm"]})`};

    /* is clearable or right icon */
    ${(isClearable || iconPlacement === "right" || iconPlacement === "both") &&
    `padding-right: 
      calc(${theme["defaultFields"]["sizes"][size].paddingLeft} + ${theme["icons"][iconSize]} + ${theme["space"]["sm"]})`};

    /* is clearable and got a right/both icon */
    ${isClearable &&
    (iconPlacement === "right" || iconPlacement === "both") &&
    `padding-right: 
      calc(${theme["defaultFields"]["sizes"][size].paddingLeft} + ${theme["icons"][iconSize]} + ${theme["icons"][iconSize]} + ${theme["space"]["sm"]} + ${theme["space"]["sm"]})`};

    &::placeholder {
      ${theme["defaultFields"]["placeholder"]};
    }

    ${!variant &&
    transparent &&
    `
        border-color: transparent;
       background-color: transparent;
      `};

    &[disabled] {
      ${theme["defaultFields"]["disabled"]};
    }

    &:focus {
      ${theme["defaultFields"]["focused"]["default"]};
      ${variant === "error" && theme["defaultFields"]["focused"]["error"]};
      ${variant === "warning" && theme["defaultFields"]["focused"]["warning"]};
      ${variant === "success" && theme["defaultFields"]["focused"]["success"]};
      ${variant === "info" && theme["defaultFields"]["focused"]["info"]};
    }

    &:invalid,
    &:-moz-submit-invalid,
    &:-moz-ui-invalid {
      box-shadow: none;
    }
  `;
};
