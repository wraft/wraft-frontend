import React, { useState } from 'react';
import { useRouter } from 'next/router';
import {
  Box,
  Modal,
  Flex,
  Text,
  Button,
  Field,
  InputText,
  Textarea,
} from '@wraft/ui';
import { FloppyDiskIcon, Info, X } from '@phosphor-icons/react';
import toast from 'react-hot-toast';

import { postAPI } from 'utils/models';

interface WorkflowCreateModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const WorkflowCreateModal: React.FC<WorkflowCreateModalProps> = ({
  isOpen,
  onClose,
}) => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name.trim()) {
      toast.error('Workflow name is required');
      return;
    }

    try {
      setLoading(true);
      const workflow = await postAPI('workflows', {
        name: formData.name,
        description: formData.description || '',
        is_active: false,
        jobs: [],
        edges: [],
      });

      toast.success('Workflow created successfully!');
      router.push(`/workflows/${(workflow as any).id}`);
    } catch (error: any) {
      console.error('Failed to create workflow:', error);
      toast.error(
        error?.errors?.name?.[0] ||
          error?.message ||
          'Failed to create workflow',
      );
      setLoading(false);
    }
  };

  return (
    <Modal ariaLabel="Create New Workflow" open={isOpen} onClose={onClose}>
      <Box p={6} style={{ maxWidth: '640px', width: '100%' }}>
        <Flex justifyContent="space-between" alignItems="center" mb={6}>
          <Text fontSize="xl" fontWeight={600}>
            Create New Workflow
          </Text>
          <X size={20} weight="bold" cursor="pointer" onClick={onClose} />
        </Flex>

        <Box as="form" onSubmit={handleSubmit}>
          <Flex direction="column" gap={6}>
            <Field label="Workflow Name" required>
              <InputText
                value={formData.name}
                onChange={(e: any) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                placeholder="e.g., Age-Based Contract Selection"
                required
              />
            </Field>

            <Field label="Description">
              <Textarea
                value={formData.description}
                onChange={(e: any) =>
                  setFormData({ ...formData, description: e.target.value })
                }
                placeholder="Describe what this workflow does..."
                rows={4}
              />
            </Field>

            <Box
              bg="blue.50"
              p={4}
              borderRadius="md"
              border="1px solid"
              borderColor="blue.100">
              <Flex gap={3}>
                <Box pt={1}>
                  <Info size={20} weight="fill" color="blue.600" />
                </Box>
                <Box>
                  <Text
                    fontSize="sm"
                    fontWeight="medium"
                    color="blue.800"
                    mb={2}>
                    Next steps:
                  </Text>
                  <Text as="div" fontSize="sm" color="blue.800">
                    <ul style={{ margin: 0, paddingLeft: '1.25rem' }}>
                      <li>Add jobs (conditions, templates, etc.)</li>
                      <li>Connect jobs with edges</li>
                      <li>Configure triggers and test</li>
                    </ul>
                  </Text>
                </Box>
              </Flex>
            </Box>

            <Flex gap={3} justifyContent="flex-end" pt={4}>
              <Button
                variant="secondary"
                onClick={onClose}
                type="button"
                disabled={loading}>
                Cancel
              </Button>
              <Button
                variant="primary"
                type="submit"
                loading={loading}
                disabled={!formData.name.trim()}>
                <FloppyDiskIcon size={16} weight="fill" />
                <Text ml={1}>Create Workflow</Text>
              </Button>
            </Flex>
          </Flex>
        </Box>
      </Box>
    </Modal>
  );
};

export default WorkflowCreateModal;
