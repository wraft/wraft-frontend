import React, { forwardRef } from "react";

import { useIsomorphicLayoutEffect } from "../../utils";
import { Label } from "../Label";

import * as S from "./styles";
import {
  generateRandomId,
  getVariant,
  getBaseType,
  forwardedProps,
} from "./utils";

export type Variant = "error" | "info" | "success" | "warning";

export interface FieldOptions {
  children: JSX.Element;
  disabled?: boolean;
  disabledIcon?: JSX.Element;
  error?: string | JSX.Element;
  label?: string | JSX.Element;
  hint?: string | JSX.Element;
  flexDirection?: string | JSX.Element;
  required?: boolean;
  warning?: string | JSX.Element;
  success?: string | JSX.Element;
  info?: string | JSX.Element;
  transparent?: boolean;
}

// export type FieldProps = CreateWuiProps<'div', FieldOptions>

export const Field = forwardRef<HTMLDivElement, FieldOptions>(
  (
    {
      children,
      disabled,
      disabledIcon,
      flexDirection,
      error,
      hint,
      info,
      label,
      required,
      success,
      transparent,
      warning,
      ...rest
    },
    ref,
  ): any => {
    const baseType = getBaseType(
      children.props.type || children.type.displayName,
    );

    const isRadio = baseType === "radio";
    const isRadioGroup = baseType === "RadioGroup";
    const isFieldGroup = baseType === "FieldGroup";
    const isCheckbox = baseType === "checkbox";
    const isToggle = children.type.displayName === "Toggle";
    const isCheckable = isRadio || isCheckbox || isToggle;
    const layout = flexDirection || (isCheckable ? "row" : "column");
    const isGroup = isFieldGroup || isRadioGroup;
    const variant = getVariant({ error, warning, success, info });
    const hintText = variant ? error || warning || success || info : hint;
    const withHintText = !!hintText;
    const htmlFor =
      children.props.id || children.props.name || generateRandomId();

    const child = React.cloneElement(React.Children.only(children), {
      disabled,
      id: htmlFor,
      required,
      variant,
      transparent,
      ...(isGroup ? { flexDirection: layout } : {}),
    });

    useIsomorphicLayoutEffect(() => {
      Object.keys(children.props).forEach((prop) => {
        if (forwardedProps.includes(prop)) {
          const element = document.getElementById(htmlFor);
          // eslint-disable-next-line no-console
          console.warn(
            `You must pass the "${prop}" prop to the <Field /> instead of`,
            element,
          );
        }
      });
    }, [children.props, children.type.displayName, htmlFor]);

    return (
      <S.Field
        ref={ref}
        withHintText={withHintText}
        isRadioGroup={isRadioGroup}
        isCheckable={isCheckable}
        {...rest}
      >
        <S.Label>
          {isCheckable && child}
          <S.LabelWithHint>
            {label && (
              <Label
                checkableField={isCheckable}
                disabled={disabled}
                disabledIcon={disabledIcon}
                htmlFor={htmlFor}
                required={required}
                variant={variant}
                withDisabledIcon={!isCheckable}
              >
                {label}
              </Label>
            )}
          </S.LabelWithHint>
        </S.Label>
        {!isCheckable && child}
        {!isCheckable && hintText && (
          <S.Hint variant={variant}>{hintText}</S.Hint>
        )}
      </S.Field>
    );
  },
);
