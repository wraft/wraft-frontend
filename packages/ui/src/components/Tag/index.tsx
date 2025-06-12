/* eslint-disable @typescript-eslint/naming-convention */
import { CloseIcon } from "@wraft/icon";
import React from "react";

import { CreateWuiProps, forwardRef } from "@/system";
import { wrapChildren } from "@/utils";

import * as S from "./styles";

const enum SecondaryColors {
  "blue",
  "green",
  "orange",
  "pink",
  "teal",
  "violet",
}

export type ThemeSecondaryColors = keyof typeof SecondaryColors;

export type Size = "xs" | "sm" | "md";
export type Variant =
  | ThemeSecondaryColors
  | "default"
  | "info"
  | "success"
  | "danger"
  | "warning"
  | "primary";

export interface TagOptions {
  href?: string;
  onClick?: () => void;
  onRemove?: () => void;
  size?: Size;
  to?: string;
  variant?: Variant;
}

export type TagProps = CreateWuiProps<"div", TagOptions>;

export const Tag = forwardRef<"div", TagProps>(
  (
    {
      as,
      children,
      dataTestId,
      href,
      onClick,
      onRemove,
      size = "md",
      to,
      variant = "default",
      ...rest
    },
    ref,
  ) => {
    const content = wrapChildren(children as JSX.Element);
    // get size children for int and string
    const hasIntOrStringChildren =
      !!(children || children === 0) &&
      ["number", "string"].includes(typeof children);
    const childrenLength = hasIntOrStringChildren
      ? children.toString().length
      : undefined;
    const hasLink = !!href || !!to;

    return (
      <S.Tag
        as={as}
        data-testid={dataTestId}
        hasClickAction={!!onClick}
        hasLink={hasLink}
        hasRemoveAction={!!onRemove}
        href={href}
        length={childrenLength}
        onClick={onClick}
        ref={ref}
        size={size}
        to={to}
        variant={variant}
        {...rest}
      >
        {content}
        {!!onRemove && (
          <S.ActionIcon size={size}>
            <S.Button onClick={onRemove} title="Remove" type="button">
              <CloseIcon width={14} />
            </S.Button>
          </S.ActionIcon>
        )}
      </S.Tag>
    );
  },
);

Tag.displayName = "Tag";

export const StyledTag = S.Tag;
