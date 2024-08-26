import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { Box } from 'theme-ui';
import { Pagination, Table } from '@wraft/ui';

import { fetchAPI } from 'utils/models';

import { TimeAgo } from './Atoms';

export interface IPageMeta {
  page_number: number;
  total_entries: number;
  total_pages: number;
  contents?: any;
}

const NotificationList = () => {
  const [contents, setContents] = useState([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [pageMeta, setPageMeta] = useState<IPageMeta>();
  const [page, setPage] = useState<number>(1);

  const router: any = useRouter();
  const currentPage: any = parseInt(router.query.page) || 1;

  useEffect(() => {
    if (page) {
      loadData();
    }
  }, []);

  const loadData = () => {
    setLoading(true);
    const pageNo = currentPage ? `&page=${currentPage}` : '';

    const query = `sort=inserted_at_desc${pageNo}`;
    fetchAPI(`notifications?${query}`)
      .then((data: any) => {
        setLoading(false);
        const res = data.notifications;
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

  const columns = [
    {
      id: 'content.message',
      header: 'MESSAGE',
      accessorKey: 'content.message',
      enableSorting: false,
      size: 250,
      cell: ({ row }: any) => {
        return (
          <Box sx={{ fontSize: 'sm', fontWeight: '600' }}>
            {row.original?.notification?.message}
          </Box>
        );
      },
    },
    {
      id: 'content.type',
      header: 'TYPE',
      accessorKey: 'content.type',
      enableSorting: false,
      size: 250,
      cell: ({ row }: any) => {
        return (
          <Box sx={{ fontSize: 'sm' }}>{row.original?.notification?.type}</Box>
        );
      },
    },
    {
      id: 'content.updated_at',
      header: 'LAST UPDATED',
      accessorKey: 'content.updated_at',
      enableSorting: false,
      cell: ({ row }: any) => {
        return (
          row.original.updated_at && <TimeAgo time={row.original?.updated_at} />
        );
      },
    },
  ];

  return (
    <Box py={3} mb={4}>
      <Box mx={0} mb={3}>
        <Box>
          <Box sx={{ width: '100%' }}>
            <Box mx={0} mb={3} sx={{ width: '100%' }}>
              <Table
                data={contents}
                columns={columns}
                isLoading={loading}
                emptyMessage="No Notifications yet."
              />
              {pageMeta && pageMeta?.total_pages > 1 && (
                <Box mx={0} mt={3}>
                  <Pagination
                    totalPage={pageMeta?.total_pages}
                    initialPage={currentPage}
                    onPageChange={changePage}
                    totalEntries={pageMeta?.total_entries}
                  />
                </Box>
              )}
            </Box>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default NotificationList;
