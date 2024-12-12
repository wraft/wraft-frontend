import styled, { css, system, th } from "@xstyled/emotion";

import { Variant } from "./index";

import { FieldIconSize } from "@/utils";

export const Field = styled.div<any>`
  position: relative;
`;

export const VARIANTS: Record<Variant, string> = {
  error: "danger-500",
  info: "info-500",
  success: "success-500",
  warning: "warning-500",
};

export const Hint = styled.div<{ variant: Variant }>`
  display: flex;
  ${({ variant }) => css`
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
  bottom: 0;
  display: flex;
  inset: 0px 0.75rem 0px auto;
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
