import React, { useState } from 'react';
import { Modal } from '@wraft/ui';
import { Share } from '@phosphor-icons/react';

import InviteBlock from './InviteBlock';
import { useDocument } from '../DocumentContext';

const InviteCollaborators = () => {
  const { cId } = useDocument();
  const [isDialogOpen, setDialogOpen] = useState(false);
  const onInvite = () => {
    setDialogOpen(true);
  };
  return (
    <>
      <Share size={22} cursor="pointer" onClick={onInvite} />
      <Modal
        open={isDialogOpen}
        ariaLabel="confirm model"
        onClose={() => setDialogOpen(false)}>
        <InviteBlock docId={cId} />
      </Modal>
    </>
  );
};

export default InviteCollaborators;
