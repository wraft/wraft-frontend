/** @jsxImportSource @emotion/react */

import styled from "@emotion/styled";
import {
  BlockHandleAdd,
  BlockHandleDraggable,
  BlockHandlePopover,
} from "prosekit/react/block-handle";
import { DotsSixVertical, Plus } from "@phosphor-icons/react";

const StyledBlockHandlePopover = styled(BlockHandlePopover)`
  display: flex;
  align-items: center;
  flex-direction: row;
  box-sizing: border-box;
  justify-content: center;
  transition: all 0.2s;
  padding: 0.5rem;
  will-change: transform;

  &[data-state="open"] {
    animation: fadeInZoom 150ms ease-in;
  }

  &[data-state="closed"] {
    animation: fadeOutZoom 200ms ease-out;
  }

  &:not([data-state]) {
    display: none;
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
`;

const StyledBlockHandleAdd = styled(BlockHandleAdd)`
  display: flex;
  align-items: center;
  box-sizing: border-box;
  justify-content: center;
  height: 1.5em;
  width: 1.5em;
  border-radius: 0.25em;
  color: rgba(82, 82, 82, 0.5);
  cursor: pointer;

  &:hover {
    background-color: #f5f5f5;
  }

  @media (prefers-color-scheme: dark) {
    &:hover {
      background-color: #303030;
    }
  }
`;

const StyledBlockHandleDraggable = styled(BlockHandleDraggable)`
  display: flex;
  align-items: center;
  box-sizing: border-box;
  justify-content: center;
  height: 1.5em;
  width: 1.2em;
  border-radius: 0.25em;
  color: rgba(82, 82, 82, 0.5);
  cursor: grab;

  &:hover {
    background-color: #f5f5f5;
  }

  @media (prefers-color-scheme: dark) {
    &:hover {
      background-color: #303030;
    }
  }
`;

export default function BlockHandle() {
  return (
    <StyledBlockHandlePopover>
      <StyledBlockHandleAdd>
        <Plus size={16} fill="bold" />
      </StyledBlockHandleAdd>
      <StyledBlockHandleDraggable>
        <DotsSixVertical size={16} />
      </StyledBlockHandleDraggable>
    </StyledBlockHandlePopover>
  );
}
