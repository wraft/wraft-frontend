import type { ButtonProps as AkButtonProps } from "@ariakit/react";
import { x } from "@xstyled/emotion";
import { forwardRef } from "react";

import { Spinner } from "../Spinner";

import * as S from "./styles";

export type Shape = "circle" | "square";
export type Size = "xxs" | "xs" | "sm" | "md" | "lg" | "full";
export type Variant =
  | "primary"
  | "secondary"
  | "tertiary"
  | "ghost"
  | "disabled"
  | "googleLogin"
  | "none"
  | "new"
  | "delete"
  | "inline";

export interface ButtonOptions extends AkButtonProps {
  danger?: boolean;
  fullWidth?: boolean;
  disabled?: boolean;
  children?: React.ReactNode;
  loading?: boolean;
  size?: Size;
  variant?: Variant;
  shape?: Shape;
}

export const Button = forwardRef<HTMLButtonElement, ButtonOptions>(
  (
    {
      variant = "primary",
      danger = false,
      children,
      loading = false,
      disabled = false,
      fullWidth = false,
      size = "md",
      shape,
      ...rest
    },
    ref,
  ) => {
    const isDisabled = disabled || loading;

    // Create custom attributes that will be passed to the DOM
    // Use data attributes to prevent React warnings
    const domAttributes = {
      ...(loading ? { "data-loading": "true" } : {}),
      ...(danger ? { "data-danger": "true" } : {}),
      ...(fullWidth ? { "data-fullwidth": "true" } : {}),
    };

    return (
      <S.Button
        variant={variant}
        disabled={isDisabled}
        size={size}
        shape={shape}
        {...domAttributes}
        {...rest}
        ref={ref}
      >
        {loading && (
          <x.div display="flex">
            <Spinner size={9} />
          </x.div>
        )}
        {children}
      </S.Button>
    );
  },
);

Button.displayName = "Button";
