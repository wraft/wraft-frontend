import styled, { system } from "@xstyled/emotion";

import { defaultFieldStyles } from "@/utils";

import { InputTextOptions } from "./index";

const dynamicInputTextStyles = ({
  iconPlacement,
  size,
  transparent,
  variant,
  isClearable,
}: Pick<
  InputTextOptions,
  "iconPlacement" | "isClearable" | "transparent" | "variant" | "size"
>) =>
  defaultFieldStyles({
    size,
    variant,
    transparent,
    isClearable,
    iconPlacement,
  });

export const InputText = styled("input")<
  Pick<
    InputTextOptions,
    "iconPlacement" | "isClearable" | "transparent" | "variant" | "size"
  >
>`
  ${dynamicInputTextStyles}
  text-overflow: ellipsis;
  padding-top: sm2;
  padding-bottom: sm2;

  ${system}
`;

export const PrefixWrapper = styled.div`
  position: absolute;
  left: 12px;
  top: 50%;
  transform: translateY(-50%);
  display: flex;
  align-items: center;
  z-index: 1;
`;

export const Wrapper = styled.div`
  position: relative;
`;
