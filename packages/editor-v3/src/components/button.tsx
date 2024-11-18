/** @jsxImportSource @emotion/react */
import styled from "@emotion/styled";
import {
  TooltipContent,
  TooltipRoot,
  TooltipTrigger,
} from "prosekit/react/tooltip";
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
  border: 1px solid #ccc;
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
    background-color: #b4b4b4; /* Light mode */
  }

  &[data-state="on"] {
    background-color: #e2e8f0; /* Light mode */
  }

  &[data-state="on"] {
    background-color: #4a5568; /* Dark mode */
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

const StyledTooltipContent = styled(TooltipContent)`
  z-index: 50;
  overflow: hidden;
  border: 1px solid;
  border-radius: 0.375rem;
  padding: 0.375rem 0.75rem;
  font-size: 0.75rem;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
  background-color: #181818;
  color: #f5f5f5;

  &[data-state="open"] {
    animation: fadeInZoom 150ms ease-in;
  }

  &[data-state="closed"] {
    animation: fadeOutZoom 200ms ease-out;
  }

  @keyframes fadeInZoom {
    0% {
      opacity: 0;
      transform: scale(0.95);
    }
    100% {
      opacity: 1;
      transform: scale(1);
    }
  }

  @keyframes fadeOutZoom {
    0% {
      opacity: 1;
      transform: scale(1);
    }
    100% {
      opacity: 0;
      transform: scale(0.95);
    }
  }

  @media (prefers-color-scheme: dark) {
    background-color: #f5f5f5;
    color: #181818;
  }
`;

export default function Button({
  pressed,
  disabled,
  onClick,
  tooltip,
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
          {/* {tooltip ? <span className="sr-only">{tooltip}</span> : null} */}
        </StyledButton>
      </StyledTooltipTrigger>
      <StyledTooltipContent>{tooltip}</StyledTooltipContent>
    </TooltipRoot>
  );
}
