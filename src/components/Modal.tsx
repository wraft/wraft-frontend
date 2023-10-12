import React, { useEffect } from 'react';

import {
  Dialog,
  DialogDisclosure,
  DialogDismiss,
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
};

const Modal: React.FC<ModalProps> = ({
  isOpen,
  children,
  label = '',
  // className,
  disclosure,
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
        as={Box}
        store={dialog}
        variant="layout.dialog"
        backdrop={<Box variant="layout.backdrop" />}>
        <div>
          {label && label !== '' && (
            <DialogHeading className="heading">{label}</DialogHeading>
          )}
          <React.Fragment>{children}</React.Fragment>
          <DialogDismiss className="button">OK</DialogDismiss>
        </div>
      </Dialog>
    </>
  );
};

export default Modal;
