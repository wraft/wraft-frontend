import React, { useEffect, useRef } from "react";

import { DefaultFieldStylesProps } from "../../utils/field-styles";

import * as S from "./styles";

import { CreateWuiProps, forwardRef } from "@/system";

export interface CheckboxOptions extends DefaultFieldStylesProps {
  Component?: React.ElementType;
  checked?: boolean;
  disabled?: boolean;
  indeterminate?: boolean;
  name?: string;
  onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

export type CheckboxProps = CreateWuiProps<"input", CheckboxOptions>;

export const Checkbox = forwardRef<"input", CheckboxProps>(
  (
    {
      checked = false,
      Component = S.Checkbox,
      dataTestId,
      disabled,
      indeterminate = false,
      name,
      onChange,
      size,
      ...rest
    },
    ref,
  ) => {
    const inputRef = useRef<HTMLInputElement>(null);

    // Set indeterminate state when it changes (can't be set via props)
    useEffect(() => {
      if (inputRef.current) {
        inputRef.current.indeterminate = indeterminate;
      }
    }, [indeterminate]);

    // Merge refs
    const mergedRef = (node: HTMLInputElement) => {
      // Set input ref
      if (inputRef.current !== node) {
        inputRef.current = node;
      }

      // Forward ref
      if (typeof ref === "function") {
        ref(node);
      } else if (ref) {
        ref.current = node;
      }
    };

    // Handle checkbox change
    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
      // Pass the event to the parent's onChange handler
      onChange && onChange(event);
    };

    return (
      <Component
        checked={checked}
        data-testid={dataTestId}
        disabled={disabled}
        id={name}
        indeterminate={indeterminate}
        name={name}
        onChange={handleChange}
        ref={mergedRef}
        size={size}
        {...rest}
      />
    );
  },
);

Checkbox.displayName = "Checkbox";
