import React, { useState } from 'react';
import { Button, Modal } from '@wraft/ui';

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
      <Button variant="primary" onClick={onInvite}>
        invite
      </Button>
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
