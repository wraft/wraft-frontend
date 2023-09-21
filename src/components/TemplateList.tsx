import React, { useEffect, useState } from 'react';
import { Box, Text } from 'theme-ui';

// import { useTable } from 'react-table';
// import styled from 'styled-components';
// import { useStoreState } from 'easy-peasy';
// import { Plus } from '@styled-icons/boxicons-regular';
import { fetchAPI } from '../utils/models';
import Paginate, { IPageMeta } from './Paginate';
import Link from './NavLink';
import PageHeader from './PageHeader';
import { Table } from './Table';
import ContentLoader from './ContentLoader';

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

export interface IField {
  id: string;
  title: string;
  title_template: string;
  layout_id: string;
  layout: ILayout;
  description: string;
}

export interface IFieldItem {
  name: string;
  type: string;
}

const TemplateList = () => {
  // const [contents, setContents] = useState<Array<IField>>([]);

  const [contents, setContents] = useState<Array<IField>>([]);
  const [pageMeta, setPageMeta] = useState<IPageMeta>();
  const [loading, setLoading] = useState<boolean>(false);
  const [page, setPage] = useState<number>();
  const [total, setTotal] = useState<number>(0);

  const [templates, setTemplates] = useState<Array<any>>([]);

  useEffect(() => {
    loadData(1);
  }, []);

  useEffect(() => {
    if (page) {
      loadData(page);
    }
  }, [page]);

  const loadData = (page: number) => {
    const pageNo = page > 0 ? `?page=${page}` : '';
    fetchAPI(`data_templates${pageNo}`)
      .then((data: any) => {
        setLoading(true);
        const res: IField[] = data.data_templates;
        setTotal(data.total_pages);
        setContents(res);
        setPageMeta(data);
      })
      .catch(() => {
        setLoading(true);
      });
  };

  const changePage = (_e: any) => {
    console.log('page', _e?.selected);
    setPage(_e?.selected + 1);
  };

  useEffect(() => {
    loadData(total);
  }, []);

  useEffect(() => {
    if (contents && contents.length > 0) {
      const row: any = [];
      contents.map((r: any) => {
        const rFormated = {
          col2: (
            <Text sx={{ fontSize: 1, fontWeight: 'body', py: 2 }}>
              {r.updated_at}
            </Text>
          ),
          col3: (
            <Box sx={{ px: 3, py: 2 }}>
              <Link
                href={`/templates/edit/${r.id}`}
                variant="btnSmall"
                locale={''}>
                Edit
              </Link>
            </Box>
          ),
          col1: (
            <Box sx={{ px: 3, py: 2 }}>
              <Text as="h5">{r.title}</Text>
              <Text sx={{ color: 'gray.6' }}></Text>
            </Box>
          ),
        };

        row.push(rFormated);
      });

      setTemplates(row);
    }
  }, [contents]);

  return (
    <Box sx={{ pl: 0, minHeight: '100%', bg: 'neutral.0' }}>
      <PageHeader title="Templates" desc="Content Templates for Variants">
        <Box sx={{ ml: 'auto', pt: 2 }}>
          <Link href="/templates/new" variant="btnSecondary" locale={''}>
            + New Template
          </Link>
        </Box>
      </PageHeader>
      <Box variant="layout.pageFrame" sx={{ py: 4 }}>
        {!loading && <ContentLoader />}
        <Box mx={0} mb={3}>
          {loading && templates && (
            <Table
              options={{
                columns: [
                  {
                    Header: 'Name',
                    accessor: 'col1', // accessor is the "key" in the data
                    width: '30%',
                  },
                  {
                    Header: 'Updated',
                    accessor: 'col2',
                    width: '30%',
                  },
                  {
                    Header: 'Action',
                    accessor: 'col3',
                    width: '10%',
                  },
                ],
                data: templates,
              }}
            />
          )}

          <Paginate changePage={changePage} {...pageMeta} />

          {/* <Box>
            {contents &&
              contents.length > 0 &&
              contents.map((m: any) => <ItemField key={m.id} {...m} />)}
          </Box> */}
        </Box>
      </Box>
    </Box>
  );
};
export default TemplateList;
