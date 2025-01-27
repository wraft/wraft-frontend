import styled, { system, th } from "@xstyled/emotion";

import { TextareaOptions } from "./index";

import { defaultFieldStyles } from "@/utils";

export const Textarea = styled("textarea")<TextareaOptions>`
  ${({ size, variant }) =>
    defaultFieldStyles({
      size,
      variant,
    })}
  ${th("textareas")};
  line-height: lg;
  ${system};
`;
