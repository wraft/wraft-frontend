import styled, { css, system, th } from "@xstyled/emotion";

import { Variant } from "./index";

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
