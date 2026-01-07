import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { Box, Flex, Text, InputText } from '@wraft/ui';
import { Drawer, Button, Pagination, useDrawer } from '@wraft/ui';
import { Table } from '@wraft/ui';
import {
  PlayIcon,
  TreeStructureIcon,
  MagnifyingGlassIcon,
} from '@phosphor-icons/react';

import Link from 'common/NavLink';
import PageHeader from 'common/PageHeader';
import { PageInner, TimeAgo, IconFrame } from 'common/Atoms';
import { fetchAPI } from 'utils/models';
import { usePermission } from 'utils/permissions';

import PipelineCreateForm from './PipelineCreateForm';
import PipelineFormEntry from './PipelineFormEntry';

export interface Pipelines {
  total_pages: number;
  total_entries: number;
  pipelines: Pipeline[];
  page_number: number;
}

export interface Pipeline {
  updated_at: string;
  name: string;
  inserted_at: string;
  id: string;
  api_route: string;
  stages: any;
}

export interface IPageMeta {
  page_number: number;
  total_entries: number;
  total_pages: number;
  contents?: any;
}

const Form = () => {
  const [contents, setContents] = useState<Array<Pipeline>>([]);
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);
  const [page, setPage] = useState<number>(1);
  const [pageMeta, setPageMeta] = useState<IPageMeta>();
  const [pipelineId, setPipelineId] = useState<any>();
  const [rerender, setRerender] = React.useState(false);
  const [isCreatePipelineDrawerOpen, setIsCreatePipelineDrawerOpen] =
    useState<boolean>(false);
  const [sourceId, setSourceId] = useState<any>();

  const router: any = useRouter();
  const currentPage: any = parseInt(router.query.page) || 1;
  const [searchQuery, setSearchQuery] = useState<string>(
    (router.query.search as string) || '',
  );

  const mobileMenuDrawer = useDrawer();
  const formMenuDrawer = useDrawer();

  const { hasPermission } = usePermission();

  useEffect(() => {
    if (router.query.search) {
      setSearchQuery(router.query.search as string);
    }
    if (router.query.page) {
      setPage(parseInt(router.query.page as string));
    }
  }, [router.query.search, router.query.page]);

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

    fetchAPI(`pipelines${query}`).then((data: any) => {
      const res: Pipeline[] = data.pipelines;
      setContents(res);
      setPageMeta(data);
      setLoading(false);
    });
  };

  useEffect(() => {
    if (page) {
      loadData(page, searchQuery);
    } else {
      loadData(currentPage, searchQuery);
    }
  }, [currentPage, rerender, searchQuery]);

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

  const onRunClick = (formId: any, pipeId: any) => {
    setIsOpen(true);
    setSourceId(formId);
    setPipelineId(pipeId);
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

  const columns = [
    {
      id: 'pipeline.name',
      header: 'Name',
      accessorKey: 'pipeline.name',
      cell: ({ row }: any) => (
        <Link href={`/pipelines/run/${row.original.id}`}>
          <Text fontWeight="heading">{row.original.name}</Text>
        </Link>
      ),
      enableSorting: false,
    },
    {
      id: 'pipeline.run',
      header: 'Last Run',
      accessorKey: 'pipeline.run',
      cell: ({ row }: any) => <TimeAgo time={row.original.inserted_at} />,
      enableSorting: false,
    },
    ...(hasPermission('pipeline', 'manage')
      ? [
          {
            id: 'content.name',
            header: 'Action',
            accessorKey: 'content.name',
            cell: ({ row }: any) => (
              <Flex gap="sm">
                <Button
                  onClick={() => router.push(`/workflow/${row.original.id}`)}
                  variant="secondary"
                  size="sm"
                  disabled={row.original.stages_count == 0}>
                  <TreeStructureIcon size={12} />
                  WorkFlow
                </Button>
                <Button
                  onClick={() => {
                    onRunClick(row.original.source_id, row.original.id);
                  }}
                  variant="secondary"
                  size="sm"
                  disabled={row.original.stages_count == 0}>
                  <PlayIcon size={12} />
                  Run
                </Button>
              </Flex>
            ),
            enableSorting: false,
          },
        ]
      : []),
  ];

  return (
    <>
      <PageHeader title="Pipelines">
        {hasPermission('pipeline', 'manage') && (
          <Button
            variant="secondary"
            size="sm"
            onClick={() => setIsCreatePipelineDrawerOpen(true)}>
            Add Pipeline
          </Button>
        )}
      </PageHeader>

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
          columns={columns}
          isLoading={loading}
          emptyMessage="No pipelines has been created yet."
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
      </PageInner>

      <Drawer
        open={isCreatePipelineDrawerOpen}
        store={mobileMenuDrawer}
        withBackdrop={true}
        onClose={() => setIsCreatePipelineDrawerOpen(false)}>
        {isCreatePipelineDrawerOpen && (
          <PipelineCreateForm
            setIsOpen={setIsCreatePipelineDrawerOpen}
            setRerender={setRerender}
          />
        )}
      </Drawer>
      <Drawer open={isOpen} store={formMenuDrawer} withBackdrop={true}>
        {isOpen && (
          <>
            <PipelineFormEntry
              formId={sourceId}
              pipelineId={pipelineId}
              setIsOpen={setIsOpen}
            />
          </>
        )}
      </Drawer>
    </>
  );
};
export default Form;
