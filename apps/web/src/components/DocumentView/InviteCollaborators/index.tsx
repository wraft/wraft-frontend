import React, { useState } from 'react';
import { Box, Modal } from '@wraft/ui';
import { Share } from '@phosphor-icons/react';

import { IconFrame, UserSampleList } from 'common/Atoms';

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
      <Box>
        {/* <IconFrame>
          <Share size={18} cursor="pointer" onClick={onInvite} />
        </IconFrame> */}
        <UserSampleList />
      </Box>
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
