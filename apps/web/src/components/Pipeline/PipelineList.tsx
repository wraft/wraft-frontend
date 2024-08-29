import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { Box, Flex, Text } from 'theme-ui';
import { Drawer, Button, Pagination, useDrawer } from '@wraft/ui';
import { Table } from '@wraft/ui';
import { X } from '@phosphor-icons/react';

import { fetchAPI } from '../../utils/models';
import Link from '../NavLink';
import PageHeader from '../PageHeader';
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
  const [showSearch, setShowSearch] = useState<boolean>(false);
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [rerender, setRerender] = React.useState(false);
  const [loading, setLoading] = useState<boolean>(true);
  const [pageMeta, setPageMeta] = useState<IPageMeta>();
  const [sourceId, setSourceId] = useState<any>();
  const [pipelineId, setPipelineId] = useState<any>();
  const [page, setPage] = useState<number>(1);
  const [formName, setFormName] = useState<any>();

  console.log(contents, 'logcont');

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

  const pipelineDetail = (id: any) => {
    fetchAPI(`pipelines/${id}`);
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

  const onRunClick = (formId: any, pipelineId: any) => {
    setIsOpen(true);
    setSourceId(formId);
    setPipelineId(pipelineId);
  };

  const columns = [
    {
      id: 'pipeline.name',
      header: 'NAME',
      accessorKey: 'pipeline.name',
      cell: ({ row }: any) => (
        <Box
          sx={{ display: 'flex', justifyContent: 'flex-start' }}
          key={row.index}>
          <Link href={`/manage/pipelines/run/${row.original.id}`}>
            <Text as="h4" variant="pM">
              {row.original.name}
            </Text>
          </Link>
        </Box>
      ),
      enableSorting: false,
    },
    {
      id: 'pipeline.run',
      header: 'LAST RUN',
      accessorKey: 'pipeline.run',
      cell: ({ row }: any) => (
        <Box
          sx={{ display: 'flex', justifyContent: 'flex-start' }}
          key={row.index}>
          <Text as="p" variant="pM">
            {row.original.inserted_at}
          </Text>
        </Box>
      ),
      enableSorting: false,
    },
    {
      id: 'content.name',
      header: (
        <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
          <Text as="p" variant="pS">
            ACTIONS
          </Text>
        </Box>
      ),
      accessorKey: 'content.name',
      cell: ({ row }: any) => (
        <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
          <Button
            onClick={() => {
              onRunClick(row.original.source_id, row.original.id);
            }}
            variant="secondary"
            disabled={row.original.stages_count == 0}>
            Run
          </Button>
        </Box>
      ),
      enableSorting: false,
    },
  ];

  return (
    <Box>
      <PageHeader title="All Pipelines">
        <Flex sx={{ flexGrow: 1, ml: 'auto', mr: 0, pt: 1, mt: 0 }}>
          <Button variant="secondary" onClick={() => setShowSearch(true)}>
            New Pipeline
          </Button>
        </Flex>
      </PageHeader>
      <Box variant="layout.pageFrame" sx={{ py: 4 }}>
        <Box mt={0}>
          <Table data={contents} columns={columns} isLoading={loading} />
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
