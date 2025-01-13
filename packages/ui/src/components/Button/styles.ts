import { Button as AriakitButton } from "@ariakit/react";
import styled, { css, system, th } from "@xstyled/emotion";
// import { StyledConfig } from "styled-components";

import { ButtonOptions } from "./index";

import { hideFocusRingsDataAttribute } from "@/utils";

const shapeStyles = (
  size: ButtonOptions["size"],
  shape: ButtonOptions["shape"] = "square",
) => css`
  width: ${th(`buttons.sizes.${size}.height`) as any};
  padding: 0;
`;

export const Button = styled(AriakitButton)<ButtonOptions>`
  ${({ variant }) => th(`buttons.${variant}`)};
  ${({ variant, danger }) => danger && th(`buttons.danger.${variant}`)};
  position: relative;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: auto;
  ${({ size }) => th(`buttons.sizes.${size}`)};
  text-decoration: none;
  text-align: center;
  border-radius: sm,
  white-space: nowrap;
  cursor: pointer;
  outline: none !important; /* important for firefox */
  border-width: sm;
  border-style: solid;
  appearance: none;
  overflow: hidden;
  transition: medium;
  ${system};

   ${({ fullWidth }) =>
     fullWidth &&
     `
    width: 100%;
   `};

  & > svg {
    font-weight: initial;
    margin-left: sm;

    &:only-child {
      width: ${({ size }) => size && th(`buttons.icon.only.${size}`)};
      height: ${({ size }) => size && th(`buttons.icon.only.${size}`)};
      font-size: ${({ size }) => size && th(`buttons.icon.only.${size}`)};
    }
    &:not(:only-child) {
      width: ${({ size }) => size && th(`buttons.icon.default.${size}`)};
      height: ${({ size }) => size && th(`buttons.icon.default.${size}`)};
      font-size: ${({ size }) => size && th(`buttons.icon.default.${size}`)};
    }
  }

  & > *:not(:only-child):not(:last-child) {
    margin-right: sm;
  }
    

  ${({ disabled, variant, danger }) =>
    !disabled &&
    css`
      [${hideFocusRingsDataAttribute}] &:focus {
        box-shadow: none;
      }
      &:focus {
        ${th(`buttons.focus.${variant}`) as any};
        ${danger &&
        `
          ${th(`buttons.focus.danger.${variant}`) as any};
        `}
      }
      &:hover {
        ${th(`buttons.hover.${variant}`) as any};
        ${danger &&
        `
          ${th(`buttons.hover.danger.${variant}`) as any};
        `}
      }
      &:active {
        ${th(`buttons.active.${variant}`) as any};
        ${danger &&
        `
          ${th(`buttons.active.danger.${variant}`) as any};
        `}
      }
    `};

  &[disabled] {
    cursor: not-allowed;
  }
`;
