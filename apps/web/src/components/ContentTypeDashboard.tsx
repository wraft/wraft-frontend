import React, { useEffect, useState } from 'react';
import NextLink from 'next/link';
import { useRouter } from 'next/router';
import { Box, Flex } from 'theme-ui';
import { Pagination, Table } from '@wraft/ui';

import { TimeAgo } from 'components/Atoms';
import { useAuth } from 'contexts/AuthContext';
// import { EmptyForm } from 'components/Icons';
import { fetchAPI, deleteAPI } from 'utils/models';

/**
 * DocType Cards
 * -------------
 *
 * @returns
 */

// interface DocCardProps {
//   id: any;
//   name?: string;
//   color?: string;
//   isEdit?: boolean;
// }

export interface ILayout {
  width: number;
  updated_at: string;
  unit: string;
  slug: string;
  name: string;
  id: string;
  height: number;
  description: string;
}

export interface IField {
  id: string;
  name: string;
  layout_id: string;
  layout: ILayout;
  description: string;
}

export interface IFieldItem {
  name: string;
  type: string;
}

// interface ContentTypeDashboardProps {
//   isEdit?: boolean;
// }

const columns = [
  {
    id: 'title',
    header: 'Name',
    accessorKey: 'title',
    cell: ({ row }: any) => (
      <NextLink href={`/content-types/edit/${row?.original?.id}`}>
        <Flex sx={{ fontSize: '12px', ml: '-14px', py: 2 }}>
          <Box
            sx={{
              width: '3px',
              bg: row.original?.color ? row.original?.color : 'blue',
            }}
          />
          <Box ml={3}>
            <Box sx={{ fontSize: '15px', fontWeight: 500 }}>
              {row?.original?.name}
            </Box>
          </Box>
        </Flex>
      </NextLink>
    ),
    size: '350',
    enableSorting: false,
  },
  {
    id: 'content.updated_at',
    header: 'CREATE',
    accessorKey: 'TIME',
    cell: ({ row }: any) => (
      <Box>
        <TimeAgo time={row.original?.updated_at} />
      </Box>
    ),
    enableSorting: false,
  },
  {
    id: 'content.name',
    header: 'ACTION',
    cell: () => <Box>Edit</Box>,
    enableSorting: false,
    textAlign: 'right',
  },
];

const ContentTypeDashboard = () => {
  const [contents, setContents] = useState<Array<IField>>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [pageMeta, setPageMeta] = useState<any>();
  const [page, setPage] = useState<number>();

  const { accessToken } = useAuth();

  const router: any = useRouter();
  const currentPage: any = parseInt(router.query.page) || 1;

  useEffect(() => {
    if (page) {
      loadData(page);
    }
  }, [page]);

  const delData = (id: string) => {
    deleteAPI(`content_types/${id}`);
  };

  const loadData = (page: number) => {
    setLoading(true);

    const query = `?page=${page}&sort=inserted_at_desc`;
    fetchAPI(`content_types${query}`)
      .then((data: any) => {
        setLoading(false);
        const res: IField[] = data.content_types;
        setContents(res);
        setPageMeta(data);
      })
      .catch(() => {
        setLoading(false);
      });
  };

  useEffect(() => {
    loadData(currentPage);
  }, [accessToken]);

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

  console.log('loading[ww]', loading);

  return (
    <Box>
      <Table
        data={contents}
        isLoading={loading}
        columns={columns}
        skeletonRows={10}
        emptyMessage="No blocks has been created yet."
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
  );
};
export default ContentTypeDashboard;
