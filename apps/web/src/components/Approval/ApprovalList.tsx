import React, { useEffect, useState } from 'react';
import NextLink from 'next/link';
import { useRouter } from 'next/router';
import { MagnifyingGlassIcon } from '@phosphor-icons/react';
import {
  Box,
  Flex,
  Table,
  Pagination,
  Text,
  Button,
  Avatar,
  InputText,
} from '@wraft/ui';

import PageHeader from 'common/PageHeader';
import { PageInner, StateBadge, TimeAgo, IconFrame } from 'common/Atoms';
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

const columns = () => [
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
    header: 'Time',
    accessorKey: 'Time',
    cell: ({ row }: any) => (
      <Box>
        <TimeAgo time={row.original?.content?.updated_at} />
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
    cell: ({ row }: any) => (
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
              Review
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
  const router: any = useRouter();
  const currentPage: any = parseInt(router.query.page) || 1;

  const [contents, setContents] = useState<Array<ApprovaSystemItem>>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [pageMeta, setPageMeta] = useState<IPageMeta>();
  const [page, setPage] = useState<number>(1);
  const [searchQuery, setSearchQuery] = useState<string>(
    (router.query.search as string) || '',
  );

  useEffect(() => {
    if (router.query.search) {
      setSearchQuery(router.query.search as string);
    }
    if (router.query.page) {
      setPage(parseInt(router.query.page as string));
    }
  }, [router.query.search, router.query.page]);

  useEffect(() => {
    loadData(page, searchQuery);
  }, [page, searchQuery]);

  const loadData = (pageNumber: number, search: string = '') => {
    setLoading(true);
    const params = new URLSearchParams();
    if (pageNumber > 0) {
      params.append('page', pageNumber.toString());
    }
    params.append('sort', 'inserted_at_desc');
    if (search.trim()) {
      params.append('name', search.trim());
    }
    const query = params.toString() ? `?${params.toString()}` : '';

    fetchAPI(`users/list_pending_approvals${query}`)
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

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    setPage(1);
    const currentPath = router.pathname;
    const currentQuery = {
      ...router.query,
      page: 1,
      search: query || undefined,
    };
    if (!query) {
      delete currentQuery.search;
    }
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
        <Box mb="xs">
          <Flex gap="md" align="end" justify="flex-start">
            <Box w="320px" bg="background-primary">
              <InputText
                placeholder="Search by name..."
                value={searchQuery}
                size="md"
                onChange={(e) => handleSearch(e.target.value)}
                icon={
                  <IconFrame size={12} color="gray.700">
                    <MagnifyingGlassIcon width="18px" />
                  </IconFrame>
                }
                iconPlacement="right"
              />
            </Box>
          </Flex>
        </Box>
        <Table
          data={contents}
          isLoading={loading}
          columns={columns()}
          skeletonRows={10}
          emptyMessage="Nothing to approve"
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
      </PageInner>
    </Box>
  );
};
export default Approvals;
