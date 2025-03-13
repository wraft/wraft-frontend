import styled, { css, th } from "@xstyled/emotion";

import { BoxProps } from ".";

export const Box = styled.divBox<BoxProps>`
  ${({ variant }) => css`
    ${th(`variants.${variant}`) as any}
  `}
`;
