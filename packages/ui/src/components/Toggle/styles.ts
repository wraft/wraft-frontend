import * as Ariakit from "@ariakit/react";
import styled, { system, th } from "@xstyled/emotion";

import { ToggleOptions, Size } from "./index";

// Define a type that includes the order property
type StyledToggleProps = ToggleOptions & {
  order?: string;
};

export const Toggle = styled(Ariakit.Checkbox)<StyledToggleProps>`
  ${th("toggles.item.default")};
  ${({ size }) => size && th(`toggles.item.sizes.${size}`)};
  position: relative;
  display: block;
  appearance: none;
  outline: none !important; /* important for firefox */
  cursor: pointer;
  transition: medium;
  order: ${({ order = "-1" }) => order};

  &::after {
    ${th("toggles.after.default")};
    ${({ size }) => size && th(`toggles.after.sizes.${size}`)};
    content: "";
    top: 0;
    bottom: 0;
    left: 2;
    position: absolute;
    margin: auto;
    transition: medium;
    z-index: 1;
  }

  &:disabled {
    ${th("toggles.item.disabled")};
    cursor: not-allowed;

    &::after {
      ${th("toggles.after.disabled")};
    }
  }

  &:checked {
    ${th("toggles.item.checked")};

    &::after {
      ${th("toggles.after.checked")};
      transform: translateX(
        calc(
          ${({ size }) => size && th(`toggles.item.sizes.${size}.width`)} -
            ${({ size }) => size && th(`toggles.after.sizes.${size}.width`)} -
            4px
        )
      );
    }

    &:disabled {
      ${th("toggles.item.checked.disabled")};

      &::after {
        ${th("toggles.after.checked.disabled")};
      }
    }
  }
  ${system};
`;

export const Wrapper = styled.div`
  position: relative;
  display: inline-flex;
  align-items: center;
`;

export const IconWrapper = styled.div<{
  checked: boolean;
  size: Size;
}>`
  position: absolute;
  z-index: 2;
  display: flex;
  align-items: center;
  height: ${({ size }) => size && th(`toggles.item.sizes.${size}.height`)};
  bottom: 0;

  > svg,
  > img {
    width: ${({ size }) => size && th(`toggles.icon.sizes.${size}.width`)};
    height: ${({ size }) => size && th(`toggles.icon.sizes.${size}.height`)};
  }

  ${({ checked, size }) =>
    checked &&
    `
    left: ${th(`toggles.icon.position.${size}.left`)};
    color: neutral-90;
  `}

  ${({ checked, size }) =>
    !checked &&
    `
    right: ${th(`toggles.icon.position.${size}.right`)};
  `}
`;
