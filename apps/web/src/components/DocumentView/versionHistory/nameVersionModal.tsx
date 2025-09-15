import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Modal, Button, Text, InputText, Flex, Box } from '@wraft/ui';

const versionNameSchema = z.object({
  name: z
    .string()
    .min(1, 'Version name is required')
    .max(100, 'Version name must be 100 characters or less')
    .trim(),
});

type VersionNameFormData = z.infer<typeof versionNameSchema>;

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
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting, isValid },
    watch,
  } = useForm<VersionNameFormData>({
    resolver: zodResolver(versionNameSchema),
    defaultValues: {
      name: defaultName,
    },
    mode: 'onChange',
  });

  useEffect(() => {
    if (isOpen) {
      reset({ name: defaultName });
    }
  }, [isOpen, defaultName, reset]);

  const onSubmit = async (data: VersionNameFormData) => {
    try {
      await onSaveVersion(data.name);
      onClose();
    } catch (error) {
      console.error('Failed to save version name:', error);
    }
  };

  const handleClose = () => {
    if (!isSubmitting) {
      reset({ name: defaultName });
      onClose();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && isValid && !isSubmitting) {
      handleSubmit(onSubmit)();
    }
    if (e.key === 'Escape') {
      handleClose();
    }
  };

  const nameValue = watch('name');

  return (
    <Modal
      open={isOpen}
      ariaLabel="Name current version"
      onClose={handleClose}
      size="sm">
      <Box p="sm" minWidth="400px" maxWidth="500px">
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
              {...register('name')}
              onKeyDown={handleKeyDown}
              placeholder="Enter version name"
              size="lg"
              fontSize="md"
              px="md"
              py="sm"
              borderRadius="md"
              borderWidth="2px"
              borderColor={errors.name ? 'red.300' : 'primary.200'}
              disabled={isSubmitting}
            />
            {errors.name && (
              <Text fontSize="sm" color="red.500" mt="xs">
                {errors.name.message}
              </Text>
            )}
          </Box>

          <Flex justify="flex-end" gap="sm" mt="md">
            <Button
              variant="ghost"
              onClick={handleClose}
              disabled={isSubmitting}
              size="md">
              Cancel
            </Button>
            <Button
              onClick={handleSubmit(onSubmit)}
              loading={isSubmitting}
              disabled={!isValid || !nameValue?.trim() || isSubmitting}
              size="md">
              Save
            </Button>
          </Flex>
        </Flex>
      </Box>
    </Modal>
  );
}
