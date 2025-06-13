import { CloseIcon } from "@wraft/icon";

import { CreateWuiProps, forwardRef } from "@/system";

import { ButtonOptions } from "../Button";

import * as S from "./styles";

export type ClearButtonProps = CreateWuiProps<
  "button",
  Omit<ButtonOptions, "shape" | "title" | "variant">
>;

export const ClearButton = forwardRef<"button", ClearButtonProps>(
  ({ size = "xs", ...rest }, ref) => (
    <S.ClearButton
      ref={ref}
      shape="circle"
      size={size}
      title="Clear"
      variant="ghost"
      {...rest}
    >
      <CloseIcon width={18} />
    </S.ClearButton>
  ),
);

// Nested exports
export const StyledClearButton = S.ClearButton;
