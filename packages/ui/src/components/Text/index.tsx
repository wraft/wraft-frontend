import React from "react";

import * as S from "./styles";

import { CreateWuiProps, forwardRef } from "@/system";

export type TextVariant =
  | "xs"
  | "sm"
  | "base"
  | "lg"
  | "xl"
  | "2xl"
  | "3xl"
  | "4xl"
  | "5xl"
  | "6xl"
  | "7xl"
  | "8xl"
  | "9xl";

export interface TextOptions {
  lines?: number;
  variant?: TextVariant;
  withDash?: boolean;
}

export type TextProps = CreateWuiProps<"div", TextOptions>;

export const Text = forwardRef<"div", TextProps>(
  (
    { children, dataTestId, lines, variant = "base", withDash, ...rest },
    ref,
  ) => {
    const className = rest.className || "";

    return (
      <S.Text
        data-testid={dataTestId}
        lines={lines}
        ref={ref}
        variant={variant}
        withDash={withDash}
        {...rest}
        className={`${className} wui-text`}
      >
        {children}
      </S.Text>
    );
  },
);

Text.displayName = "Text";
