import styled from "@emotion/styled";
import { Modal } from "@wraft/ui";
import { ResizableHandle, ResizableRoot } from "prosekit/react/resizable";

export const Toolbar = styled.div`
  position: absolute;
  top: -50px;
  left: 50%;
  transform: translateX(-50%);
  background-color: #212121;
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 6px 12px;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.15);
  z-index: 10;
  width: 100%;
`;

export const ToolbarButton = styled.button`
  background: none;
  border: none;
  cursor: pointer;
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 4px;
  border-radius: 4px;
  transition: background-color 0.2s;

  &:hover {
    background-color: rgba(255, 255, 255, 0.1);
  }
`;

export const ModalWrapper = styled(Modal)`
  &[data-enter] {
    border-radius: 6px;
    padding: 0;
    max-width: 600px;
    width: 100%;
  }
`;

export const StyledResizableRoot = styled(ResizableRoot)`
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  box-sizing: border-box;
  overflow: hidden;
  margin: 0.5rem 0;
  max-height: 600px;
  max-width: 100%;
  min-height: 64px;
  min-width: 64px;
  outline: 2px solid transparent;

  background: #f4fbf8;
  border: 2px solid #62b997;
  border-radius: 8px;
  &[data-selected] {
    outline-color: blue;
  }

  img {
    will-change: transform;
    backface-visibility: hidden;
  }
`;

export const Image = styled.img`
  height: 100%;
  width: 100%;
  max-width: 100%;
  max-height: 100%;
  object-fit: contain;
  image-rendering: crisp-edges;
  image-rendering: -webkit-optimize-contrast;
`;

export const UploadingOverlay = styled.div`
  position: absolute;
  bottom: 0;
  left: 0;
  margin: 0.25rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.375rem;
  background-color: rgba(31, 41, 55, 0.6);
  color: rgba(255, 255, 255, 0.8);
  font-size: 0.75rem;
  border-radius: 0.375rem;
`;

export const ErrorOverlay = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 1rem;
  background-color: rgba(229, 231, 235);
  padding: 0.5rem;
  color: #111827;
  opacity: 0.8;
`;

export const StyledResizableHandle = styled(ResizableHandle)`
  position: absolute;
  bottom: 0;
  right: 0;
  margin: 0.375rem;
  padding: 0.25rem;
  background-color: rgba(31, 41, 55, 0.3);
  color: rgba(255, 255, 255, 0.5);
  border-radius: 0.375rem;
  transition: opacity 0.2s;
  &:hover,
  &:active,
  &[data-resizing] {
    background-color: rgba(31, 41, 55, 0.6);
    color: rgba(255, 255, 255, 0.8);
  }
  opacity: 0;
  group-hover &,
  &[data-resizing] {
    opacity: 1;
  }
`;
