// index.tsx
import * as Ariakit from "@ariakit/react";
import { forwardRef } from "react";

import { Header } from "./Header";
import * as S from "./styles";

export type Size = "xs" | "sm" | "md" | "lg" | "auto";

export interface ModalOptions extends Omit<Ariakit.DialogOptions, "as"> {
  ariaLabel: string;
  children: React.ReactElement;
  size?: Size;
  backdrop?: boolean;
  hideOnInteractOutside?: boolean;
  onConfirm?: () => void;
  onClose?: () => void;
}

export interface IProp extends ModalOptions {
  open: boolean;
  onClose: () => void;
}

const ModalComponent = forwardRef<HTMLDivElement, ModalOptions>(
  (
    {
      ariaLabel,
      backdrop = true,
      children,
      hideOnInteractOutside = true,
      open,
      size = "md",
      onConfirm, // <-- Destructure onConfirm
      ...rest
    },
    ref,
  ) => {
    const dialog = Ariakit.useDialogStore({ animated: true, open });

    // Size handling for the modal
    const modalSize = {
      xs: "200px",
      sm: "300px",
      md: "500px",
      lg: "700px",
      auto: "auto",
    }[size];

    return (
      <Ariakit.Dialog
        aria-label={ariaLabel}
        backdrop={
          backdrop && (
            <S.Backdrop
              backdrop={backdrop}
              hideOnInteractOutside={hideOnInteractOutside}
            />
          )
        }
        store={dialog}
        open={open}
        hideOnInteractOutside={hideOnInteractOutside}
        ref={ref}
        render={<S.Dialog sx={{ width: modalSize }} />}
        {...(rest as Ariakit.DialogProps)}
      >
        {children}
        {/* If onConfirm is provided, render the Confirm button */}
        {onConfirm && (
          <div
            style={{ display: "flex", justifyContent: "flex-end", gap: "1rem" }}
          >
            <button onClick={rest.onClose}>Cancel</button>
            <button onClick={onConfirm}>Confirm</button>
          </div>
        )}
      </Ariakit.Dialog>
    );
  },
);

export const Modal = Object.assign(ModalComponent, { Header });
