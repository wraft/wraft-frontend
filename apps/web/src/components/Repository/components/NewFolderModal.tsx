import React, { useState } from 'react';
import { Box, Flex, Button, Text, Modal, Field, InputText } from '@wraft/ui';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';

import { validateFolderName } from '../utils/validationUtils';

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
    setError,
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
    } catch (error: any) {
      setError('name', {
        type: 'manual',
        message: 'Folder already exists',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal open={isOpen} onClose={onClose} ariaLabel="Create new folder">
      <Box px="md">
        <Text as="h3" mb="lg">
          Create New Folder
        </Text>
        <Box as="form" onSubmit={handleSubmit(handleFormSubmit)} w="360px">
          <Box mb="md">
            <Field label="Folder Name" required error={errors?.name?.message}>
              <InputText
                {...register('name', {
                  required: 'Folder name is required',
                  validate: (value: string) => {
                    const validation = validateFolderName(value);
                    return validation.isValid || validation.error;
                  },
                })}
                placeholder="Enter folder name"
              />
            </Field>
          </Box>
          <Flex gap="sm" mt="sm">
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'Creating...' : 'Create Folder'}
            </Button>
            <Button variant="secondary" onClick={onClose} type="button">
              Cancel
            </Button>
          </Flex>
        </Box>
      </Box>
    </Modal>
  );
};
