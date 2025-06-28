import React, { useState, ChangeEvent } from 'react';
import { Box, Flex, Button, Text, Modal } from '@wraft/ui';
import { Input } from 'theme-ui';
// import { Input } from 'common/Atoms';

interface RenameModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (newName: string) => Promise<void>;
  currentName: string;
  itemType: 'file' | 'folder';
}

export const RenameModal: React.FC<RenameModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  currentName,
  itemType,
}) => {
  const [newName, setNewName] = useState(currentName);
  const [isLoading, setIsLoading] = useState(false);

  const handleConfirm = async () => {
    if (!newName.trim()) return;

    setIsLoading(true);
    try {
      await onConfirm(newName.trim());
      onClose();
    } catch (error) {
      console.error('Error renaming item:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Modal ariaLabel={`Rename ${itemType}`} open={isOpen} onClose={onClose}>
      <Box p="4">
        <Text as="h3" mb="3">
          Rename {itemType}
        </Text>
        <Box mb="4">
          <Input
            value={newName}
            onChange={(e: ChangeEvent<HTMLInputElement>) =>
              setNewName(e.target.value)
            }
            placeholder={`Enter new ${itemType} name`}
            // autoFocus
          />
        </Box>
        <Flex gap="3">
          <Button
            variant="primary"
            onClick={handleConfirm}
            disabled={!newName.trim() || isLoading}>
            Rename
          </Button>
          <Button variant="tertiary" onClick={onClose}>
            Cancel
          </Button>
        </Flex>
      </Box>
    </Modal>
  );
};
