import { Box } from 'theme-ui';
import React, {
  // FC,
  Ref,
  forwardRef,
  useState,
  useLayoutEffect,
  // ReactElement,
  useEffect,
} from 'react';

import {
  Dialog,
  DialogDisclosure,
  DialogProps,
  DialogBackdrop,
  useDialogState,
} from 'reakit/Dialog';

import { Portal } from 'reakit/Portal';

interface BackdropDivProps {
  // backdropWhite?: ModalBaseProps['backdropWhite']
}

export const BackdropDiv = forwardRef(
  ({ ...props }: DialogProps & BackdropDivProps, ref: Ref<HTMLDivElement>) => {
    const [mounted, setMounted] = useState(false);
    useLayoutEffect(function () {
      setMounted(true);
    }, []);

    return mounted ? (
      <Box variant="layout.modalBackgroup" {...props} ref={ref} />
    ) : null;
  },
);

export const DialogoBox = forwardRef(
  ({ ...props }: DialogProps, ref: Ref<HTMLDivElement>) => {
    const [mounted, setMounted] = useState(false);
    useLayoutEffect(function () {
      setMounted(true);
    }, []);

    return mounted ? (
      <Box variant="layout.modalContentB" {...props} ref={ref} />
    ) : null;
  },
);

type ModalProps = {
  isOpen: boolean;
  hide?: any;
  label?: string;
  disclosure?: React.ReactElement;
  onClose?: () => void;
};

const Modal: React.FC<ModalProps> = ({
  hide,
  isOpen,
  children,
  label = 'Standard Modal',
  // className,
  disclosure,
  onClose,
  ...props
}) => {
  const dialog = useDialogState();

  useEffect(() => {
    if (!dialog.visible) {
      if (onClose) {
        onClose();
      }
    }
  }, [dialog.visible]);

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
      <Portal>
        <DialogBackdrop {...dialog} as={BackdropDiv} aria-label={label}>
          <Dialog
            {...dialog}
            as={DialogoBox}
            tabIndex={-1}
            hideOnEsc
            hideOnClickOutside
            {...props}
            aria-label={label}>
            <React.Fragment>{children}</React.Fragment>
          </Dialog>
        </DialogBackdrop>
      </Portal>
    </>
  );
};

export default Modal;
