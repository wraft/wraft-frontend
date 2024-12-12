import { css } from "@emotion/react";
import styled, { system } from "@xstyled/emotion";

import { getVariantColor, Variant } from "../../utils";

import { InputTextOptions } from "./index";

import { shouldForwardProp } from "@/system";
import { defaultFieldStyles } from "@/utils";

// export const InputText = styled('input')<
//   Pick<InputTextOptions, 'iconPlacement' | 'isClearable' | 'transparent' | 'variant' | 'size'>
// >(
//   ({ iconPlacement, isClearable, size, transparent, variant }) => css`
//     width: 100%;
//     ${defaultFieldStyles({
//       size,
//       variant,
//       transparent,
//       isClearable,
//       iconPlacement,
//     })};
//     text-overflow: ellipsis;

//     ${system};
//   `
// )

type InputTextProps = Pick<
  InputTextOptions,
  "iconPlacement" | "isClearable" | "transparent" | "variant" | "size"
> &
  React.InputHTMLAttributes<HTMLInputElement>;

export const InputText = styled("input")<any>`
  width: 100%;
  ${({ size, variant, transparent, isClearable, iconPlacement }) => css`
    color: text;
    font-size: 16px;
    font-weight: body;
    border: 1px solid;
    border-color: border;
    border-color: ${getVariantColor(variant)};
    appearance: none;
    text-overflow: ellipsis;
    outline: none;
    padding: 10px 16px;
    border-radius: 4px;
    &::placeholder {
      color: gray-400;
    }
  `}
`;

export const Wrapper = styled.div`
  position: relative;
`;
