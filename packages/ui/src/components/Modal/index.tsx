import * as Ariakit from "@ariakit/react";
import { forwardRef } from "react";

import { Header } from "./Header";
import * as S from "./styles";

export type Size = "xs" | "sm" | "md" | "lg" | "auto";

export interface ModalOptions extends Omit<Ariakit.DialogOptions, "as"> {
  ariaLabel: string;
  children: React.ReactElement;
  size?: Size;
}

const ModalComponent = forwardRef<HTMLDivElement, ModalOptions>(
  (
    {
      ariaLabel,

      backdrop = true,
      children,
      hideOnInteractOutside = true,
      open,
      ...rest
    },
    ref,
  ) => {
    const dialog = Ariakit.useDialogStore({ animated: true, open });
    // const dialog = Ariakit.useDialogStore(animated: true,)
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
        render={<S.Dialog />}
        {...(rest as Ariakit.DialogProps)}
      >
        {children}
      </Ariakit.Dialog>
    );
  },
);

// Nested exports
export const Modal = Object.assign(ModalComponent, { Header });
