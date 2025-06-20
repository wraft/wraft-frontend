import styled, { css, system, Theme } from "@xstyled/emotion";

import { WuiProps } from "@/system";

import { IconOptions } from "./index";

const iconSvgStrokedStyles = css`
  g,
  path {
    stroke: inherit;
    fill: none;
  }
`;

const iconSvgFilledStyles = css`
  g,
  path {
    stroke: none;
  }
`;

type PickedContent = Pick<IconOptions["content"], "isFlag" | "stroked">;

type StyledIconProps = Pick<IconOptions, "size"> &
  PickedContent &
  WuiProps &
  Partial<{ alt: string; title: string }>;

export const Icon = styled("svg")<StyledIconProps>(({
  isFlag,
  size = "md",
  stroked,
  theme,
}) => {
  const formattedSize = theme["icons"][size as keyof Theme["icons"]] || size;
  return `
    ${!isFlag && (stroked ? iconSvgStrokedStyles : iconSvgFilledStyles)};
    width: ${formattedSize};
    height: ${formattedSize};
    ${system};
  `;
});
