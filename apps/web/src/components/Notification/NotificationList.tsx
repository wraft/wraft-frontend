import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { Pagination, Table, Box, Text } from '@wraft/ui';
import styled from '@xstyled/emotion';

import { TimeAgo } from 'common/Atoms';
import { fetchAPI } from 'utils/models';
import { formatNotificationMessage } from 'utils/socketUtils';

export interface IPageMeta {
  pageNumber: number;
  totalEntries: number;
  totalPages: number;
}

export interface Notification {
  message: string;
  type: string;
  updatedAt: string;
}

export const NotificationWrapper = styled(Box)``;

const NotificationList = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [paginationMeta, setPaginationMeta] = useState<IPageMeta | null>(null);
  const [currentPage, setCurrentPage] = useState<number>(1);

  const router = useRouter();

  useEffect(() => {
    fetchNotifications(currentPage);
  }, [currentPage]);

  const fetchNotifications = async (page: number) => {
    setIsLoading(true);
    try {
      const query = `sort=inserted_at_desc&page=${page}`;
      const data: any = await fetchAPI(`notifications?${query}`);
      setNotifications(data.notifications);
      setPaginationMeta({
        pageNumber: data.page_number,
        totalEntries: data.total_entries,
        totalPages: data.total_pages,
      });
    } catch (error) {
      console.error('Error fetching notification:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage);
    router.push(
      {
        pathname: router.pathname,
        query: { ...router.query, page: newPage },
      },
      undefined,
      { shallow: true },
    );
  };

  const columns = [
    {
      id: 'message',
      header: 'Message',
      accessorKey: 'message',
      enableSorting: false,
      size: 250,
      cell: ({ row }: any) => (
        <Text
          dangerouslySetInnerHTML={{
            __html: row.original?.message,
          }}
        />
      ),
    },
    {
      id: 'type',
      header: 'Type',
      accessorKey: 'type',
      enableSorting: false,
      size: 250,
      cell: ({ row }: any) => <Text>{row.original?.event_type}</Text>,
    },
    {
      id: 'updatedAt',
      header: 'Last Updated',
      accessorKey: 'inserted_at',
      enableSorting: false,
      cell: ({ row }: any) =>
        row.original.inserted_at && (
          <TimeAgo time={row.original?.inserted_at} />
        ),
    },
  ];

  return (
    <NotificationWrapper py="lg" px="lg" w="100%">
      <Table
        data={notifications}
        columns={columns}
        isLoading={isLoading}
        emptyMessage="No Notifications yet."
      />
      {paginationMeta && paginationMeta.totalPages > 1 && (
        <Box mx={0} mt={3}>
          <Pagination
            totalPage={paginationMeta.totalPages}
            initialPage={currentPage}
            onPageChange={handlePageChange}
            totalEntries={paginationMeta.totalEntries}
          />
        </Box>
      )}
    </NotificationWrapper>
  );
};

export default NotificationList;
