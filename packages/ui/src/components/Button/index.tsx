import type { ButtonProps as AkButtonProps } from "@ariakit/react";
import { Button as AriakitButton } from "@ariakit/react";
import styled, { th, x } from "@xstyled/emotion";
import { forwardRef } from "react";

import { Spinner } from "../Spinner";

import * as S from "./styles";

export type Shape = "circle" | "square";
export type Size = "xxs" | "xs" | "sm" | "md" | "lg" | "full";
export type Variant =
  | "primary"
  | "secondary"
  | "outlined"
  | "disabled"
  | "googleLogin"
  | "ghost"
  | "none"
  | "delete";

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
      ...rest
    },
    ref,
  ) => {
    const isDisabled = disabled || loading;
    return (
      <S.Button
        variant={variant}
        danger={danger}
        loading={loading}
        fullWidth={fullWidth}
        disabled={isDisabled}
        size="md"
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
