import React, { useEffect, useState } from 'react';

import { Box, Flex, Text } from 'theme-ui';

import { fetchAPI } from '../utils/models';
import { IField } from '../utils/types/content';

import { TimeAgo } from './Atoms';
import ContentLoader from './ContentLoader';
import Link from './NavLink';
import PageHeader from './PageHeader';
import Paginate, { IPageMeta } from './Paginate';
import { Table } from './Table';

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
          col2: <TimeAgo time={r.updated_at} />,
          col3: (
            <Box sx={{ px: 3 }}>
              <Link
                href={`/templates/edit/${r.id}`}
                variant="buttons.btnSecondary"
                locale={''}>
                Edit
              </Link>
            </Box>
          ),
          col4: (
            <Flex sx={{ px: 3, py: 2 }}>
              <Text sx={{ fontSize: 1, fontWeight: 'body', display: 'flex' }}>
                <Box
                  as="span"
                  sx={{
                    display: 'block',
                    borderRadius: '4px',
                    height: '12px',
                    width: '12px',
                    border: 'solid 1px',
                    borderColor: 'border',
                    bg: r.content_type.color,
                    mr: 2,
                    // ml: 2,
                    mt: 2,
                  }}
                />
                {r?.content_type?.name}
              </Text>
            </Flex>
          ),
          col1: (
            <Box sx={{ px: 3, py: 2 }}>
              <Link
                href={`/templates/edit/${r.id}`}
                // variant=""
                locale={''}>
                <Text sx={{ fontSize: 2 }}>{r.title}</Text>
              </Link>
            </Box>
          ),
        };

        row.push(rFormated);
      });

      setTemplates(row);
    }
  }, [contents]);

  return (
    <Box sx={{ pl: 0, minHeight: '100%', bg: 'neutral.100' }}>
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
                    Header: 'Variant',
                    accessor: 'col4',
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
