import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { Box, Flex, Text } from '@wraft/ui';
import { Drawer, Button, Pagination, useDrawer } from '@wraft/ui';
import { Table } from '@wraft/ui';
import { X } from '@phosphor-icons/react';

import Link from 'common/NavLink';
import PageHeader from 'common/PageHeader';
import { fetchAPI } from 'utils/models';

import PipelineTypeForm from './PipelineTypeForm';
import PipelineFormEntry from '../PipelineFormEntry';

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
  const [formName, setFormName] = useState<any>();
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);
  const [page, setPage] = useState<number>(1);
  const [pageMeta, setPageMeta] = useState<IPageMeta>();
  const [pipelineId, setPipelineId] = useState<any>();
  const [rerender, setRerender] = React.useState(false);
  const [showSearch, setShowSearch] = useState<boolean>(false);
  const [sourceId, setSourceId] = useState<any>();

  const router: any = useRouter();
  const currentPage: any = parseInt(router.query.page) || 1;

  const mobileMenuDrawer = useDrawer();
  const formMenuDrawer = useDrawer();

  const loadData = () => {
    setLoading(true);
    const pageNo = currentPage ? `&page=${currentPage}` : '';

    const query = `sort=inserted_at_desc${pageNo}`;

    fetchAPI(`pipelines?${query}`).then((data: any) => {
      const res: Pipeline[] = data.pipelines;
      setContents(res);
      setPageMeta(data);
      setLoading(false);
    });
  };

  useEffect(() => {
    if (page) {
      loadData();
    }
  }, [currentPage, rerender]);

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
      cell: ({ row }: any) => <Text>{row.original.inserted_at}</Text>,
      enableSorting: false,
    },
    {
      id: 'content.name',
      header: 'Action',
      accessorKey: 'content.name',
      cell: ({ row }: any) => (
        <Flex gap="sm">
          <Button
            onClick={() => router.push(`/workflow/${row.original.id}`)}
            variant="tertiary"
            size="sm"
            disabled={row.original.stages_count == 0}>
            WorkFlow
          </Button>
          <Button
            onClick={() => {
              onRunClick(row.original.source_id, row.original.id);
            }}
            variant="tertiary"
            size="sm"
            disabled={row.original.stages_count == 0}>
            Run
          </Button>
        </Flex>
      ),
      enableSorting: false,
    },
  ];

  return (
    <Box minHeight="100%" bg="background-secondary">
      <PageHeader title="All Pipelines">
        <Button variant="tertiary" onClick={() => setShowSearch(true)}>
          New Pipeline
        </Button>
      </PageHeader>

      <Box px="lg" py="lg" w="80%">
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
      </Box>

      <Drawer open={showSearch} store={mobileMenuDrawer} withBackdrop={true}>
        {showSearch && (
          <PipelineTypeForm
            setIsOpen={setShowSearch}
            setRerender={setRerender}
          />
        )}
      </Drawer>
      <Drawer open={isOpen} store={formMenuDrawer} withBackdrop={true}>
        {isOpen && (
          <>
            <Drawer.Header>
              <Drawer.Title>{formName}</Drawer.Title>
              <X
                size={20}
                weight="bold"
                cursor="pointer"
                onClick={() => setIsOpen(false)}
              />
            </Drawer.Header>
            <PipelineFormEntry
              formId={sourceId}
              pipelineId={pipelineId}
              setIsOpen={setIsOpen}
              setFormName={setFormName}
            />
          </>
        )}
      </Drawer>
    </Box>
  );
};
export default Form;
