import React, { useEffect, useState, useRef } from "react";

import { CreateWuiProps, forwardRef } from "@/system";
import { DefaultFieldStylesProps, FIELD_ICON_SIZE } from "@/utils";

import { IconWrapper } from "../Field/styles";

import * as S from "./styles";

export interface InputTextOptions extends DefaultFieldStylesProps {
  autoFocus?: boolean;
  autocomplete?: string;
  disabled?: boolean;
  icon?: JSX.Element;
  iconPlacement?: "left" | "right";
  isClearable?: boolean;
  name?: string;
  onBlur?: (event: React.FocusEvent<HTMLInputElement>) => void;
  onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onFocus?: (event: React.FocusEvent<HTMLInputElement>) => void;
  onKeyDown?: (event: React.KeyboardEvent<HTMLInputElement>) => void;
  placeholder?: string;
  type?: string;
  value?: string;
  transparent?: boolean;
  prefixElement?: React.ReactNode;
}

export type InputTextProps = CreateWuiProps<"input", InputTextOptions>;

export const InputText = forwardRef<"input", InputTextProps>(
  (
    {
      autoFocus,
      autocomplete,
      dataTestId,
      disabled,
      icon,
      iconPlacement = "left",
      isClearable,
      name,
      onBlur,
      onChange,
      onFocus,
      onKeyDown,
      placeholder,
      size = "md",
      transparent,
      type = "text",
      value,
      variant,
      prefixElement,
      ...rest
    },
    ref,
  ) => {
    const [prefixWidth, setPrefixWidth] = useState(0);
    const prefixRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
      const element = prefixRef.current;
      if (!element) {
        setPrefixWidth(0);
        return;
      }

      const observer = new ResizeObserver((entries) => {
        for (let entry of entries) {
          setPrefixWidth(entry.contentRect.width || 0);
        }
      });

      observer.observe(element);
      return () => {
        observer.disconnect();
      };
    }, [prefixElement]);

    const hasClearButtonAndRightIcon = isClearable && iconPlacement === "right";
    const hasIcon = icon && iconPlacement;
    const iconSize = FIELD_ICON_SIZE[size];

    return (
      <S.Wrapper>
        {prefixElement && (
          <S.PrefixWrapper ref={prefixRef}>{prefixElement}</S.PrefixWrapper>
        )}
        <S.InputText
          autoFocus={autoFocus}
          autoComplete={autocomplete}
          data-testid={dataTestId}
          disabled={disabled}
          id={name}
          isClearable={isClearable}
          name={name}
          onBlur={onBlur}
          onChange={onChange}
          onFocus={onFocus}
          onKeyDown={onKeyDown}
          placeholder={placeholder}
          ref={ref}
          size={size}
          style={{
            paddingLeft:
              prefixWidth > 0 ? `calc(${prefixWidth}px + 20px)` : undefined,
            transition: "padding-left 200ms cubic-bezier(0.4, 0, 0.2, 1)",
            ...rest.style,
          }}
          transparent={transparent}
          type={type}
          value={value}
          variant={variant}
          {...rest}
        />
        {hasIcon && !hasClearButtonAndRightIcon && (
          <IconWrapper iconPlacement={iconPlacement} size={iconSize}>
            {React.cloneElement(icon, { ...icon.props, size: iconSize })}
          </IconWrapper>
        )}
        {/* {isClearable && (
          <IconGroupWrapper size={iconSize}>
            {value && <ClearButton onClick={handleReset} />}
            {iconPlacement === 'right' &&
              React.cloneElement(icon, { ...icon.props, size: iconSize })}
          </IconGroupWrapper>
        )} */}
      </S.Wrapper>
    );
  },
);

InputText.displayName = "InputText";
