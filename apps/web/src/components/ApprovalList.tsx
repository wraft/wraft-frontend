import React, { useEffect, useState } from 'react';
import NextLink from 'next/link';
import { useRouter } from 'next/router';
import { Box, Flex, Avatar, Button } from 'theme-ui';
import { Table, Pagination } from '@wraft/ui';

import PageHeader from 'components/PageHeader';
import { StateBadge, TimeAgo } from 'components/Atoms';
import { useAuth } from 'contexts/AuthContext';
import { putAPI, fetchAPI } from 'utils/models';

export interface ApprovalList {
  pre_state: State;
  post_state: State;
  instance: Instance;
  approved: boolean;
}

export interface ApprovaSystemItem {
  approval_system_id: string;
  approved_at?: string;
  flag: boolean;
  id: string;
  instance_id: string;
  rejected_at?: string;
}

export interface Instance {
  stete_id: string;
  state: string;
  id: string;
}

export interface State {
  state: string;
  id: string;
}

export interface IPageMeta {
  page_number: number;
  total_entries: number;
  total_pages: number;
  contents?: any;
}

const columns = () => [
  {
    id: 'content.name',
    header: 'Name',
    accessorKey: 'content.name',
    cell: ({ row }: any) => (
      <NextLink href={`/content/${row.original?.content?.id}`}>
        <Flex sx={{ fontSize: 'xs', ml: '-16px' }}>
          <Box
            sx={{
              width: '3px',
              bg: row.original?.content_type?.color
                ? row.original?.content_type?.color
                : 'blue',
            }}
          />
          <Box ml={3}>
            <Box sx={{ color: 'gray.1000' }}>
              {row.original?.content?.instance_id}
            </Box>
            <Box
              as="h5"
              sx={{
                fontSize: 'sm',
                color: 'gray.1200',
                letterSpacing: '-0.15px',
                fontWeight: 500,
                lineHeight: 1.25,
              }}>
              {row.original?.content?.serialized?.title}
            </Box>
          </Box>
        </Flex>
      </NextLink>
    ),
    enableSorting: false,
  },
  {
    id: 'content.updated_at',
    header: 'TIME',
    accessorKey: 'TIME',
    cell: ({ row }: any) => (
      <Box>
        <TimeAgo time={row.original?.content?.updated_at} />
      </Box>
    ),
    enableSorting: false,
  },
  {
    id: 'creator.profile_pic',
    header: 'EDITORS',
    accessorKey: 'creator.profile_pic',
    cell: ({ row }: any) => (
      <Flex>
        <Avatar width="20px" src={row.original?.creator?.profile_pic} />
        <Box sx={{ fontSize: 'sm', ml: 3 }}>{row.original?.creator?.name}</Box>
      </Flex>
    ),
    enableSorting: false,
  },
  {
    header: 'STATUS',
    accessorKey: 'age',
    cell: ({ row }: any) => (
      <Box>
        <StateBadge name={row.original?.state?.state} color="#E2F7EA" />
      </Box>
    ),
    enableSorting: false,
    textAlign: 'right',
  },
  {
    header: 'ACTION',
    accessorKey: 'action',
    cell: ({ row }: any) => (
      <Flex sx={{ mr: 1, p: 2 }}>
        <Flex>
          <NextLink href={`/content/${row.original?.content?.id}`}>
            <Button variant="btnSecondary" sx={{ mr: 1 }}>
              Review
            </Button>
          </NextLink>
          {/* <Box>
            <Button
              variant="btnAction"
              onClick={() => approveInstance(row?.original?.content?.id)}>
              Approve
            </Button>
          </Box> */}
        </Flex>
      </Flex>
    ),
    enableSorting: false,
    textAlign: 'right',
  },
];

const Approvals = () => {
  const [contents, setContents] = useState<Array<ApprovaSystemItem>>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [pageMeta, setPageMeta] = useState<IPageMeta>();
  const [page, setPage] = useState<number>(1);

  const router: any = useRouter();
  const currentPage: any = parseInt(router.query.page) || 1;

  const { accessToken } = useAuth();

  const loadData = (page: number) => {
    setLoading(true);
    const pageNo = page > 0 ? `?page=${page}&sort=inserted_at_desc` : '';
    fetchAPI(`users/list_pending_approvals${pageNo}`)
      .then((data: any) => {
        setLoading(false);
        const res: any[] = data.pending_approvals;
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
    if (accessToken) {
      loadData(page);
    }
  }, [accessToken, page]);

  /**
   * Approve an Instance
   */

  // const approveInstance = (id: string) => {
  //   const req = putAPI(`contents/${id}/approve`);
  //   toast.promise(req, {
  //     loading: 'Approving...',
  //     success: () => {
  //       setRerender((prev) => !prev);
  //       return 'Approved';
  //     },
  //     error: 'Failed',
  //   });
  // };

  return (
    <Box sx={{ pl: 0, minHeight: '100%', bg: 'neutral.100' }}>
      <PageHeader title="Approvals" desc="All Approvals across your feeds">
        <Box sx={{ ml: 'auto' }}></Box>
      </PageHeader>
      <Box mx={0} mb={3} variant="layout.pageFrame">
        <Flex>
          <Box mx={0} mb={3} sx={{ width: '75%' }}>
            <Table
              data={contents}
              isLoading={loading}
              columns={columns()}
              skeletonRows={10}
              emptyMessage="Nothing to approve"
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
          {/* <Box
            sx={{
              bg: 'backgroundWhite',
              minHeight: '100vh',
              width: '25%',
              borderLeft: 'solid 1px',
              borderColor: 'border',
            }}></Box> */}
        </Flex>
      </Box>
    </Box>
  );
};
export default Approvals;
