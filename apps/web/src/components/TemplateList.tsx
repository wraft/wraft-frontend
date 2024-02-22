import React, { useEffect, useState } from 'react';
import NavLink from 'next/link';
import { Box, Flex, Text } from 'theme-ui';
import { Table } from '@wraft/ui';

import { fetchAPI } from '../utils/models';
import { IField } from '../utils/types/content';
import { TimeAgo } from './Atoms';
import Link from './NavLink';
import PageHeader from './PageHeader';
import Paginate, { IPageMeta } from './Paginate';
// import { Table } from './Table';

const columns = [
  {
    id: 'title',
    header: 'Name',
    accessorKey: 'title',
    cell: ({ row }: any) => (
      <NavLink href={`/templates/edit/${row?.original?.id}`}>
        <Box sx={{ fontSize: '15px', fontWeight: 500 }}>
          {row?.original?.title}
        </Box>
      </NavLink>
    ),
    size: 300,
    enableSorting: false,
  },
  {
    id: 'content.name',
    header: 'TYPE',
    accessorKey: 'content.name',
    cell: ({ row }: any) => (
      <Flex sx={{ alignItems: 'center', gap: 2 }}>
        <Box
          as="span"
          sx={{
            display: 'block',
            borderRadius: '4px',
            height: '12px',
            width: '12px',
            border: 'solid 1px',
            borderColor: 'border',
            alignItems: 'center',
            bg: row?.original?.content_type?.color,
          }}
        />

        <Text sx={{ fontSize: 1, fontWeight: 'body', display: 'flex' }}>
          {row?.original?.content_type?.name}
        </Text>
      </Flex>
    ),
    size: 350,
    enableSorting: false,
  },
  {
    id: 'content.updated_at',
    header: 'TIME',
    accessorKey: 'TIME',
    cell: ({ row }: any) => (
      <Box>
        <TimeAgo time={row.original?.updated_at} />
      </Box>
    ),
    enableSorting: false,
  },
  {
    id: 'content.name',
    header: 'ACTION',
    cell: ({ row }: any) => (
      <Box>
        <NavLink href={`/templates/edit/${row?.original?.id}`}>Edit</NavLink>
      </Box>
    ),
    enableSorting: false,
    textAlign: 'right',
  },
];

const TemplateList = () => {
  // const [contents, setContents] = useState<Array<IField>>([]);

  const [contents, setContents] = useState<Array<IField>>([]);
  const [pageMeta, setPageMeta] = useState<IPageMeta>();
  const [loading, setLoading] = useState<boolean>(false);
  const [page, setPage] = useState<number>();
  const [total, setTotal] = useState<number>(0);

  useEffect(() => {
    loadData(1);
  }, []);

  useEffect(() => {
    if (page) {
      loadData(page);
    }
  }, [page]);

  const loadData = (page: number) => {
    setLoading(true);
    const pageNo = page > 0 ? `?page=${page}` : '';
    fetchAPI(`data_templates${pageNo}`)
      .then((data: any) => {
        setLoading(false);
        const res: IField[] = data.data_templates;
        setTotal(data.total_pages);
        setContents(res);

        setPageMeta(data);
      })
      .catch(() => {
        setLoading(false);
      });
  };

  const changePage = (_e: any) => {
    console.log('page', _e?.selected);
    setPage(_e?.selected + 1);
  };

  useEffect(() => {
    loadData(total);
  }, []);

  return (
    <Box sx={{ pl: 0, minHeight: '100%', bg: 'neutral.100' }}>
      <PageHeader title="Templates" desc="Content Templates for Variants">
        <Box sx={{ ml: 'auto', pt: 2 }}>
          <Link href="/templates/new" variant="secondary" type="button">
            + New Template
          </Link>
        </Box>
      </PageHeader>
      <Box variant="layout.pageFrame" sx={{ py: 4 }}>
        <Box mx={0} mb={3}>
          <Table
            data={contents}
            isLoading={loading}
            columns={columns}
            skeletonRows={10}
            emptyMessage="No template has been created yet."
          />
          {pageMeta && <Paginate changePage={changePage} {...pageMeta} />}
        </Box>
      </Box>
    </Box>
  );
};
export default TemplateList;
