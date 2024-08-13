import React, { useEffect, useState } from 'react';
import NavLink from 'next/link';
import { useRouter } from 'next/router';
import { Box, Flex, Text } from 'theme-ui';
import { Pagination, DropdownMenu, Table } from '@wraft/ui';
import { ThreeDotIcon } from '@wraft/icon';

import { fetchAPI } from '../utils/models';
import { IField } from '../utils/types/content';
import { TimeAgo } from './Atoms';
import Link from './NavLink';
import PageHeader from './PageHeader';

const columns = [
  {
    id: 'title',
    header: 'Name',
    accessorKey: 'title',
    cell: ({ row }: any) => (
      <NavLink href={`/templates/edit/${row?.original?.id}`}>
        <Box sx={{ fontSize: 'sm', fontWeight: 500 }}>
          {row?.original?.title}
        </Box>
      </NavLink>
    ),
    enableSorting: false,
  },
  {
    id: 'content.name',
    header: 'TYPE',
    accessorKey: 'content.name',
    cell: ({ row }: any) => (
      <Flex sx={{ alignItems: 'center', gap: 2 }}>
        <Box
          as="span"
          sx={{
            display: 'block',
            borderRadius: '4px',
            height: '12px',
            width: '12px',
            border: 'solid 1px',
            borderColor: 'border',
            alignItems: 'center',
            bg: row?.original?.content_type?.color,
          }}
        />

        <Text sx={{ fontSize: 'sm', fontWeight: 'body', display: 'flex' }}>
          {row?.original?.content_type?.name}
        </Text>
      </Flex>
    ),
    enableSorting: false,
  },
  {
    id: 'content.prefix',
    header: 'PREFIX',
    accessorKey: 'prefix',
    cell: ({ row }: any) => (
      <Box sx={{ fontSize: 'xs' }}>{row.original?.content_type?.prefix}</Box>
    ),
    enableSorting: false,
  },
  {
    id: 'content.updated_at',
    header: 'UPDATE AT',
    accessorKey: 'TIME',
    cell: ({ row }: any) => (
      <Box>
        <TimeAgo time={row.original?.updated_at} />
      </Box>
    ),
    enableSorting: false,
  },
  {
    id: 'id',
    header: '',
    cell: ({ row }: any) => (
      <Flex sx={{ justifyContent: 'flex-end' }}>
        <DropdownMenu.Provider>
          <DropdownMenu.Trigger>
            <ThreeDotIcon />
          </DropdownMenu.Trigger>
          <DropdownMenu aria-label="dropdown role">
            <DropdownMenu.Item>
              <NavLink href={`/templates/edit/${row?.original?.id}`}>
                Edit
              </NavLink>
            </DropdownMenu.Item>
          </DropdownMenu>
        </DropdownMenu.Provider>
      </Flex>
    ),
    enableSorting: false,
    textAlign: 'right',
  },
];

const TemplateList = () => {
  const [contents, setContents] = useState<Array<IField>>([]);
  const [pageMeta, setPageMeta] = useState<any>();
  const [loading, setLoading] = useState<boolean>(false);
  const [page, setPage] = useState<number>();

  const router: any = useRouter();
  const currentPage: any = parseInt(router.query.page) || 1;

  useEffect(() => {
    if (page) {
      loadData(page);
    }
  }, [page]);

  const loadData = (page: number) => {
    setLoading(true);

    const query = `?page=${page}`;
    fetchAPI(`data_templates${query}&sort=updated_at_desc`)
      .then((data: any) => {
        setLoading(false);
        const res: IField[] = data.data_templates;
        setContents(res);

        setPageMeta(data);
      })
      .catch(() => {
        setLoading(false);
      });
  };

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

  useEffect(() => {
    loadData(currentPage);
  }, []);

  return (
    <Box sx={{ pl: 0, minHeight: '100%', bg: 'neutral.100' }}>
      <PageHeader title="Templates" desc="Content Templates for Variants">
        <Box sx={{ ml: 'auto', pt: 2 }}>
          <Link href="/templates/new" variant="secondary" type="button">
            + New Template
          </Link>
        </Box>
      </PageHeader>
      <Box variant="layout.pageFrame" sx={{ py: 4 }}>
        <Box mx={0} mb={3}>
          <Table
            data={contents}
            isLoading={loading}
            columns={columns}
            skeletonRows={10}
            emptyMessage="No template has been created yet."
          />
          <Box mt="16px">
            {pageMeta && pageMeta?.total_pages > 1 && (
              <Pagination
                totalPage={pageMeta?.total_pages}
                initialPage={currentPage}
                onPageChange={changePage}
                totalEntries={pageMeta?.total_entries}
              />
            )}
          </Box>
        </Box>
      </Box>
    </Box>
  );
};
export default TemplateList;
