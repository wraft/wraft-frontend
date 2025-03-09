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

// Create a type with the data attributes to use in styled components
type StyledButtonProps = Omit<
  ButtonOptions,
  "loading" | "fullWidth" | "danger"
> & {
  "data-loading"?: string;
  "data-fullwidth"?: string;
  "data-danger"?: string;
};

export const Button = styled(AriakitButton)<StyledButtonProps>`
  ${({ variant }) => th(`buttons.${variant}`)};
  ${({ variant, "data-danger": dataDanger }) => dataDanger && th(`buttons.danger.${variant}`)};
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

  // Apply styles using data attributes instead of props
  &[data-fullwidth="true"] {
    width: 100%;
  }

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

  &:hover {
    ${({ variant }) => th(`buttons.focus.${variant}`)};
    ${({ variant, "data-danger": dataDanger }) => dataDanger && th(`buttons.focus.danger.${variant}`)};      
  }

  &:hover {
    ${({ variant }) => th(`buttons.hover.${variant}`)};
    ${({ variant, "data-danger": dataDanger }) => dataDanger && th(`buttons.hover.danger.${variant}`)};      
  }

  &:active {
    ${({ variant }) => th(`buttons.active.${variant}`)};
    ${({ variant, "data-danger": dataDanger }) => dataDanger && th(`buttons.active.danger.${variant}`)};      
  }

  [${hideFocusRingsDataAttribute}] &:focus {
    box-shadow: none;
  }
    
  &[disabled] {
    cursor: not-allowed;
  }
`;
