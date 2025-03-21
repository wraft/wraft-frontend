import styled, { system } from "@xstyled/emotion";

import { InputTextOptions } from "./index";

import { defaultFieldStyles } from "@/utils";

export const InputText = styled("input")<
  Pick<
    InputTextOptions,
    "iconPlacement" | "isClearable" | "transparent" | "variant" | "size"
  >
>`
  ${({ iconPlacement, size, transparent, variant, isClearable }) =>
    defaultFieldStyles({
      size,
      variant,
      transparent,
      isClearable,
      iconPlacement,
    })}
  text-overflow: ellipsis;
  ${system}
`;

export const Wrapper = styled.div`
  position: relative;
`;
