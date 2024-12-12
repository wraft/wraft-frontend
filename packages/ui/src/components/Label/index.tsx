import React from "react";

import * as S from "./styles";

import { CreateWuiProps, forwardRef } from "@/system";
import { Variant, wrapChildren } from "@/utils";

export interface LabelOptions {
  checkableField?: boolean;
  disabled?: boolean;
  disabledIcon?: JSX.Element;
  icon?: JSX.Element;
  variant?: Variant;
  required?: boolean;
  withDisabledIcon?: boolean;
  htmlFor?: string;
}

export type LabelProps = CreateWuiProps<"label", LabelOptions>;

export const Label = forwardRef<"label", LabelProps>(
  (
    {
      checkableField,
      children,
      dataTestId,
      disabled = false,
      disabledIcon,
      icon,
      variant,
      withDisabledIcon = true,
      ...rest
    },
    ref,
  ) => {
    // Wrap strings in span to allow for required asterisk
    const content: any = wrapChildren(children as JSX.Element);

    return (
      <S.Label
        data-testid={dataTestId}
        disabled={disabled}
        disabledIcon={disabledIcon}
        ref={ref}
        variant={variant}
        {...rest}
      >
        {content}
      </S.Label>
    );
  },
);

Label.displayName = "Label";

export const StyledLabel = S.Label;
