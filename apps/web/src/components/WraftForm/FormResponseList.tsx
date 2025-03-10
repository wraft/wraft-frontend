import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { Box, Text, Flex } from 'theme-ui';
import { DropdownMenu, Pagination, Table } from '@wraft/ui';
import { ThreeDotIcon } from '@wraft/icon';

import { NextLinkText } from 'common/NavLink';
import { TimeAgo, StateBadge } from 'common/Atoms';
import { fetchAPI } from 'utils/models';

export interface Theme {
  total_pages: number;
  total_entries: number;
  form_collections: FormElement[];
  page_number: number;
}

export interface FormElement {
  updated_at: string;
  title: string;
  inserted_at: string;
  id: string;
  description: string;
}

interface Meta {
  total_pages: number;
  total_entries: number;
  page_number: number;
}

const FormResponseList = () => {
  const [contents, setContents] = useState<Array<FormElement>>([]);
  const [pageMeta, setPageMeta] = useState<Meta>();
  const [loading, setLoading] = useState<boolean>(true);
  const [page, setPage] = useState<number>(1);
  const [_deleteOpen, setDeleteOpen] = useState<number | null>(null);

  const router = useRouter();
  const fId: string = router.query.id as string;
  const currentPage: any = parseInt(router.query.page as string) || 1;

  const loadData = (pageNo: number) => {
    setLoading(true);
    const query = pageNo > 0 ? `?page=${pageNo}&sort=inserted_at_desc` : '';
    fetchAPI(`forms/${fId}/entries${query}`)
      .then((data: any) => {
        setLoading(false);
        const res: FormElement[] = data.entries;
        setContents(res);
        setPageMeta(data);
      })
      .catch(() => {
        setLoading(false);
      });
  };

  useEffect(() => {
    loadData(page);
  }, [page]);

  const columns = [
    {
      id: 'content.id',
      header: 'NAME',
      accessorKey: 'content.name',
      enableSorting: false,
      size: 250,
      cell: ({ row }: any) => {
        return (
          <>
            <NextLinkText href={`/forms/${fId}/entries/${row.original?.id}`}>
              <Box sx={{ fontSize: 'sm' }}>{row.original?.id}</Box>
            </NextLinkText>
          </>
        );
      },
    },
    {
      id: 'content.updated_at',
      header: 'CREATED',
      accessorKey: 'content.updated_at',
      enableSorting: false,
      cell: ({ row }: any) => {
        return (
          row.original.updated_at && <TimeAgo time={row.original?.updated_at} />
        );
      },
    },
    {
      id: 'content.status',
      header: 'STATUS',
      accessorKey: 'content.status',
      enableSorting: false,
      cell: ({ row }: any) => {
        return (
          <Box>
            <StateBadge name={row.original?.status} color="#E2F7EA" />
          </Box>
        );
      },
    },
    {
      id: 'content.id',
      header: '',
      accessor: 'content.id',
      enableSorting: false,
      cell: ({ row }: any) => {
        return (
          <>
            <Flex sx={{ justifyContent: 'space-between' }}>
              <Box />
              <DropdownMenu.Provider>
                <DropdownMenu.Trigger>
                  <ThreeDotIcon />
                </DropdownMenu.Trigger>
                <DropdownMenu aria-label="dropdown role">
                  <DropdownMenu.Item onClick={() => setDeleteOpen(row.index)}>
                    <Text>Delete</Text>
                  </DropdownMenu.Item>
                </DropdownMenu>
              </DropdownMenu.Provider>
            </Flex>
          </>
        );
      },
    },
  ];

  const changePage = (newPage: any) => {
    setPage(newPage);
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
  };
  return (
    <Box py={3} mb={4}>
      <Box mx={0} mb={3}>
        <Box>
          <Box sx={{ width: '100%' }}>
            <Box mx={0} mb={3} sx={{ width: '100%' }}>
              <Table data={contents} columns={columns} isLoading={loading} />
            </Box>
            <Box mx={2}>
              {pageMeta && pageMeta?.total_pages > 1 && (
                <Pagination
                  totalPage={pageMeta.total_pages}
                  initialPage={currentPage}
                  onPageChange={changePage}
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
