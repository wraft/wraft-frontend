import React, { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/router';
import { Box, Text, Flex } from '@wraft/ui';
import { DropdownMenu, Pagination, Table } from '@wraft/ui';
import { ThreeDotIcon } from '@wraft/icon';

import { TimeAgo } from 'components/common/Atoms';
import { StateBadge as _StateBadge } from 'components/common/Atoms';
import { NextLinkText } from 'common/NavLink';
import { fetchAPI } from 'utils/models';
import { usePermission } from 'utils/permissions';

export interface FormResponseMeta {
  total_pages: number;
  total_entries: number;
  page_number: number;
  entries: FormResponseEntry[];
}

export interface FormResponseEntry {
  updated_at: string;
  title: string;
  inserted_at: string;
  id: string;
  description: string;
}

const FormResponseList: React.FC = () => {
  const [entries, setEntries] = useState<Array<FormResponseEntry>>([]);
  const [pageMeta, setPageMeta] = useState<FormResponseMeta>();
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [_deleteEntryIndex, setDeleteEntryIndex] = useState<number | null>(
    null,
  );
  const { hasPermission } = usePermission();

  const router = useRouter();
  const formId: string = router.query.id as string;
  const initialPage: number = parseInt(router.query.page as string) || 1;

  const fetchFormEntries = useCallback(
    (pageNumber: number) => {
      setIsLoading(true);
      const query =
        pageNumber > 0 ? `?page=${pageNumber}&sort=inserted_at_desc` : '';

      fetchAPI(`forms/${formId}/entries${query}`)
        .then((response: any) => {
          setIsLoading(false);
          const responseEntries: FormResponseEntry[] = response.entries || [];
          setEntries(responseEntries);
          setPageMeta(response as FormResponseMeta);
        })
        .catch((error) => {
          console.error('Error fetching form entries:', error);
          setIsLoading(false);
        });
    },
    [formId],
  );

  useEffect(() => {
    fetchFormEntries(currentPage);
  }, [currentPage, fetchFormEntries]);

  const handlePageChange = useCallback(
    (newPage: number) => {
      setCurrentPage(newPage);
      const currentPath = router.pathname;
      const currentQuery = { ...router.query, page: newPage };

      router.push(
        {
          pathname: currentPath,
          query: currentQuery,
        },
        undefined,
        { shallow: true },
      );
    },
    [router],
  );

  const handleDeleteClick = useCallback((index: number) => {
    setDeleteEntryIndex(index);
  }, []);

  const tableColumns = [
    {
      id: 'content.id',
      header: 'NAME',
      accessorKey: 'content.name',
      enableSorting: false,
      size: 250,
      cell: ({ row }: any) => (
        <NextLinkText href={`/forms/${formId}/entries/${row.original?.id}`}>
          <Box>{row.original?.id}</Box>
        </NextLinkText>
      ),
    },
    {
      id: 'content.updated_at',
      header: 'CREATED',
      accessorKey: 'content.updated_at',
      enableSorting: false,
      cell: ({ row }: any) =>
        row.original.updated_at && <TimeAgo time={row.original?.updated_at} />,
    },
    {
      id: 'content.status',
      header: 'STATUS',
      accessorKey: 'content.status',
      enableSorting: false,
      cell: ({ row }: any) => <Text>{row.original?.status}</Text>,
    },
    {
      id: 'content.actions',
      header: '',
      enableSorting: false,
      cell: ({ row }: any) => (
        <Flex justifyContent="space-between">
          <Box />

          {hasPermission('form_entry', 'delete') && (
            <DropdownMenu.Provider>
              <DropdownMenu.Trigger>
                <ThreeDotIcon />
              </DropdownMenu.Trigger>
              <DropdownMenu aria-label="Entry actions">
                <DropdownMenu.Item onClick={() => handleDeleteClick(row.index)}>
                  <Text>Delete</Text>
                </DropdownMenu.Item>
              </DropdownMenu>
            </DropdownMenu.Provider>
          )}
        </Flex>
      ),
    },
  ];

  return (
    <Box py={3} mb={4}>
      <Box mx={0} mb={3}>
        <Box>
          <Box w="100%">
            <Box mx={0} mb={3} w="100%">
              <Table
                data={entries}
                columns={tableColumns}
                isLoading={isLoading}
              />
            </Box>
            <Box mx={2}>
              {pageMeta && pageMeta.total_pages > 1 && (
                <Pagination
                  totalPage={pageMeta.total_pages}
                  initialPage={initialPage}
                  onPageChange={handlePageChange}
                  totalEntries={pageMeta.total_entries}
                />
              )}
            </Box>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default FormResponseList;
