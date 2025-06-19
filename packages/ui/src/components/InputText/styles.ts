import styled, { system } from "@xstyled/emotion";

import { defaultFieldStyles } from "@/utils";

import { InputTextOptions } from "./index";

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
  padding-top: sm2;
  padding-bottom: sm2;

  ${system}
`;

export const Wrapper = styled.div`
  position: relative;
`;
