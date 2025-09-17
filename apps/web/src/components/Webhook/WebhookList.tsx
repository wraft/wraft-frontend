import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import toast from 'react-hot-toast';
import { Box, Flex, Text, Table, Pagination, Button, Modal } from '@wraft/ui';
import { Pencil, Trash, Play } from '@phosphor-icons/react';

import { webhookApi } from 'components/Webhook/webhookApi';
import { TimeAgo } from 'common/Atoms';
import { WebhookResponse, WebhookListResponse } from 'schemas/webhook';
import { usePermission } from 'utils/permissions';

interface SimpleWebhookListProps {
  onEdit?: (webhookId: string) => void;
  onRefresh?: () => void;
}

const shortenUrl = (url: string, maxLength: number = 40): string => {
  if (url.length <= maxLength) return url;

  try {
    const urlObj = new URL(url);
    const domain = urlObj.hostname;
    const path = urlObj.pathname;

    if (domain.length + 10 < maxLength) {
      const remainingLength = maxLength - domain.length - 3;
      const truncatedPath =
        path.length > remainingLength
          ? path.substring(0, remainingLength) + '...'
          : path;
      return `${domain}${truncatedPath}`;
    }

    return url.substring(0, maxLength - 3) + '...';
  } catch {
    return url.substring(0, maxLength - 3) + '...';
  }
};

const SimpleWebhookList: React.FC<SimpleWebhookListProps> = ({
  onEdit,
  onRefresh,
}) => {
  const [webhooks, setWebhooks] = useState<WebhookResponse[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [pageMeta, setPageMeta] = useState<{
    total_pages: number;
    total_entries: number;
    page_number: number;
  } | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [webhookToDelete, setWebhookToDelete] =
    useState<WebhookResponse | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const router = useRouter();
  const { hasPermission } = usePermission();
  const canManageWebhooks = hasPermission('webhook', 'manage');

  useEffect(() => {
    fetchWebhooks(currentPage);
  }, [currentPage]);

  const fetchWebhooks = async (page: number) => {
    try {
      setIsLoading(true);
      const data: WebhookListResponse = await webhookApi.list(page, 20);
      setWebhooks(data.webhooks);
      setPageMeta({
        total_pages: data.total_pages,
        total_entries: data.total_entries,
        page_number: data.page_number,
      });
    } catch (error: any) {
      setIsLoading(false);
    } finally {
      setIsLoading(false);
    }
  };

  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage);
  };

  const handleDelete = (webhook: WebhookResponse) => {
    setWebhookToDelete(webhook);
    setIsDeleteModalOpen(true);
  };

  const confirmDelete = async () => {
    if (!webhookToDelete) return;

    try {
      setIsDeleting(true);
      await webhookApi.delete(webhookToDelete.id);
      setWebhooks((prevWebhooks) =>
        prevWebhooks.filter((w) => w.id !== webhookToDelete.id),
      );
      toast.success('Webhook deleted successfully');
      onRefresh?.();
      setIsDeleteModalOpen(false);
      setWebhookToDelete(null);
    } catch (error: any) {
      console.error('Error deleting webhook:', error);
      toast.error(error?.message || 'Failed to delete webhook');
    } finally {
      setIsDeleting(false);
    }
  };

  const cancelDelete = () => {
    setIsDeleteModalOpen(false);
    setWebhookToDelete(null);
  };

  const handleTest = async (webhook: WebhookResponse) => {
    try {
      await webhookApi.test(webhook.id);
      toast.success('Test webhook sent successfully');
    } catch (error: any) {
      console.error('Error testing webhook:', error);
      toast.error(error?.message || 'Failed to test webhook');
    }
  };

  const handleEditClick = (webhook: WebhookResponse) => {
    if (onEdit) {
      onEdit(webhook.id);
    } else {
      router.push(`/manage/webhooks/${webhook.id}/edit`);
    }
  };

  const handleWebhookClick = (webhook: WebhookResponse) => {
    router.push(`/manage/workspace/webhooks/${webhook.id}/logs`);
  };

  const getEventsBadges = (events: string[]) => {
    if (events.length <= 3) {
      return events.map((event) => (
        <Box
          key={event}
          px="sm"
          py="xs"
          bg="green.300"
          color="green.800"
          borderRadius="sm"
          fontSize="sm"
          display="inline-block"
          mr="xs"
          mb="xs">
          {event}
        </Box>
      ));
    }

    return (
      <Flex alignItems="center" gap="xs" flexWrap="wrap">
        {events.slice(0, 2).map((event) => (
          <Box
            key={event}
            px="sm"
            py="xxs"
            bg="green.400"
            borderRadius="sm"
            fontSize="xs">
            {event}
          </Box>
        ))}
        <Box
          px="xs"
          py="xxs"
          bg="gray.200"
          color="gray.800"
          borderRadius="sm"
          fontSize="xs">
          +{events.length - 2} more
        </Box>
      </Flex>
    );
  };

  const columns = [
    {
      id: 'name',
      header: 'NAME',
      accessorKey: 'name',
      cell: ({ row }: any) => (
        <Box>
          <Text
            fontWeight="heading"
            cursor="pointer"
            onClick={() => handleWebhookClick(row.original)}>
            {row.original.name}
          </Text>
          <Text fontSize="sm" color="text.secondary" title={row.original.url}>
            {shortenUrl(row.original.url)}
          </Text>
        </Box>
      ),
      enableSorting: false,
      size: 300,
    },
    {
      id: 'events',
      header: 'EVENTS',
      accessorKey: 'events',
      cell: ({ row }: any) => getEventsBadges(row.original.events),
      enableSorting: false,
      size: 250,
    },
    {
      id: 'status',
      header: 'STATUS',
      accessorKey: 'is_active',
      cell: ({ row }: any) => (
        <Flex alignItems="center" gap="xs">
          <Box
            w="8px"
            h="8px"
            borderRadius="50%"
            bg={row.original.is_active ? 'green.500' : 'gray.400'}
          />
          <Text fontSize="sm">
            {row.original.is_active ? 'Active' : 'Inactive'}
          </Text>
        </Flex>
      ),
      enableSorting: false,
      size: 100,
    },
    {
      id: 'last_triggered',
      header: 'LAST TRIGGERED',
      accessorKey: 'last_triggered_at',
      cell: ({ row }: any) => (
        <Box>
          {row.original.last_triggered_at ? (
            <TimeAgo time={row.original.last_triggered_at} />
          ) : (
            <Text>Never</Text>
          )}
        </Box>
      ),
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
            onClick={() => handleTest(row.original)}>
            <Play size={14} />
          </Button>
          {canManageWebhooks && (
            <Button
              size="sm"
              variant="secondary"
              onClick={() => handleEditClick(row.original)}>
              <Pencil size={14} />
            </Button>
          )}
          {canManageWebhooks && (
            <Button
              size="sm"
              variant="secondary"
              onClick={() => handleDelete(row.original)}>
              <Trash size={14} />
            </Button>
          )}
        </Flex>
      ),
      enableSorting: false,
      size: 150,
    },
  ];

  return (
    <Box>
      <Table
        data={webhooks}
        columns={columns}
        isLoading={isLoading}
        emptyMessage="No webhooks created yet."
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

      {/* Delete Confirmation Modal */}
      <Modal
        open={isDeleteModalOpen}
        onClose={cancelDelete}
        size="sm"
        ariaLabel="Delete Webhook Confirmation">
        <Box>
          <Text fontSize="xl" fontWeight="heading" mb="md">
            Are you sure you want to delete &quot;{webhookToDelete?.name}&quot;?
          </Text>
          <Text mb="lg">
            This action cannot be undone. All webhook logs and configurations
            will be permanently removed.
          </Text>
          <Flex gap="sm" justifyContent="flex-end">
            <Button
              variant="secondary"
              onClick={cancelDelete}
              disabled={isDeleting}>
              Cancel
            </Button>
            <Button
              variant="primary"
              onClick={confirmDelete}
              loading={isDeleting}
              disabled={isDeleting}>
              {isDeleting ? 'Deleting...' : 'Delete'}
            </Button>
          </Flex>
        </Box>
      </Modal>
    </Box>
  );
};

export default SimpleWebhookList;
