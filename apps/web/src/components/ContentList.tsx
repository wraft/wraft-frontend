import React, { useEffect, useState } from 'react';
import NextLink from 'next/link';
import { useRouter } from 'next/router';
import { Box, Text, Avatar, Flex, Container } from 'theme-ui';
import { Button, Pagination, Table } from '@wraft/ui';
import toast from 'react-hot-toast';

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
    header: 'NAME',
    accessorKey: 'content.id',
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
                fontSize: 'xs',
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
    // width: '20%',
    // size: '100',
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
        <StateBadge name={row.original?.state?.state} color="green.a400" />
      </Box>
    ),
    enableSorting: false,
    // maxSize: 90,
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
  const [contenLoading, setContenLoading] = useState<boolean>(false);
  const [page, setPage] = useState<number>();

  const router: any = useRouter();
  const currentPage: any = parseInt(router.query.page) || 1;
  const currentVariant: any = router.query.variant;

  useEffect(() => {
    loadData();
    loadVariants();
  }, []);

  /**
   * Load Content Types
   */
  const loadVariants = () => {
    fetchAPI('content_types')
      .then((data: any) => {
        const res: any = data.content_types;
        setVariants(res);
      })
      .catch(() => {
        toast.error('Failed to load content types');
      });
  };

  /* TO DO: waiting for the api response */

  // const loadState = () => {
  //   fetchAPI('flows')
  //     .then((data: any) => {
  //       console.log(data, 'logdata');

  //       const res: any = data.states.state;
  //       setDocState(res);
  //     })
  //     .catch(() => {
  //       toast.error('Failed to load states');
  //     });
  // };

  useEffect(() => {
    if (page || currentVariant) {
      loadData();
    }
  }, [currentPage, currentVariant]);

  /**
   * Load Contents with pagination
   * @param page
   */
  const loadData = () => {
    setContenLoading(true);

    const qpage = currentPage ? `&page=${currentPage}` : '';
    const qvariant = currentVariant
      ? `&content_type_name=${currentVariant}`
      : '';

    const query = `sort=inserted_at_desc${qpage}${qvariant}`;

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

  const handleFilter = (title?: any) => {
    setPage(1);
    const currentPath = router.pathname;
    const currentQuery = { ...router.query, page: 1, variant: title };
    if (!title) {
      router.push({
        pathname: currentPath,
      });
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
              <Flex sx={{ justifyContent: 'space-between', mb: 2 }}>
                <Text
                  as="h4"
                  variant="blockTitle"
                  sx={{
                    fontWeight: 'body',
                    fontSize: 'sm',
                    color: 'text',
                  }}>
                  Filter by Variant
                </Text>
                {currentVariant && (
                  <Box>
                    <Button
                      size="xxs"
                      variant="secondary"
                      shape="square"
                      onClick={() => handleFilter('')}>
                      clear
                    </Button>
                  </Box>
                )}
              </Flex>
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
                    <FilterBlock
                      key={v?.name}
                      title={v?.name}
                      no={0}
                      setSelected={handleFilter}
                      active={
                        currentVariant === v?.name ? 'green.400' : undefined
                      }
                    />
                  ))}
              </Box>
            </Box>

            {/* TO DO */}

            {/* {currentVariant && (
              <Box variant="layout.plateBox" sx={{ border: 0, pl: 3 }}>
                <Text
                  as="h4"
                  variant="blockTitle"
                  sx={{
                    mb: 2,
                    fontSize: 'sm',
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
            )} */}
          </Box>
        </Flex>
      </Container>
    </Box>
  );
};
export default ContentList;
