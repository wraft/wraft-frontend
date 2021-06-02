/** @jsx jsx */
import { jsx, Box } from 'theme-ui';
import * as React from 'react';

import {
  DialogStateReturn,
  Dialog as ReakitDialog,
  DialogDisclosure,
  DialogBackdrop as ReakitDialogBackdrop,
} from 'reakit/Dialog';

import styled from '@emotion/styled';

const DialogBackdrop = styled(ReakitDialogBackdrop)`
  &[data-leave] {
    opacity: 0;
  }
  &[data-enter] {
    opacity: 1;
  }
  transition: opacity 250ms ease-in-out;
  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  z-index: 900;
`;

const Dialog = styled(ReakitDialog)`
  &[data-leave] {
    opacity: 0;
  }
  &[data-enter] {
    opacity: 1;
  }
  transition: opacity 250ms ease-in-out;
  position: relative;
  transform: translate(-50%, calc(-50% -50% 0 0));
  outline: 0px;
  z-index: 999;
`;

type ModalProps = {
  isVisible?: boolean;
  dialog: DialogStateReturn;
  hide?: any;
  label?: string;
  className?: string;
  disclosure?: React.ReactElement;
  onClose?: any;
};

const Modal: React.FC<ModalProps> = ({
  hide,
  isVisible,
  children,
  label,
  className,
  disclosure,
  dialog,
  onClose,
  ...props
}) => {
  return (
    <Box>
      {disclosure && (
        <DialogDisclosure {...dialog} {...disclosure.props}>
          {(disclosureProps) => React.cloneElement(disclosure, disclosureProps)}
        </DialogDisclosure>
      )}
      <Box
        {...dialog}
        {...{ visible: isVisible }}
        // visible={isVisible}
        onClick={onClose}
        as={DialogBackdrop}
        aria-label="Dialog"
        variant="layout.modalBackgroup">
        <Box
          as={Dialog}
          {...dialog}
          tabIndex={-1}
          variant="layout.modalContent"
          {...{
            visible: isVisible,
            hideOnEsc: true,
            hideOnClickOutside: true,
            preventBodyScroll: true,
          }}
          {...props}
          // className={className}
          aria-label={label}>
          {children}
        </Box>
      </Box>
    </Box>
  );
};

export default Modal;
