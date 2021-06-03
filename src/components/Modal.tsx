/** @jsx jsx */
import { jsx, Box, Button as ButtonBase } from 'theme-ui';
import React, {
  // FC,
  Ref,
  forwardRef,
  useState,
  useLayoutEffect,
  // ReactElement,
  // useEffect,
} from 'react';

import { ButtonProps } from 'reakit/Button';

import {
  DialogStateReturn,
  Dialog,
  DialogDisclosure,
  DialogProps,
  DialogBackdrop,
} from 'reakit/Dialog';

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
  isVisible?: boolean;
  dialog: DialogStateReturn;
  hide?: any;
  label?: string;
  className?: string;
  disclosure?: React.ReactElement;
  onClose?: () => void;
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
  const onCloseHandler = () => {
    // dialog.hide();
    // console.log('dailog', dialog, onClose)
    if (onClose) {
      onClose();
    }
  };

  return (
    <>
      {disclosure && (
        <DialogDisclosure
          {...dialog}
          {...disclosure.props}>
          {(disclosureProps) => React.cloneElement(disclosure, disclosureProps)}
        </DialogDisclosure>
      )}
      <DialogBackdrop
        {...dialog}
        {...{ visible: isVisible }}
        as={BackdropDiv}
        onClick={onCloseHandler}
        aria-label="Dialog">
        <Dialog
          {...dialog}
          as={DialogoBox}
          tabIndex={-1}
          hideOnEsc
          hideOnClickOutside
          visible={isVisible}
          {...props}
          // className={className}
          aria-label={label}>
          <React.Fragment>{children}</React.Fragment>
        </Dialog>
      </DialogBackdrop>
    </>
  );
};

export default Modal;
