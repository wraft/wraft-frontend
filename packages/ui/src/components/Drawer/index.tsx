import React from 'react';
import {
  Dialog,
  DialogHeading,
  useDialogStore,
  DialogDismiss,
} from '@ariakit/react';
import * as Ariakit from '@ariakit/react'
import styled, { th, x } from '@xstyled/emotion';
import { motion } from 'framer-motion';
import { Title } from './Title';

import * as S from './styles'



export type Placement = 'top' | 'right' | 'bottom' | 'left'

export interface DrawerOptions extends Ariakit.DialogOptions<'div'> {
  children: React.ReactNode;
  placement?: Placement
  withBackdrop?: boolean
  withCloseButton?: boolean
}

// type DrawerOptions = {
//   open: boolean;
//   setOpen: (open: boolean) => void | undefined;
//   children: React.ReactNode;
//   heading?: any;
//   footer?: any;
// };

const drawerVariants = {
  closed: {
    x: '100%',
    transition: {
      type: 'spring',
      duration: 0.4,
    },
  },
  open: {
    x: 0,
    transition: {
      type: 'spring',
      duration: 0.4,
    },
  },
};

// export function Drawer({ open, setOpen, children, heading, footer }: Props) {
//   const dialog = useDialogStore({ animated: true, open, setOpen });

//   return (
//     <>
//       <Dialog
//         store={dialog}
//         >
//         <motion.div
//           variants={drawerVariants}
//           initial="closed"
//           animate={open ? 'open' : 'closed'}
//           style={{
//             position: 'fixed',
//             top: 0,
//             right: 0,
//             zIndex: 50,
//             width: '582px',
//             height: '100%',
//             background: '#FFF',
//             padding: '0px',
//             borderLeft: '1px solid #E4E9EF',
//           }}>
//           <x.div>
//             {heading && (
//               <DialogHeading className="font-medium text-xl">
//                 {heading}
//               </DialogHeading>
//             )}
//             {children}
//             <x.div>
//               <DialogDismiss>{footer}</DialogDismiss>
//             </x.div>
//           </x.div>
//         </motion.div>
//       </Dialog>
//     </>
//   );
// }


const DrawerComponent = React.forwardRef<HTMLDivElement, DrawerOptions>(
  (
    {
      children,
      hideOnInteractOutside = true,
      placement = 'right',
      store,
      withBackdrop = false,
      withCloseButton = true,
      open,
      ...rest
    },
    ref
  ) => {
    return (
      <Ariakit.Dialog
        backdrop={
          withBackdrop ? <S.Backdrop hideOnInteractOutside={hideOnInteractOutside} /> : false
        }
        hideOnInteractOutside={hideOnInteractOutside}
        modal={withBackdrop}
        ref={ref}
        render={<S.Drawer placement={placement} />}
        store={store}
        open={open}
        {...(rest as Ariakit.DialogProps<'div'>)}
      >
        {open && (
        <>
          {/* {withCloseButton && <Close />} */}
          {children}
        </>
        )}
      </Ariakit.Dialog>
    )
  }
)

export type UseDrawer = Ariakit.DialogStore
export type UseDrawerProps = Ariakit.DialogStoreProps
export type UseDrawerState = Ariakit.DialogStoreState

export function useDrawer(options: UseDrawerProps = {}): UseDrawer {
  const dialog = Ariakit.useDialogStore({ animated: true, ...options })

  return dialog
}

export const Drawer = Object.assign(DrawerComponent, {Title})