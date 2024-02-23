import React, { useEffect, useState } from 'react';
import NextLink from 'next/link';
import { useRouter } from 'next/router';
import { Box, Text, Avatar, Flex, Container } from 'theme-ui';
import { Pagination, Table } from '@wraft/ui';

import { fetchAPI } from '../utils/models';
import { TimeAgo, FilterBlock, StateBadge } from './Atoms';
import PageHeader from './PageHeader';

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

export interface IContentType {
  name: string;
  id: string;
  description: string;
  color: string;
}

export interface IContent {
  id: string;
  updated_at: string;
  instance_id: string;
  serialized: any;
}

export interface StateClass {
  updated_at: string;
  state: string;
  order: number;
  inserted_at: string;
  id: string;
}

export interface IField {
  content: IContent;
  content_type: IContentType;
  state: StateClass;
  doDelete: any;
}

export interface IFieldItem {
  name: string;
  type: string;
}

export interface IPageMeta {
  page_number: number;
  total_entries: number;
  total_pages: number;
  contents?: any;
}

const columns = [
  {
    id: 'content.id',
    header: 'Name',
    accessorKey: 'content.id',
    cell: ({ row }: any) => (
      <NextLink href={`/content/${row.original?.content?.id}`}>
        <Flex sx={{ fontSize: '12px', ml: '-16px' }}>
          <Box
            sx={{
              width: '3px',
              bg: row.original?.content_type?.color
                ? row.original?.content_type?.color
                : 'blue',
            }}
          />
          <Box ml={3}>
            <Box>{row.original?.content?.instance_id}</Box>
            <Box>{row.original?.content?.serialized?.title}</Box>
          </Box>
        </Flex>
      </NextLink>
    ),
    size: 300,
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
    size: 300,
    enableSorting: false,
  },
  {
    id: 'creator.profile_pic',
    header: 'EDITORS',
    accessorKey: 'creator.profile_pic',
    cell: ({ row }: any) => (
      <Box sx={{ height: '20px' }}>
        <Avatar width="20px" src={row.original?.creator?.profile_pic} />
      </Box>
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
];

/**
 * Content List
 * ============
 *
 * @returns
 */
const ContentList = () => {
  const [contents, setContents] = useState<any>([]);
  const [variants, setVariants] = useState<Array<any>>([]);
  const [pageMeta, setPageMeta] = useState<IPageMeta>();
  const [_loading, setLoading] = useState<boolean>(false);
  const [contenLoading, setContenLoading] = useState<boolean>(false);
  const [page, setPage] = useState<number>();

  const router: any = useRouter();
  const currentPage: any = parseInt(router.query.page) || 1;

  useEffect(() => {
    loadData(currentPage);
    loadVariants();
  }, []);

  /**
   * Load Content Types
   */
  const loadVariants = () => {
    fetchAPI('content_types')
      .then((data: any) => {
        setLoading(true);
        const res: any = data.content_types;
        setVariants(res);
      })
      .catch(() => {
        setLoading(true);
      });
  };

  useEffect(() => {
    if (page) {
      loadData(page);
    }
  }, [page]);

  /**
   * Load Contents with pagination
   * @param page
   */
  const loadData = (page: number) => {
    setContenLoading(true);
    const query = `page=${page}&sort=inserted_at_desc`;
    fetchAPI(`contents?${query}`)
      .then((data: any) => {
        setContenLoading(false);
        const res: any = data.contents;
        setContents(res);
        setPageMeta(data);
      })
      .catch(() => {
        setContenLoading(false);
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
    <Box sx={{ pl: 0, minHeight: '100%', bg: 'neutral.100' }}>
      <PageHeader title="Documents" desc="Manage all documents" />
      <Container variant="layout.pageFrame">
        <Flex>
          <Box sx={{ flexGrow: 1 }}>
            <Box mx={0} mb={3} sx={{}}>
              <Table
                data={contents}
                isLoading={contenLoading}
                columns={columns}
                skeletonRows={12}
              />
            </Box>
            {pageMeta && pageMeta?.total_pages > 1 && (
              <Pagination
                totalPage={pageMeta?.total_pages}
                initialPage={currentPage}
                onPageChange={changePage}
                totalEntries={pageMeta?.total_entries}
              />
            )}
          </Box>
          <Box variant="layout.plateSidebar">
            <Box variant="layout.plateBox" sx={{ border: 0, pl: 3 }}>
              <Text
                as="h4"
                variant="blockTitle"
                sx={{
                  mb: 2,
                  fontWeight: 'body',
                  fontSize: 2,
                  color: 'text',
                }}>
                Filter by Variant
              </Text>
              <Box
                sx={{
                  borderRight: 'solid 1px',
                  borderLeft: 'solid 1px',
                  borderTop: 'solid 1px',
                  borderColor: 'border',
                  '&:last-child': {
                    borderBottom: 0,
                  },
                }}>
                {variants &&
                  variants.map((v: any) => (
                    <FilterBlock key={v?.name} title={v?.name} no={0} {...v} />
                  ))}
              </Box>
            </Box>
            <Box variant="layout.plateBox" sx={{ border: 0, pl: 3 }}>
              <Text
                as="h4"
                variant="blockTitle"
                sx={{
                  mb: 2,
                  fontSize: 2,
                  fontWeight: 'body',
                  color: 'text',
                }}>
                Filter by State
              </Text>
              <Box
                sx={{
                  borderRight: 'solid 1px',
                  borderLeft: 'solid 1px',
                  borderTop: 'solid 1px',
                  borderColor: 'border',
                  borderRadius: '5px',
                  '&:last-child': {
                    borderBottom: 0,
                  },
                }}>
                <FilterBlock title="Draft" no={32} color="blue.3" />
                <FilterBlock title="In Review" no={32} color="orange.3" />
                <FilterBlock title="Published" no={32} color="green.3" />
                <FilterBlock title="Archived" no={32} color="purple" />
              </Box>
            </Box>
          </Box>
        </Flex>
      </Container>
    </Box>
  );
};
export default ContentList;
