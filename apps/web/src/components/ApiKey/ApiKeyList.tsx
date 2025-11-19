import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import toast from 'react-hot-toast';
import { Box, Flex, Text, Table, Pagination, Button, Modal } from '@wraft/ui';
import {
  PencilIcon,
  TrashIcon,
  EyeIcon,
  CopyIcon,
  PowerIcon,
} from '@phosphor-icons/react';

import { TimeAgo } from 'common/Atoms';
import ConfirmDelete from 'common/ConfirmDelete';
import { ApiKeyResponse, ApiKeyListResponse } from 'schemas/apiKey';
import { usePermission } from 'utils/permissions';

import {
  apiKeyService,
  formatApiKey,
  getStatusVariant,
  getStatusText,
} from './apiKeyService';

interface ApiKeyListProps {
  onEdit?: (apiKeyId: string) => void;
  onRefresh?: () => void;
  refreshKey?: number;
}

const ApiKeyList: React.FC<ApiKeyListProps> = ({
  onEdit,
  onRefresh,
  refreshKey,
}) => {
  const [apiKeys, setApiKeys] = useState<ApiKeyResponse[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [pageMeta, setPageMeta] = useState<{
    total_pages: number;
    total_entries: number;
    page_number: number;
  } | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [apiKeyToDelete, setApiKeyToDelete] = useState<ApiKeyResponse | null>(
    null,
  );
  const [isToggling, setIsToggling] = useState<string | null>(null);

  const router = useRouter();
  const { hasPermission } = usePermission();
  const canManageApiKeys = hasPermission('api_key', 'manage');

  useEffect(() => {
    fetchApiKeys(currentPage);
  }, [currentPage, refreshKey]);

  const fetchApiKeys = async (page: number) => {
    try {
      setIsLoading(true);
      const data: ApiKeyListResponse = await apiKeyService.list(page);
      setApiKeys(data.api_keys);
      setPageMeta({
        total_pages: data.total_pages,
        total_entries: data.total_entries,
        page_number: data.page_number,
      });
    } catch (error: any) {
      toast.error(error?.message?.errors || 'Failed to load API keys');
    } finally {
      setIsLoading(false);
    }
  };

  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage);
  };

  const handleView = (apiKey: ApiKeyResponse) => {
    router.push(`/manage/workspace/api-keys/${apiKey.id}`);
  };

  const handleEdit = (apiKey: ApiKeyResponse) => {
    if (onEdit) {
      onEdit(apiKey.id);
    }
  };

  const handleDelete = (apiKey: ApiKeyResponse) => {
    setApiKeyToDelete(apiKey);
    setIsDeleteModalOpen(true);
  };

  const confirmDelete = async () => {
    if (!apiKeyToDelete) return;

    try {
      await apiKeyService.delete(apiKeyToDelete.id);
      toast.success('API key deleted successfully');
      setIsDeleteModalOpen(false);
      setApiKeyToDelete(null);
      fetchApiKeys(currentPage);
      onRefresh?.();
    } catch (error: any) {
      toast.error(error?.message?.errors || 'Failed to delete API key');
    }
  };

  const cancelDelete = () => {
    setIsDeleteModalOpen(false);
    setApiKeyToDelete(null);
  };

  const handleToggle = async (apiKey: ApiKeyResponse) => {
    try {
      setIsToggling(apiKey.id);
      await apiKeyService.toggle(apiKey.id);
      toast.success(
        `API key ${apiKey.is_active ? 'disabled' : 'enabled'} successfully`,
      );
      fetchApiKeys(currentPage);
      onRefresh?.();
    } catch (error: any) {
      toast.error(error?.message?.errors || 'Failed to toggle API key status');
    } finally {
      setIsToggling(null);
    }
  };

  const handleCopyKey = (keyPrefix: string) => {
    const displayKey = formatApiKey(keyPrefix);
    navigator.clipboard.writeText(displayKey);
    toast.success('API key prefix copied to clipboard');
  };

  const columns = [
    {
      id: 'name',
      header: 'NAME',
      cell: ({ row }: any) => (
        <Box>
          <Text fontWeight="medium">{row.original.name}</Text>
          <Flex align="center" gap="xs" mt="xs">
            <Text fontSize="sm" color="gray">
              {formatApiKey(row.original.key_prefix)}
            </Text>
            <Button
              size="xs"
              variant="ghost"
              onClick={(e: React.MouseEvent) => {
                e.stopPropagation();
                handleCopyKey(row.original.key_prefix);
              }}>
              <CopyIcon size={12} />
            </Button>
          </Flex>
        </Box>
      ),
      enableSorting: false,
      size: 250,
    },
    {
      id: 'status',
      header: 'STATUS',
      cell: ({ row }: any) => {
        const variant = getStatusVariant(
          row.original.is_active,
          row.original.expires_at,
        );
        const statusText = getStatusText(
          row.original.is_active,
          row.original.expires_at,
        );

        return (
          <Text
            color={
              variant === 'success'
                ? 'green.800'
                : variant === 'warning'
                  ? 'orange.600'
                  : 'red.800'
            }>
            {statusText}
          </Text>
        );
      },
      enableSorting: false,
      size: 100,
    },
    {
      id: 'usage',
      header: 'USAGE',
      cell: ({ row }: any) => (
        <Box>
          <Text fontWeight="medium">{row.original.usage_count}</Text>
          <Text fontSize="sm" color="gray">
            {row.original.rate_limit}/hr limit
          </Text>
        </Box>
      ),
      enableSorting: false,
      size: 120,
    },
    {
      id: 'expires_at',
      header: 'EXPIRES',
      cell: ({ row }: any) => {
        if (!row.original.expires_at) {
          return <Text color="text-secondary">Never</Text>;
        }
        const expiryDate = new Date(row.original.expires_at);
        const now = new Date();
        const isExpired = expiryDate < now;

        return (
          <Box>
            <TimeAgo time={row.original.expires_at} />
            {isExpired && <Text color="red.600">Expired</Text>}
          </Box>
        );
      },
      enableSorting: false,
      size: 150,
    },
    {
      id: 'last_used',
      header: 'LAST USED',
      cell: ({ row }: any) =>
        row.original.last_used_at ? (
          <TimeAgo time={row.original.last_used_at} />
        ) : (
          <Text color="gray">Never</Text>
        ),
      enableSorting: false,
      size: 150,
    },
    {
      id: 'created',
      header: 'CREATED',
      cell: ({ row }: any) => <TimeAgo time={row.original.inserted_at} />,
      enableSorting: false,
      size: 150,
    },
    {
      id: 'actions',
      header: 'ACTIONS',
      cell: ({ row }: any) => (
        <Flex gap="xs">
          <Button
            size="sm"
            variant="secondary"
            onClick={() => handleView(row.original)}
            title="View details">
            <EyeIcon size={14} />
          </Button>
          {canManageApiKeys && (
            <Button
              size="sm"
              variant="secondary"
              onClick={() => handleToggle(row.original)}
              loading={isToggling === row.original.id}
              title={row.original.is_active ? 'Disable' : 'Enable'}>
              <PowerIcon
                size={14}
                weight={row.original.is_active ? 'fill' : 'regular'}
              />
            </Button>
          )}
          {canManageApiKeys && (
            <Button
              size="sm"
              variant="secondary"
              onClick={() => handleEdit(row.original)}
              title="Edit">
              <PencilIcon size={14} />
            </Button>
          )}
          {canManageApiKeys && (
            <Button
              size="sm"
              variant="secondary"
              onClick={() => handleDelete(row.original)}
              title="Delete">
              <TrashIcon size={14} />
            </Button>
          )}
        </Flex>
      ),
      enableSorting: false,
      size: 200,
    },
  ];

  return (
    <Box>
      <Table
        data={apiKeys}
        columns={columns}
        isLoading={isLoading}
        emptyMessage="No API keys created yet. Create one to get started with third-party integrations."
        skeletonRows={10}
      />

      {pageMeta && pageMeta.total_pages > 1 && (
        <Box mt="md">
          <Pagination
            totalPage={pageMeta.total_pages}
            initialPage={currentPage}
            onPageChange={handlePageChange}
            totalEntries={pageMeta.total_entries}
          />
        </Box>
      )}

      <Modal
        open={isDeleteModalOpen}
        onClose={cancelDelete}
        size="sm"
        ariaLabel="Delete API Key Confirmation">
        <ConfirmDelete
          setOpen={setIsDeleteModalOpen}
          onConfirmDelete={confirmDelete}
          title="Delete API Key?"
          text={`Are you sure you want to delete "${apiKeyToDelete?.name}"? This action cannot be undone. All applications using this API key will immediately lose access.`}
        />
      </Modal>
    </Box>
  );
};

export default ApiKeyList;
