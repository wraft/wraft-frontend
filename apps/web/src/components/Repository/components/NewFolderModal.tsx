import React, { useState } from 'react';
import { Box, Flex, Button, Text, Modal, Label } from '@wraft/ui';
import { Input } from 'theme-ui';
import { useForm } from 'react-hook-form';

interface NewFolderModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: { name: string }) => Promise<void>;
}

export const NewFolderModal: React.FC<NewFolderModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
}) => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<{ name: string }>();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleFormSubmit = async (data: { name: string }) => {
    setIsSubmitting(true);
    try {
      await onSubmit(data);
      reset();
      onClose();
    } catch (error) {
      console.error('Error creating folder:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal open={isOpen} onClose={onClose} ariaLabel="Create new folder">
      <Box p="4">
        <Text as="h3" mb="3">
          Create New Folder
        </Text>
        <form onSubmit={handleSubmit(handleFormSubmit)}>
          <Box mb="4">
            <Label htmlFor="folderName">Folder Name</Label>
            <Input
              id="folderName"
              {...register('name', {
                required: 'Folder name is required',
                minLength: {
                  value: 2,
                  message: 'Folder name must be at least 2 characters',
                },
              })}
              placeholder="Enter folder name"
            />
            {errors.name && (
              <Text color="error" fontSize="sm" mt="1">
                {errors.name.message}
              </Text>
            )}
          </Box>
          <Flex gap="3">
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'Creating...' : 'Create Folder'}
            </Button>
            <Button variant="tertiary" onClick={onClose} type="button">
              Cancel
            </Button>
          </Flex>
        </form>
      </Box>
    </Modal>
  );
};
