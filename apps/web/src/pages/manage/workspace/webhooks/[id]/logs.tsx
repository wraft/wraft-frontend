import React, { useEffect, useState } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { Box, Flex, Text, Table, Pagination, Button, Grid } from '@wraft/ui';
import {
  ArrowLeftIcon,
  CheckCircleIcon,
  XCircleIcon,
  ClockIcon,
} from '@phosphor-icons/react';
import toast from 'react-hot-toast';

import { webhookApi } from 'components/Webhook/webhookApi';
import { PageInner, TimeAgo } from 'common/Atoms';
import Page from 'common/PageFrame';
import PageHeader from 'common/PageHeader';
import DescriptionLinker from 'common/DescriptionLinker';
import { WebhookLog, WebhookStats, WebhookResponse } from 'schemas/webhook';

const WebhookLogsPage: React.FC = () => {
  const [webhook, setWebhook] = useState<WebhookResponse | null>(null);
  const [logs, setLogs] = useState<WebhookLog[]>([]);
  const [stats, setStats] = useState<WebhookStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isStatsLoading, setIsStatsLoading] = useState(true);
  const [pageMeta, setPageMeta] = useState<{
    total_pages: number;
    total_entries: number;
    page_number: number;
  } | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [statusFilter, setStatusFilter] = useState<
    'success' | 'failed' | 'pending' | undefined
  >();

  const router = useRouter();
  const { id } = router.query;
  const webhookId = id as string;

  useEffect(() => {
    if (webhookId) {
      fetchWebhookDetails();
      fetchLogs(currentPage, statusFilter);
      fetchStats();
    }
  }, [webhookId, currentPage, statusFilter]);

  const fetchWebhookDetails = async () => {
    try {
      const data = await webhookApi.get(webhookId);
      setWebhook(data);
    } catch (error: any) {
      console.error('Error fetching webhook details:', error);
      toast.error('Failed to load webhook details');
    }
  };

  const fetchLogs = async (
    page: number,
    status?: 'success' | 'failed' | 'pending',
  ) => {
    try {
      setIsLoading(true);
      const data = await webhookApi.getLogs(webhookId, page, 20, status);
      setLogs(data.logs);
      setPageMeta({
        total_pages: data.total_pages,
        total_entries: data.total_entries,
        page_number: data.page_number,
      });
    } catch (error: any) {
      console.error('Error fetching webhook logs:', error);
      toast.error('Failed to load webhook logs');
    } finally {
      setIsLoading(false);
    }
  };

  console.log(logs);

  const fetchStats = async () => {
    try {
      setIsStatsLoading(true);
      const data = await webhookApi.getStats(webhookId);
      setStats(data);
    } catch (error: any) {
      console.error('Error fetching webhook stats:', error);
      toast.error('Failed to load webhook statistics');
    } finally {
      setIsStatsLoading(false);
    }
  };

  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage);
  };

  const handleStatusFilter = (status?: 'success' | 'failed' | 'pending') => {
    setStatusFilter(status);
    setCurrentPage(1);
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'success':
        return <CheckCircleIcon size={16} color="green" />;
      case 'failed':
        return <XCircleIcon size={16} color="red" />;
      case 'pending':
        return <ClockIcon size={16} color="orange" />;
      default:
        return <ClockIcon size={16} color="gray" />;
    }
  };

  const columns = [
    {
      id: 'status',
      header: 'Status',
      accessorKey: 'success',
      cell: ({ row }: any) => {
        const isSuccess = row.original.success;
        const hasError = row.original.error_message;
        let status: string;

        if (hasError) {
          status = 'failed';
        } else if (isSuccess) {
          status = 'success';
        } else {
          status = 'pending';
        }

        return (
          <Flex alignItems="center" gap="xs">
            {getStatusIcon(status)}
            <Text fontSize="sm" textTransform="capitalize">
              {status}
            </Text>
          </Flex>
        );
      },
      enableSorting: false,
      size: 100,
    },
    {
      id: 'event',
      header: 'Event',
      accessorKey: 'event',
      cell: ({ row }: any) => (
        <Box
          px="xs"
          py="xxs"
          bg="green.400"
          borderRadius="sm"
          fontSize="xs"
          display="inline-block">
          {row.original.event}
        </Box>
      ),
      enableSorting: false,
      size: 150,
    },
    {
      id: 'response_status',
      header: 'Response',
      accessorKey: 'response_status',
      cell: ({ row }: any) => (
        <Text fontSize="sm" fontFamily="monospace">
          {row.original.response_status || 'N/A'}
        </Text>
      ),
      enableSorting: false,
      size: 100,
    },
    {
      id: 'execution_time',
      header: 'Exec Time',
      accessorKey: 'execution_time_ms',
      cell: ({ row }: any) => (
        <Text fontSize="sm">{row.original.execution_time_ms}ms</Text>
      ),
      enableSorting: false,
      size: 100,
    },
    {
      id: 'attempt_number',
      header: 'Attempt',
      accessorKey: 'attempt_number',
      cell: ({ row }: any) => (
        <Text fontSize="sm">{row.original.attempt_number}</Text>
      ),
      enableSorting: false,
      size: 80,
    },
    {
      id: 'triggered_at',
      header: 'Triggered',
      accessorKey: 'triggered_at',
      cell: ({ row }: any) => <TimeAgo time={row.original.triggered_at} />,
      enableSorting: false,
      size: 150,
    },
    {
      id: 'error_message',
      header: 'Error',
      accessorKey: 'error_message',
      cell: ({ row }: any) => (
        <Box>
          {row.original.error_message ? (
            <Text color="red.600" fontSize="sm" maxW="200px">
              {row.original.error_message}
            </Text>
          ) : (
            <Text color="gray.500" fontSize="sm">
              -
            </Text>
          )}
        </Box>
      ),
      enableSorting: false,
      size: 200,
    },
  ];

  return (
    <>
      <Head>
        <title>{webhook?.name} - Webhook Logs | Wraft</title>
        <meta name="description" content="View webhook logs and statistics" />
      </Head>

      <Page>
        <PageHeader
          title="Webhook Logs"
          desc={
            <DescriptionLinker
              data={[
                { name: 'Manage', path: '/manage' },
                { name: 'Webhooks', path: '/manage/workspace/webhooks' },
                { name: webhook?.name || 'Loading...' },
              ]}
            />
          }>
          <Button
            variant="secondary"
            size="sm"
            onClick={() => router.push('/manage/workspace/webhooks')}>
            <ArrowLeftIcon size={16} />
            Back to Webhooks
          </Button>
        </PageHeader>

        <PageInner>
          <Box p="md" mt="md">
            {webhook && (
              <Box mb="lg" p="md" bg="gray.50" borderRadius="md">
                <Text fontWeight="heading" mb="xs" fontSize="lg">
                  {webhook.name}
                </Text>
                <Text fontSize="sm" color="gray.800" mb="xs">
                  {webhook.url}
                </Text>
                <Flex alignItems="center" gap="xs">
                  <Box
                    w="8px"
                    h="8px"
                    borderRadius="50%"
                    bg={webhook.is_active ? 'green.800' : 'gray.400'}
                  />
                  <Text fontSize="sm">
                    {webhook.is_active ? 'Active' : 'Inactive'}
                  </Text>
                </Flex>
              </Box>
            )}

            {stats && !isStatsLoading && (
              <Grid gap="md" templateColumns="repeat(4, 1fr)" mb="lg">
                <Box
                  p="md"
                  bg="white"
                  borderRadius="md"
                  border="1px solid"
                  borderColor="gray.200">
                  <Text fontSize="sm" color="gray.800" mb="xs">
                    Total Triggers
                  </Text>
                  <Text fontSize="xl" fontWeight="heading">
                    {stats.total_requests}
                  </Text>
                </Box>
                <Box
                  p="md"
                  bg="white"
                  borderRadius="md"
                  border="1px solid"
                  borderColor="gray.200">
                  <Text fontSize="sm" color="gray.800" mb="xs">
                    Success Rate
                  </Text>
                  <Text fontSize="xl" fontWeight="heading" color="green.800">
                    {stats.success_rate}%
                  </Text>
                </Box>
                <Box
                  p="md"
                  bg="white"
                  borderRadius="md"
                  border="1px solid"
                  borderColor="gray.200">
                  <Text fontSize="sm" color="gray.800" mb="xs">
                    Failed Triggers
                  </Text>
                  <Text fontSize="xl" fontWeight="heading" color="red.600">
                    {stats.failed_requests}
                  </Text>
                </Box>
                <Box
                  p="md"
                  bg="white"
                  borderRadius="md"
                  border="1px solid"
                  borderColor="gray.200">
                  <Text fontSize="sm" color="gray.800" mb="xs">
                    Avg Response Time
                  </Text>
                  <Text fontSize="xl" fontWeight="heading">
                    {Number(stats.average_response_time_ms).toFixed(2)}ms
                  </Text>
                </Box>
              </Grid>
            )}

            <Flex gap="sm" mb="md">
              <Button
                size="sm"
                variant={statusFilter === undefined ? 'primary' : 'secondary'}
                onClick={() => handleStatusFilter(undefined)}>
                All
              </Button>
              <Button
                size="sm"
                variant={statusFilter === 'success' ? 'primary' : 'secondary'}
                onClick={() => handleStatusFilter('success')}>
                Success
              </Button>
              <Button
                size="sm"
                variant={statusFilter === 'failed' ? 'primary' : 'secondary'}
                onClick={() => handleStatusFilter('failed')}>
                Failed
              </Button>
              <Button
                size="sm"
                variant={statusFilter === 'pending' ? 'primary' : 'secondary'}
                onClick={() => handleStatusFilter('pending')}>
                Pending
              </Button>
            </Flex>

            <Table
              data={logs}
              columns={columns}
              isLoading={isLoading}
              emptyMessage="No webhook logs found."
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
          </Box>
        </PageInner>
      </Page>
    </>
  );
};

export default WebhookLogsPage;
