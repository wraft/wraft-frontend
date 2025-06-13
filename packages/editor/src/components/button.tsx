/** @jsxImportSource @emotion/react */
import styled from "@emotion/styled";
import { TooltipRoot, TooltipTrigger } from "prosekit/react/tooltip";
import type { ReactNode } from "react";

const StyledTooltipTrigger = styled(TooltipTrigger)`
  display: block;
`;

const StyledButton = styled.button<{ pressed?: boolean; disabled?: boolean }>`
  outline: unset;
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 0.375rem;
  padding: 0.5rem;
  font-weight: 500;
  font-size: 0.875rem;
  transition: all 0.2s ease-in-out;
  min-width: 2.25rem;
  min-height: 2.25rem;
  background-color: transparent;
  color: inherit;
  cursor: pointer;
  border: none;
  gap: 8px;

  &:focus-visible {
    outline: unset;
    ring: 2px solid;
    ring-color: #181818; /* Dark mode */
    ring-color: #d1d1d1; /* Light mode */
  }

  &:disabled {
    pointer-events: none;
    opacity: 0.5;
  }

  &:hover:disabled {
    opacity: 0.5;
  }

  &:hover {
    background-color: var(--theme-ui-colors-gray-400);
  }

  &[data-state="on"] {
    background-color: var(--theme-ui-colors-gray-300);
  }

  &[data-state="on"] {
    background-color: var(--theme-ui-colors-gray-300);
  }

  @media (prefers-color-scheme: dark) {
    &:hover {
      background-color: #b4b4b4;
    }
    &:focus-visible {
      ring-color: #d1d1d1;
    }
  }
`;

export default function Button({
  pressed,
  disabled,
  onClick,
  children,
}: {
  pressed?: boolean;
  disabled?: boolean;
  onClick?: VoidFunction;
  tooltip?: string;
  children: ReactNode;
}) {
  return (
    <TooltipRoot>
      <StyledTooltipTrigger>
        <StyledButton
          data-state={pressed ? "on" : "off"}
          disabled={disabled}
          onClick={() => onClick?.()}
          onMouseDown={(event) => event.preventDefault()}
        >
          {children}
        </StyledButton>
      </StyledTooltipTrigger>
    </TooltipRoot>
  );
}
