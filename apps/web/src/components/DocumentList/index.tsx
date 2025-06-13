import React, { useEffect, useState } from 'react';
import NextLink from 'next/link';
import { useRouter } from 'next/router';
import { Avatar } from 'theme-ui';
import { Button, Pagination, Table, Box, Text, Flex } from '@wraft/ui';
import toast from 'react-hot-toast';
import { DotsThreeVertical } from '@phosphor-icons/react';

import { ContentTitleList } from 'common/content';
import { TimeAgo, FilterBlock, StateBadge, PageInner } from 'common/Atoms';
import PageHeader from 'common/PageHeader';
import { fetchAPI } from 'utils/models';

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
    accessorKey: 'content.name',
    cell: ({ row }: any) => (
      <NextLink href={`/documents/${row.original?.content?.id}`}>
        <ContentTitleList
          content={row.original?.content}
          contentType={row.original?.content_type}
        />
      </NextLink>
    ),
    // width: '20%',
    // size: '100',
    enableSorting: false,
  },
  {
    id: 'content.updated_at',
    header: 'Time',
    accessorKey: 'Time',
    cell: ({ row }: any) => (
      <TimeAgo time={row.original?.content?.updated_at} />
    ),
    enableSorting: false,
  },
  {
    id: 'creator.editors',
    header: 'Editors',
    accessorKey: 'creator.editors',
    cell: ({ row }: any) => (
      <Flex alignItems="center" gap="sm">
        <Avatar
          sx={{ width: '16px', height: '16px' }}
          src={row.original?.creator?.profile_pic}
        />
        <Text fontSize="sm2" fontWeight={500}>
          {row.original?.creator?.name}
        </Text>
      </Flex>
    ),
    enableSorting: false,
  },
  {
    header: 'Status',
    accessorKey: 'age',
    cell: ({ row }: any) => (
      <StateBadge name={row.original?.state?.state} color="green.a400" />
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
const DocumentList = () => {
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
    <>
      <PageHeader title="Documents" desc="Manage all documents">
        <Button variant="secondary" size="sm">
          <DotsThreeVertical stroke="bold" color="gray.700" />
        </Button>
      </PageHeader>
      <PageInner>
        <Flex>
          <Box flexGrow={1}>
            <Box mb="sm">
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
          <Box w="25%" px="lg">
            <Flex justifyContent="space-between" mb="sm">
              <Text as="h4" fontWeight="heading" color="text-primary">
                Filter by Variant
              </Text>
              {currentVariant && (
                <Button
                  size="xs"
                  variant="secondary"
                  onClick={() => handleFilter('')}>
                  Clear
                </Button>
              )}
            </Flex>
            <Box border="solid 1px" borderBottom="none" borderColor="border">
              {variants &&
                variants.map((variant: any) => (
                  <FilterBlock
                    key={variant?.name}
                    title={variant?.name}
                    color={variant?.color}
                    setSelected={handleFilter}
                    active={
                      currentVariant === variant?.name ? 'green.400' : undefined
                    }
                  />
                ))}
            </Box>
          </Box>
        </Flex>
      </PageInner>
    </>
  );
};
export default DocumentList;
