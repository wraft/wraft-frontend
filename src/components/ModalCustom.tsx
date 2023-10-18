import React, { ReactNode } from 'react';
import Modal from 'react-modal';

interface props {
  children: ReactNode;
  isOpen: boolean;
  setOpen: any;
  varient?: 'left' | 'right' | 'center';
  borderRadius?: number;
}

const ModalCustom = ({
  children,
  isOpen,
  setOpen,
  varient,
  borderRadius,
}: props) => {
  React.useEffect(() => {
    // Set the app element to document.body when the component mounts (client-side).
    Modal.setAppElement(document.body);
  }, []);
  if (!varient || varient === 'center') {
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
            background: 'white',
            minWidth: '100px',
            minHeight: '100px',
            width: 'fit-content',
            height: 'fit-content',
            left: '50%',
            top: '50%',
            transform: 'translate(-50%, -50%)',
            borderRadius: borderRadius ? borderRadius : 4,
            padding: '0px',
          },
        }}>
        {children}
      </Modal>
    );
  } else if (varient === 'right') {
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
            maxWidth: '556px',
            right: '0px',
            top: '0px',
            borderRadius: '0px',
            padding: '0px',
          },
        }}>
        {children}
      </Modal>
    );
  } else if (varient === 'left') {
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
            marginRight: 'auto',
            minWidth: '582px',
            width: '40%',
            height: '100%',
            left: '0px',
            top: '0px',
            borderRadius: '0px',
            padding: '0px',
          },
        }}>
        {children}
      </Modal>
    );
  }
};

export default ModalCustom;
