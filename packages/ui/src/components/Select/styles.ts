import styled, { th } from "@xstyled/emotion";

import { IconWrapper as WUIIconWrapper } from "../Field/styles";

import { SelectOptions } from "./index";

import {
  cardStyles,
  centerContent,
  defaultFieldStyles,
  overflowEllipsis,
  Size,
} from "@/utils";

export const IconWrapper = styled(WUIIconWrapper)``;

export const Wrapper = styled.div<{ disabled: boolean }>`
  position: relative;
`;

export const InputWrapper = styled.div`
  position: relative;
`;

export const Input = styled("div")<{
  iconPlacement?: "both" | "right";
  isClearable?: boolean;
  size: SelectOptions["size"];
  transparent?: boolean;
  variant: SelectOptions["variant"];
}>`
  position: relative;
  ${({ iconPlacement, isClearable, size, transparent, variant }) =>
    defaultFieldStyles({
      iconPlacement,
      size,
      variant,
      transparent,
      isClearable: true,
    })}
  ${overflowEllipsis};
  cursor: pointer;
  line-height: 1em;

  br {
    display: none;
  }

  &::before {
    content: attr(data-spacer);
    visibility: hidden;
    display: block;
    height: 0;
  }

  &:empty {
    &::after {
      content: attr(placeholder);
      position: absolute;
      top: 0;
      right: 0;
      bottom: 0;
      left: 0;
      ${overflowEllipsis};
      padding: inherit;
      ${th("defaultFields.placeholder")}
    }
    &::before {
      height: auto;
    }
  }
`;

export const Menu = styled.ul`
  ${th("defaultFields.select.default")};
  // ${cardStyles};
  position: absolute;
  z-index: 2;
  right: 0;
  left: 0;
  margin: 0;
  margin-top: md;
  padding: 0;
  transition: medium;
  overflow: auto;
  -webkit-overflow-scrolling: touch;

  &:hover > * {
    cursor: pointer;
  }
`;

export const Item = styled.li<{
  isExisting?: boolean;
  isHighlighted?: boolean;
  isSelected?: boolean | undefined;
  isMultiple?: boolean;
  allowUnselectFromList?: boolean;
  isDisabled?: boolean;
}>`
  color: beige-70;
  ${({ isHighlighted }) =>
    isHighlighted && th("defaultFields.select.highlighted")};
  ${({ isSelected, isMultiple }) =>
    isSelected && !isMultiple && th("defaultFields.select.selected")};
  ${({ isSelected, isMultiple, allowUnselectFromList }) =>
    isSelected &&
    isMultiple &&
    !allowUnselectFromList &&
    th("defaultFields.select.existing")};

  ${({ isDisabled }) => isDisabled && th("defaultFields.select.disabled")};
  ${overflowEllipsis};
  padding: md;
  list-style: none;
  text-decoration: none;
  font-size: sm;
  transition: background ${th.transition("medium")};
`;

export const Indicators = styled.div<{
  size: Size;
}>`
  position: absolute;
  padding: 0;
  top: 0;
  bottom: 0;
  right: 0;
  display: flex;
  gap: xs;
`;

export const DropDownIndicator = styled.button<{
  isOpen?: boolean;
  size?: Size;
}>`
  position: relative;
  height: 100%;
  padding: 0;
  outline: none !important; /* important for firefox */
  appearance: none;
  cursor: pointer;
  border: none;
  background: transparent;
  right: 12px;
  ${centerContent};

  svg {
    transform: ${({ isOpen }) =>
      isOpen ? "rotate3d(0, 0, 1, 180deg)" : "rotate3d(0)"};
    transition: medium;
  }

  &:not(:last-child) {
    width: auto;
  }

  &:disabled {
    color: ${th("defaultFields.select.disabled.color")};
  }
`;

export const Tags = styled.divBox`
  margin-top: lg;

  svg:not(:last-child) {
    margin-right: sm;
    margin-bottom: sm;
  }

  &:empty {
    display: none;
  }
`;
