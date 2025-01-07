import styled, { css, th } from "@xstyled/emotion";

import { Variant } from "./index";

import { FieldIconSize } from "@/utils";

export const Field = styled.div<any>`
  position: relative;
`;

export const VARIANTS: Record<Variant, string> = {
  error: "red.400",
  info: "gray.500",
  success: "green.400",
  warning: "yellow.400",
};

export const Hint = styled.div<{ variant: Variant }>`
  display: flex;
  ${({ variant }) => `
    color: ${VARIANTS[variant] || undefined};
  `}
  display: flex;
  align-items: center;
  font-size: 12px;
  margin-top: 4px;
`;

export const Label = styled.div`
  display: flex;
  align-items: flex-start;
  gap: sm;
  margin-bottom: 4px;
`;

export const LabelWithHint = styled.div`
  display: flex;
  flex-direction: column;
`;

type IconWrapperProps = {
  iconPlacement: "left" | "right";
  size?: FieldIconSize;
};

export const IconWrapper = styled.div<IconWrapperProps>`
  position: absolute;
  top: 0;
  left: ${({ iconPlacement, size }) =>
    iconPlacement === "left"
      ? th(`defaultFields.iconPlacement.${size}.left`)
      : "auto"};

  right: ${({ iconPlacement, size }) =>
    iconPlacement === "right"
      ? th(`defaultFields.iconPlacement.${size}.right`)
      : "auto"};

  bottom: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  pointer-events: none;
  transition: medium;
  transition-timing-function: primary;
  color: neutral-90;

  /* for button action */
  & > button {
    pointer-events: auto;
  }
`;
