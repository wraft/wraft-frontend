import React from "react";

import { CreateWuiProps, forwardRef } from "@/system";

import * as S from "./styles";

type IconContent = {
  block?: string;
  height?: number;
  isFlag?: boolean;
  stroked?: boolean;
  viewBox?: string;
  width?: number;
};

type Size = "xs" | "sm" | "md" | "lg" | "xl" | "xxl" | number | string;

export interface IconOptions {
  content?: IconContent;
  name?: string;
  onClick?: (event: React.MouseEvent<SVGSVGElement>) => void;
  size?: Size;
  title?: string;
}

export type IconProps = CreateWuiProps<typeof S.Icon, IconOptions>;

export const Icon = forwardRef<"svg", IconProps>(
  ({ content, dataTestId, size = "md", title, ...props }, ref) => {
    const className = props.className || "";
    if (!content) {
      return null;
    }

    return (
      <S.Icon
        alt={title}
        dangerouslySetInnerHTML={{ __html: content.block }}
        data-testid={dataTestId && `icon-${dataTestId}`}
        isFlag={content.isFlag}
        ref={ref}
        role="img"
        size={size}
        stroked={content.stroked}
        title={title}
        viewBox={content.viewBox || "0 0 100 100"}
        {...props}
        className={`${className} wui-icon`}
      />
    );
  },
);

Icon.displayName = "Icon";

export const StyledIcon = S.Icon;
