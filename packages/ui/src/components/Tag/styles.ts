import styled, { system, th } from "@xstyled/emotion";

import { StyledIcon } from "../Icon";

import { Size, Variant } from "./index";

import { WuiProps } from "@/system";
import { centerContent, getMax, overflowEllipsis } from "@/utils";

const shapeStyles = (size: Size, w: string, h: string) => `
  ${th(`tags.shape.${size}`)};
  padding: 0;
  ${
    (w || h) &&
    `
    width: ${getMax(w || "0", h)};
    height: ${getMax(w || "0", h)};
  `
  }
`;

export interface StyledTagProps {
  hasClickAction: boolean;
  hasLink: boolean;
  hasRemoveAction: boolean;
  length: number;
  size: Size;
  variant: Variant;
}

export const Tag = styled.div<StyledTagProps & WuiProps>`
  ${th("tags.default")};
  ${({ variant }) => variant && th(`tags.variants.${variant}`)};
  ${({ size }) => size && th(`tags.sizes.${size}`)};
  position: relative;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  line-height: initial; /* avoid cropped font */
  transition: medium;
  max-width: 100%;
  ${overflowEllipsis}
  ${({ length }) =>
    system &&
    length !== 1 &&
    `
    span,
    p {
      ${overflowEllipsis}
    }
   
    ${
      length === 1 &&
      `
      justify-content: center;
      ${({ size, w, h }) =>
        `
        ${shapeStyles(size, w as string, h as string)};
      `}
    `
    }
   
   `}

  ${({ hasLink, hasClickAction }) =>
    hasLink ||
    (hasClickAction &&
      `
    cursor: pointer;
    text-decoration: none;

    &:hover,
    &:focus {
      cursor: ${(variant) => variant && th(`tags.hover.${variant}`)};
    }
  `)}

  ${({ hasRemoveAction }) =>
    hasRemoveAction &&
    `
    padding-right: xl;
  `}


  > *:not(:last-child) {
    margin-right: xxs;
  }

  & > svg {
    width: ${(size) => size && th(`tags.icon.${size}`)};
    height: ${(size) => size && th(`tags.icon.${size}`)};
  }

  > *:not(:only-child) {
    svg:last-child {
      opacity: 1;
      // transition: opacity ${th.transition("medium")};
      cursor: pointer;

      &:hover {
        opacity: 0.7;
      }
    }
  }
`;

export const ActionIcon = styled.divBox<{ size: Size }>`
  position: absolute;
  ${({ size }) => size && th(`tags.sizes.${size}`)};
  top: 0;
  bottom: 0;
  right: 0;
  ${centerContent};
`;

export const Button = styled.buttonBox`
  all: unset;
  display: flex;
`;
