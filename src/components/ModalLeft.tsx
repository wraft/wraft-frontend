import React, { ReactNode } from 'react';
import Modal from 'react-modal';

interface props {
  children: ReactNode;
  isOpen: boolean;
  setOpen: any;
}

const ModalLeft = ({ children, isOpen, setOpen }: props) => {
  React.useEffect(() => {
    // Set the app element to document.body when the component mounts (client-side).
    Modal.setAppElement(document.body);
  }, []);
  return (
    <Modal
      shouldCloseOnOverlayClick={true}
      onRequestClose={() => setOpen(false)}
      isOpen={isOpen}
      style={{
        overlay: {
          backgroundColor: 'rgba(0, 0, 0, 0.50)',
        },
        content: {
          marginLeft: 'auto',
          minWidth: '582px',
          width: '40%',
          height: '100%',
          right: '0px',
          top: '0px',
          borderRadius: '0px',
          padding: '0px',
        },
      }}>
      {children}
    </Modal>
  );
};

export default ModalLeft;
