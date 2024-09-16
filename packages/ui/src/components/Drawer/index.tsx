import * as Ariakit from '@ariakit/react';
import React, { forwardRef } from 'react';

import { Title, Header } from './Title';
import * as S from './styles';

export type Placement = 'top' | 'right' | 'bottom' | 'left';

export interface DrawerOptions extends Ariakit.DialogOptions {
  children: React.ReactNode;
  placement?: Placement;
  withBackdrop?: boolean;
}

const DrawerComponent = forwardRef<HTMLDivElement, DrawerOptions>(
  ({ children, hideOnInteractOutside = true, placement = 'right', store, withBackdrop = true, open, ...rest }, ref) => {
    return (
      <Ariakit.Dialog
        backdrop={withBackdrop ? <S.Backdrop hideOnInteractOutside={hideOnInteractOutside} /> : false}
        hideOnInteractOutside={hideOnInteractOutside}
        modal={withBackdrop}
        ref={ref}
        render={<S.Drawer placement={placement} />}
        store={store}
        open={open}
        {...(rest as Ariakit.DialogProps)}>
        {open && <>{children}</>}
      </Ariakit.Dialog>
    );
  },
);

export type UseDrawer = Ariakit.DialogStore;
export type UseDrawerProps = Ariakit.DialogStoreProps;
export type UseDrawerState = Ariakit.DialogStoreState;

export function useDrawer(options: UseDrawerProps = {}): UseDrawer {
  const dialog = Ariakit.useDialogStore({ animated: true, ...options });

  return dialog;
}

export const Drawer = Object.assign(DrawerComponent, { Title, Header });
