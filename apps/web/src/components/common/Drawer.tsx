import {
  Dialog,
  DialogHeading,
  useDialogStore,
  DialogDismiss,
} from '@ariakit/react';
import { motion } from 'framer-motion';
import { Box } from 'theme-ui';

type Props = {
  open: boolean;
  setOpen: (open: boolean) => void | undefined;
  children: React.ReactNode;
  heading?: any;
  footer?: any;
  disableHideOnInteractOutside?: any;
};

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

export function Drawer({
  open,
  setOpen,
  children,
  heading,
  footer,
  disableHideOnInteractOutside = false,
}: Props) {
  
  const dialog = useDialogStore({ animated: true, open, setOpen });

  return (
    <>
      <Dialog
        hideOnInteractOutside={!disableHideOnInteractOutside}
        store={dialog}
        as={Box}
        backdrop={<Box variant="layout.drawerBackdrop" />}>
        <motion.div
          variants={drawerVariants}
          initial="closed"
          animate={open ? 'open' : 'closed'}
          style={{
            position: 'fixed',
            top: 0,
            right: 0,
            zIndex: 50,
            width: '582px',
            height: '100%',
            background: '#FFF',
            padding: '0px',
            borderLeft: '1px solid #E4E9EF',
          }}>
          <Box>
            {heading && (
              <DialogHeading className="font-medium text-xl">
                {heading}
              </DialogHeading>
            )}
            {children}
            <Box sx={{ display: 'none' }}>
              <DialogDismiss>{footer}</DialogDismiss>
            </Box>
          </Box>
        </motion.div>
      </Dialog>
    </>
  );
}
