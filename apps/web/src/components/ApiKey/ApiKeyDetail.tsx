import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import toast from 'react-hot-toast';
import { Box, Flex, Text, Button, Modal, Skeleton, Grid } from '@wraft/ui';
import {
  ArrowLeftIcon,
  PencilIcon,
  TrashIcon,
  PowerIcon,
  ClockIcon,
  WarningIcon,
} from '@phosphor-icons/react';

import { TimeAgo } from 'common/Atoms';
import ConfirmDelete from 'common/ConfirmDelete';
import { ApiKeyResponse } from 'schemas/apiKey';
import { usePermission } from 'utils/permissions';

import {
  apiKeyService,
  formatApiKey,
  getStatusVariant,
  getStatusText,
} from './apiKeyService';

interface ApiKeyDetailProps {
  apiKeyId: string;
  onEdit?: () => void;
}

const ApiKeyDetail: React.FC<ApiKeyDetailProps> = ({ apiKeyId, onEdit }) => {
  const [apiKey, setApiKey] = useState<ApiKeyResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isToggling, setIsToggling] = useState(false);

  const router = useRouter();
  const { hasPermission } = usePermission();
  const canManageApiKeys = hasPermission('api_key', 'manage');

  useEffect(() => {
    if (apiKeyId) {
      fetchApiKey();
    }
  }, [apiKeyId]);

  const fetchApiKey = async () => {
    try {
      setIsLoading(true);
      const data = await apiKeyService.get(apiKeyId);
      setApiKey(data);
    } catch (error: any) {
      toast.error(error?.message?.errors || 'Failed to load API key');
      router.push('/manage/workspace/api-keys');
    } finally {
      setIsLoading(false);
    }
  };

  const handleBack = () => {
    router.push('/manage/workspace/api-keys');
  };

  const handleEdit = () => {
    if (onEdit) {
      onEdit();
    }
  };

  const handleDelete = () => {
    setIsDeleteModalOpen(true);
  };

  const confirmDelete = async () => {
    if (!apiKey) return;

    try {
      await apiKeyService.delete(apiKey.id);
      toast.success('API key deleted successfully');
      setIsDeleteModalOpen(false);
      router.push('/manage/workspace/api-keys');
    } catch (error: any) {
      toast.error(error?.message?.errors || 'Failed to delete API key');
      setIsDeleteModalOpen(false);
    }
  };

  const cancelDelete = () => {
    setIsDeleteModalOpen(false);
  };

  const handleToggle = async () => {
    if (!apiKey) return;

    try {
      setIsToggling(true);
      await apiKeyService.toggle(apiKey.id);
      toast.success(
        `API key ${apiKey.is_active ? 'disabled' : 'enabled'} successfully`,
      );
      fetchApiKey();
    } catch (error: any) {
      toast.error(error?.message?.errors || 'Failed to toggle API key status');
    } finally {
      setIsToggling(false);
    }
  };

  if (isLoading) {
    return (
      <Box p="lg">
        <Box mb="lg">
          <Skeleton height="40px" />
        </Box>
        <Box mb="md">
          <Skeleton height="200px" />
        </Box>
        <Box mb="md">
          <Skeleton height="200px" />
        </Box>
        <Skeleton height="200px" />
      </Box>
    );
  }

  if (!apiKey) {
    return null;
  }

  const statusVariant = getStatusVariant(apiKey.is_active, apiKey.expires_at);
  const statusText = getStatusText(apiKey.is_active, apiKey.expires_at);

  return (
    <>
      <Box p="lg">
        <Flex justifyContent="space-between" alignItems="center" mb="xl">
          <Flex alignItems="center" gap="md">
            <Button variant="ghost" size="sm" onClick={handleBack}>
              <ArrowLeftIcon size={20} />
            </Button>
            <Box>
              <Text fontSize="2xl" fontWeight="heading">
                {apiKey.name}
              </Text>
              <Text fontSize="sm" color="gray">
                API Key Details
              </Text>
            </Box>
          </Flex>

          <Flex gap="sm" bg="background-primary">
            {canManageApiKeys && (
              <Button
                variant="secondary"
                size="sm"
                onClick={handleToggle}
                loading={isToggling}>
                <PowerIcon size={16} />
                {apiKey.is_active ? 'Disable' : 'Enable'}
              </Button>
            )}
            {canManageApiKeys && (
              <Button variant="secondary" size="sm" onClick={handleEdit}>
                <PencilIcon size={16} />
                Edit
              </Button>
            )}
            {canManageApiKeys && (
              <Button variant="secondary" size="sm" onClick={handleDelete}>
                <TrashIcon size={16} />
                Delete
              </Button>
            )}
          </Flex>
        </Flex>

        {!apiKey.is_active && (
          <Box
            mb="lg"
            p="md"
            style={{
              backgroundColor: 'var(--color-orange-100)',
              border: '1px solid var(--color-orange-300)',
              borderRadius: '8px',
            }}>
            <Flex alignItems="center" gap="sm">
              <WarningIcon size={20} weight="fill" />
              <Text>
                This API key is currently disabled and will not work for API
                requests.
              </Text>
            </Flex>
          </Box>
        )}

        {apiKey.expires_at && new Date(apiKey.expires_at) < new Date() && (
          <Box
            mb="lg"
            p="md"
            style={{
              backgroundColor: 'var(--color-red-100)',
              border: '1px solid var(--color-red-300)',
              borderRadius: '8px',
            }}>
            <Flex alignItems="center" gap="sm">
              <ClockIcon size={20} weight="fill" />
              <Text>
                This API key has expired and will not work for API requests.
              </Text>
            </Flex>
          </Box>
        )}

        <Grid templateColumns="repeat(2, 1fr)" gap="lg">
          <Box
            mb="lg"
            p="lg"
            border="1px solid border"
            borderRadius="lg"
            bg="background-primary">
            <Flex direction="column" gap="lg">
              <Flex justifyContent="space-between" alignItems="start">
                <Box flex={1}>
                  <Text fontSize="sm" color="text-secondary" mb="xs">
                    API Key (Prefix)
                  </Text>
                  <Flex alignItems="center" gap="sm">
                    <Text>{formatApiKey(apiKey.key_prefix)}</Text>
                  </Flex>
                </Box>

                <Box
                  px="md"
                  py="xs"
                  borderRadius="md"
                  bg={
                    statusVariant === 'success'
                      ? 'green.300'
                      : statusVariant === 'warning'
                        ? 'orange.300'
                        : 'red.300'
                  }>
                  <Text fontSize="sm" fontWeight="medium">
                    {statusText}
                  </Text>
                </Box>
              </Flex>

              <Box>
                <Text fontSize="sm" color="text-secondary" mb="xs">
                  Usage
                </Text>
                <Text fontWeight="medium" fontSize="lg">
                  {apiKey.usage_count.toLocaleString()} requests
                </Text>
              </Box>

              <Box>
                <Text fontSize="sm" color="text-secondary" mb="xs">
                  Rate Limit
                </Text>
                <Text fontWeight="medium">
                  {apiKey.rate_limit.toLocaleString()} requests per hour
                </Text>
              </Box>

              {apiKey.last_used_at && (
                <Box>
                  <Text fontSize="sm" color="text-secondary" mb="xs">
                    Last Used
                  </Text>
                  <TimeAgo time={apiKey.last_used_at} />
                </Box>
              )}

              {apiKey.expires_at && (
                <Box>
                  <Text fontSize="sm" color="text-secondary" mb="xs">
                    Expires
                  </Text>
                  <TimeAgo time={apiKey.expires_at} />
                </Box>
              )}
            </Flex>
          </Box>

          <Box
            mb="lg"
            p="lg"
            bg="background-primary"
            border="1px solid border"
            borderRadius="lg">
            <Text fontSize="lg" fontWeight="heading" mb="md">
              User Information
            </Text>

            <Flex direction="column" gap="md">
              <Box>
                <Text fontSize="sm" color="text-secondary" mb="xs">
                  Associated User
                </Text>
                <Text fontWeight="medium">{apiKey.user.name}</Text>
                <Text fontSize="sm" color="text-secondary">
                  {apiKey.user.email}
                </Text>
              </Box>

              <Box>
                <Text fontSize="sm" color="text-secondary" mb="xs">
                  Created By
                </Text>
                <Text fontWeight="medium">{apiKey.created_by.name}</Text>
                <Text fontSize="sm" color="text-secondary">
                  {apiKey.created_by.email}
                </Text>
              </Box>

              <Box>
                <Text fontSize="sm" color="text-secondary" mb="xs">
                  Created
                </Text>
                <TimeAgo time={apiKey.inserted_at} />
              </Box>

              <Box>
                <Text fontSize="sm" color="text-secondary" mb="xs">
                  Last Updated
                </Text>
                <TimeAgo time={apiKey.updated_at} />
              </Box>
            </Flex>
          </Box>
        </Grid>
        <Box
          mb="lg"
          p="lg"
          bg="background-primary"
          border="1px solid border"
          borderRadius="lg">
          <Text fontSize="lg" fontWeight="heading" mb="md">
            Restrictions
          </Text>

          <Box>
            <Text fontWeight="medium" mb="sm">
              IP Whitelist
            </Text>
            {apiKey.ip_whitelist && apiKey.ip_whitelist.length > 0 ? (
              <Flex direction="column" gap="xs">
                {apiKey.ip_whitelist.map((ip) => (
                  <Text key={ip} fontSize="sm">
                    {ip}
                  </Text>
                ))}
              </Flex>
            ) : (
              <Text color="text-secondary" fontSize="sm">
                All IP addresses (no restrictions)
              </Text>
            )}
          </Box>
        </Box>

        {apiKey.metadata && Object.keys(apiKey.metadata).length > 0 && (
          <Box
            mb="lg"
            p="lg"
            border="1px solid border"
            borderRadius="lg"
            bg="background-primary">
            <Text fontSize="lg" fontWeight="heading" mb="md">
              Metadata
            </Text>
            <Box
              p="md"
              bg="background-secondary"
              borderRadius="md"
              overflow="auto">
              <pre style={{ margin: 0 }}>
                {JSON.stringify(apiKey.metadata, null, 2)}
              </pre>
            </Box>
          </Box>
        )}
      </Box>

      <Modal
        open={isDeleteModalOpen}
        onClose={cancelDelete}
        size="sm"
        ariaLabel="Delete API Key Confirmation">
        <ConfirmDelete
          setOpen={setIsDeleteModalOpen}
          onConfirmDelete={confirmDelete}
          title="Delete API Key?"
          text={`Are you sure you want to delete "${apiKey?.name}"? This action cannot be undone. All applications using this API key will immediately lose access.`}
        />
      </Modal>
    </>
  );
};

export default ApiKeyDetail;
