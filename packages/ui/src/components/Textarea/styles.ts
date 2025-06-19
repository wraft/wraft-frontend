import styled, { system, th } from "@xstyled/emotion";

import { defaultFieldStyles } from "@/utils";

import { TextareaOptions } from "./index";

export const Textarea = styled("textarea")<TextareaOptions>`
  ${({ size, variant }) =>
    defaultFieldStyles({
      size,
      variant,
    })}
  ${th("textareas")};
  font-family: inherit;
  ${system};
`;
