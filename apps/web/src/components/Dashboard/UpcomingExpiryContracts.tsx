import React, { useEffect, useState, useMemo, useCallback } from 'react';
import NextLink from 'next/link';
import { Avatar } from 'theme-ui';
import { Table, Flex, Text, Box, Pagination } from '@wraft/ui';

import { StateBadge, TimeAgo } from 'common/Atoms';
import { ContentTitleList } from 'common/content';
import { useAuth } from 'contexts/AuthContext';
import { fetchAPI } from 'utils/models';

interface Meta {
  total_pages: number;
  total_entries: number;
  page_number: number;
}

type StatusType = 'expired' | 'upcoming';

interface UpcomingExpiryContractsProps {
  status: StatusType;
}

const UpcomingExpiryContracts: React.FC<UpcomingExpiryContractsProps> = ({
  status,
}) => {
  const [loading, setLoading] = useState<boolean>(true);
  const [contents, setContents] = useState<any>([]);
  const [pageMeta, setPageMeta] = useState<Meta>();
  const [currentPage, setCurrentPage] = useState<number>(1);

  const { userProfile } = useAuth();

  const columns = useMemo(
    () => [
      {
        id: 'content.id',
        header: 'Name',
        accessorKey: 'content.id',
        cell: ({ row }: any) => (
          <NextLink href={`/documents/${row.original?.content?.id}`}>
            <ContentTitleList
              contentType={row.original?.content_type}
              content={row.original?.content}
            />
          </NextLink>
        ),
        enableSorting: false,
      },
      {
        id: 'content.updated_at',
        header: 'Created by',
        accessorKey: 'date',
        cell: ({ row }: any) => (
          <TimeAgo time={row.original?.content?.updated_at} />
        ),
        enableSorting: false,
      },
      {
        id: 'creator.profile_pic',
        header: 'Editors',
        accessorKey: 'creator.profile_pic',
        cell: ({ row }: any) => (
          <Flex alignItems="center" gap="8px">
            <Avatar
              sx={{ width: '16px', height: '16px' }}
              src={row.original?.creator?.profile_pic}
            />
            <Text>{row.original?.creator?.name}</Text>
          </Flex>
        ),
        enableSorting: false,
      },
      {
        id: 'content.meta',
        header: 'Expiry Date',
        accessorKey: 'content.meta.expiry_date',
        cell: ({ row }: any) => (
          <Flex alignItems="center" gap="8px">
            <Text
              color={
                new Date(row.original?.content?.meta?.expiry_date) < new Date()
                  ? 'red'
                  : 'inherit'
              }>
              {row.original?.content?.meta?.expiry_date}
            </Text>
          </Flex>
        ),
        enableSorting: false,
      },
      {
        header: 'Status',
        accessorKey: 'age',
        cell: ({ row }: any) => (
          <StateBadge name={row.original?.state?.state} color="#E2F7EA" />
        ),
        enableSorting: false,
        textAlign: 'right',
      },
    ],
    [],
  );

  useEffect(() => {
    loadData(currentPage);
  }, [userProfile?.organisation_id, currentPage]);

  const loadData = useCallback(
    async (page: number) => {
      setLoading(true);
      try {
        const pageNo =
          page > 0
            ? `?page=${page}&sort=inserted_at_desc&page_size=9&type=contract&status=${status}`
            : '';
        const data: any = await fetchAPI(`contents${pageNo}`);
        setContents(data.contents || []);
        setPageMeta(data);
      } finally {
        setLoading(false);
      }
    },
    [status],
  );

  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage);
  };

  return (
    <>
      <Table
        data={contents}
        isLoading={loading}
        columns={columns}
        skeletonRows={8}
      />
      <Box mt="md">
        {pageMeta && pageMeta?.total_pages > 1 && (
          <Pagination
            totalPage={pageMeta.total_pages}
            initialPage={currentPage}
            onPageChange={handlePageChange}
            totalEntries={pageMeta.total_entries}
          />
        )}
      </Box>
    </>
  );
};

export default UpcomingExpiryContracts;
