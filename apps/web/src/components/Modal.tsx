/** @jsxImportSource theme-ui */
import React, { useEffect } from 'react';
import {
  Dialog,
  DialogDisclosure,
  // DialogDismiss,
  DialogHeading,
  useDialogStore,
} from '@ariakit/react';
import { Box } from 'theme-ui';

type ModalProps = {
  isOpen: boolean;
  hide?: any;
  label?: string;
  disclosure?: React.ReactElement;
  onClose?: () => void;
  children: any;
  width?: string;
};

const Modal: React.FC<ModalProps> = ({
  isOpen,
  children,
  label = '',
  // className,
  disclosure,
  width,
  onClose,
}) => {
  const dialog = useDialogStore({ animated: true });

  useEffect(() => {
    if (isOpen) {
      dialog.show();
    } else {
      dialog.hide();
    }
  }, [isOpen]);

  return (
    <>
      {disclosure && (
        <DialogDisclosure {...dialog} {...disclosure.props}>
          {(disclosureProps) => React.cloneElement(disclosure, disclosureProps)}
        </DialogDisclosure>
      )}
      <Dialog
        sx={{
          width: width,
        }}
        onClose={onClose}
        as={Box}
        store={dialog}
        variant="layout.dialog"
        backdrop={<Box variant="layout.backdrop" />}>
        <div>
          {label && label !== '' && (
            <DialogHeading
              sx={{
                m: 0,
                fontSize: 3,
                py: 2,
                px: 2,
                borderBottom: 'solid 1px #ddd',
                mb: 2,
              }}>
              {label}
            </DialogHeading>
          )}
          <React.Fragment>{children}</React.Fragment>
        </div>
      </Dialog>
    </>
  );
};

export default Modal;
