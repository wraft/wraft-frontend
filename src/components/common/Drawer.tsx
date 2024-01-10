import { Dialog, DialogHeading, useDialogStore, DialogDismiss } from "@ariakit/react";
import { Box } from "theme-ui";
import { motion } from "framer-motion";

type Props = {
  open: boolean;
  setOpen: (open: boolean) => void | undefined;
  children: React.ReactNode;
  heading?:any
  footer?:any
};

const drawerVariants = {
  closed: {
    x: "100%",
    transition: {
      type: "spring",
      duration: 0.4,
    },
  },
  open: {
    x: 0,
    transition: {
      type: "spring",
      duration: 0.4,
    },
  },
};

export function Drawer({ open, setOpen, children, heading, footer }: Props) {
  const dialog = useDialogStore({ animated: true, open, setOpen });

  return (
    <>
        <Dialog
          store={dialog}
          backdrop={<div style={{backgroundColor:'rgba(0, 0, 0, 0.40)',opacity:10,transitionDuration:"150ms"}} />}
          >
          <motion.div
        variants={drawerVariants}
        initial="closed"
        animate={open ? "open" : "closed"}
        style={{
          position: "fixed",
          top: 0,
          right: 0,
          zIndex: 50,
          width: "582px",
          height: "100%",
          background: '#FFF',
          padding: "0px 32px",
          borderLeft: "1px solid #E4E9EF"
        }}
      >
            <Box>
              <DialogHeading className="font-medium text-xl">
                {heading}
              </DialogHeading>
              {children}
              <DialogDismiss>
                {footer}
              </DialogDismiss>
            </Box>
          </motion.div>
        </Dialog>
    </>
  );
}
