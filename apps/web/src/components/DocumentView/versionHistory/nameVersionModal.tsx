import React, { useState, useEffect } from 'react';
import { Modal, Button, Text, InputText, Flex, Box } from '@wraft/ui';

interface NameVersionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSaveVersion: (name: string) => Promise<void>;
  defaultName?: string;
}

export function NameVersionModal({
  isOpen,
  onClose,
  onSaveVersion,
  defaultName = 'Untitled version',
}: NameVersionModalProps) {
  const [name, setName] = useState(defaultName);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setName(defaultName);
    }
  }, [isOpen, defaultName]);

  const handleConfirm = async () => {
    if (!name.trim()) return;

    setSaving(true);
    try {
      await onSaveVersion(name.trim());
      onClose();
    } catch (error) {
      console.error('Failed to save version name:', error);
    } finally {
      setSaving(false);
    }
  };

  const handleClose = () => {
    if (!saving) {
      setName(defaultName);
      onClose();
    }
  };

  return (
    <Modal
      open={isOpen}
      ariaLabel="Name current version"
      onClose={handleClose}
      size="sm">
      <Box
        bg="white"
        borderRadius="lg"
        p="lg"
        minWidth="400px"
        maxWidth="500px"
        mx="auto"
        my="auto">
        <Flex direction="column" gap="lg">
          <Box>
            <Text
              as="h2"
              fontSize="xl"
              fontWeight="semibold"
              color="text-primary"
              mb="xs">
              Name current version
            </Text>
            <Text fontSize="sm" color="text-secondary" lineHeight="relaxed">
              Name this version to keep track of it in version history
            </Text>
          </Box>

          <Box>
            <InputText
              value={name}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setName(e.target.value)
              }
              onKeyDown={(e) => {
                if (e.key === 'Enter') handleConfirm();
                if (e.key === 'Escape') handleClose();
              }}
              placeholder="Enter version name"
              size="lg"
              fontSize="md"
              px="md"
              py="sm"
              borderRadius="md"
              borderWidth="2px"
              borderColor="primary.200"
              disabled={saving}
            />
          </Box>

          <Flex justify="flex-end" gap="sm" mt="md">
            <Button
              variant="ghost"
              onClick={handleClose}
              disabled={saving}
              size="md">
              Cancel
            </Button>
            <Button
              onClick={handleConfirm}
              loading={saving}
              disabled={!name.trim() || saving}
              size="md">
              Save
            </Button>
          </Flex>
        </Flex>
      </Box>
    </Modal>
  );
}
