import React from 'react';
import { Box, Flex, Button, Text, Modal } from '@wraft/ui';

interface DeleteConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  itemName: string;
  itemType: 'folder' | 'file';
}

export const DeleteConfirmationModal: React.FC<
  DeleteConfirmationModalProps
> = ({ isOpen, onClose, onConfirm, itemName, itemType }) => {
  return (
    <Modal
      open={isOpen}
      onClose={onClose}
      ariaLabel={`Delete ${itemType} confirmation`}>
      <Box p="4">
        <Text as="h3" mb="3">
          Delete {itemType}
        </Text>
        <Text mb="4">
          Are you sure you want to delete {itemType} &quot;{itemName}&quot;?
          This action cannot be undone.
        </Text>
        <Flex gap="3">
          <Button variant="primary" color="error" onClick={onConfirm}>
            Delete
          </Button>
          <Button variant="tertiary" onClick={onClose}>
            Cancel
          </Button>
        </Flex>
      </Box>
    </Modal>
  );
};
