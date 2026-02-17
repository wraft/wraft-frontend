import React, { useEffect, useState } from 'react';
import NextLink from 'next/link';
import { useRouter } from 'next/router';
import { Box, Flex, Table, Pagination, Text, Button, Avatar } from '@wraft/ui';

import PageHeader from 'common/PageHeader';
import { PageInner, StateBadge, TimeAgo } from 'common/Atoms';
import { ContentTitleList } from 'common/content';
import { fetchAPI } from 'utils/models';

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

const TabButton = ({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) => (
  <Box
    as="button"
    onClick={onClick}
    pb="sm"
    px="sm"
    borderBottom="2px solid"
    borderColor={active ? 'green.500' : 'transparent'}
    color={active ? 'green.900' : 'text-secondary'}
    fontWeight={active ? '600' : '500'}
    fontSize="sm"
    bg="transparent"
    cursor="pointer"
    style={{ transition: 'all 0.2s' }}
  >
    {children}
  </Box>
);

const columns = (activeTab: string) => [
  {
    id: 'content.name',
    header: 'Name',
    accessorKey: 'content.name',
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
    header: activeTab === 'past' ? 'Reviewed' : 'Time',
    accessorKey: 'Time',
    cell: ({ row }: any) => (
      <Box>
        <TimeAgo
          time={
            activeTab === 'past'
              ? row.original?.content?.reviewed_at
              : row.original?.content?.updated_at
          }
        />
      </Box>
    ),
    enableSorting: false,
  },
  {
    id: 'creator.editors',
    header: 'Editors',
    accessorKey: 'creator.editors',
    cell: ({ row }: any) => (
      <Flex alignItems="center" gap="8px">
        <Avatar src={row.original?.creator?.profile_pic} size="xs" />
        <Text>{row.original?.creator?.name}</Text>
      </Flex>
    ),
    enableSorting: false,
  },
  {
    header: 'Status',
    accessorKey: 'age',
    cell: ({ row }: any) =>
      activeTab === 'past' ? (
        <StateBadge
          name={row.original?.content?.review_status}
          color={
            row.original?.content?.review_status === 'approved'
              ? '#E2F7EA'
              : '#FEE2E2'
          }
        />
      ) : (
        <StateBadge name={row.original?.state?.state} color="#E2F7EA" />
      ),
    enableSorting: false,
    textAlign: 'right',
  },
  {
    header: 'Action',
    accessorKey: 'action',
    cell: ({ row }: any) => (
      <Flex mr={1} p={2}>
        <Flex>
          <NextLink href={`/documents/${row.original?.content?.id}`}>
            <Button variant="secondary" size="sm">
              {activeTab === 'past' ? 'View' : 'Review'}
            </Button>
          </NextLink>
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
  const [activeTab, setActiveTab] = useState<'active' | 'past'>('active');

  const router: any = useRouter();
  const currentPage: any = parseInt(router.query.page) || 1;

  useEffect(() => {
    loadData();
  }, [currentPage, activeTab]);

  const loadData = () => {
    setLoading(true);
    const pageNo = currentPage ? `&page=${currentPage}` : '';
    const statusParam = `&status=${activeTab}`;

    const query = `sort=inserted_at_desc${pageNo}${statusParam}`;

    fetchAPI(`users/list_pending_approvals?${query}`)
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

  return (
    <Box minHeight="100%" bg="background-secondary">
      <PageHeader title="Approvals" desc="All Approvals across your feeds" />

      <PageInner>
        <Box>
          <Flex gap="md" borderBottom="1px solid" borderColor="border" mb="md">
            <TabButton
              active={activeTab === 'active'}
              onClick={() => {
                setActiveTab('active');
                setPage(1);
              }}
            >
              Active Request
            </TabButton>
            <TabButton
              active={activeTab === 'past'}
              onClick={() => {
                setActiveTab('past');
                setPage(1);
              }}
            >
              Past Approvals
            </TabButton>
          </Flex>

          <Table
            data={contents}
            isLoading={loading}
            columns={columns(activeTab)}
            skeletonRows={10}
            emptyMessage={
              <Box mx="auto" gap="md" w="60%">
                <Text as="h3" fontSize="md">
                  No {activeTab} approvals
                </Text>
                <Text color="text-secondary" mb="md">
                  {activeTab === 'active'
                    ? 'You are all caught up! There are currently no items awaiting your approval.'
                    : 'You haven’t approved or rejected any documents yet.'}
                </Text>
              </Box>
            }
          />
          {pageMeta && pageMeta?.total_pages > 1 && (
            <Box mt="sm">
              <Pagination
                totalPage={pageMeta?.total_pages}
                initialPage={currentPage}
                onPageChange={changePage}
                totalEntries={pageMeta?.total_entries}
              />
            </Box>
          )}
        </Box>
      </PageInner>
    </Box>
  );
};
export default Approvals;
