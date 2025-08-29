import styled, { system, th } from "@xstyled/emotion";

import { defaultFieldStyles } from "@/utils";

import { TextareaOptions } from "./index";

const dynamicTextareaStyles = ({ size, variant }: TextareaOptions) =>
  defaultFieldStyles({
    size,
    variant,
  });

export const Textarea = styled("textarea")<TextareaOptions>`
  ${dynamicTextareaStyles}
  ${th("textareas")};
  font-family: inherit;
  ${system};
`;
