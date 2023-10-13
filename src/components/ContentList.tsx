import React, { useEffect, useState } from 'react';
import { Box, Text, Avatar, Flex, Container } from 'theme-ui';

import { Table } from './Table';

import { fetchAPI } from '../utils/models';
import { TimeAgo, FilterBlock, BoxWrap, StateBadge } from './Atoms';
import Paginate from './Paginate';
import PageHeader from './PageHeader';
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

/**
 * Content List
 * ============
 *
 * @returns
 */
const ContentList = () => {
  // const token = useStoreState((state) => state.auth.token);

  const [contents, setContents] = useState<Array<IField>>([]);
  const [variants, setVariants] = useState<Array<any>>([]);
  const [pageMeta, setPageMeta] = useState<IPageMeta>();
  const [loading, setLoading] = useState<boolean>(false);
  const [page, setPage] = useState<number>();
  const [total, setTotal] = useState<number>(1);
  const [vendors, setVendors] = useState<Array<any>>([]);

  useEffect(() => {
    loadData(1);
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
    const pageNo = page > 0 ? `?page=${page}&sort=inserted_at_desc` : '';
    fetchAPI(`contents${pageNo}`)
      .then((data: any) => {
        setLoading(true);
        const res: IField[] = data.contents;
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
    if (contents && contents.length > 0) {
      const row: any = [];
      contents.map((r: any) => {
        const rFormated = {
          col1: (
            <Box
              sx={{
                borderRadius: '4px',
                height: '40px',
                width: '5px',
                border: 'solid 1px',
                borderColor: 'gray.1',
                bg: r.content_type.color,
                mr: 0,
                // ml: 2,
                mt: 2,
              }}
            />
          ),
          col2: (
            <BoxWrap
              id={r.content?.instance_id}
              name={r.content?.serialized?.title}
              xid={r.content?.id}
            />
          ),
          col3: (
            <Box pt={1}>
              <TimeAgo time={r.content.updated_at} />
            </Box>
          ),
          col4: <Avatar mt={2} width="20px" src={r.creator?.profile_pic} />,
          status: (
            <StateBadge name={r.state && r.state.state} color="#E2F7EA" />
          ),
        };

        row.push(rFormated);
      });

      setVendors(row);
    }
  }, [contents]);

  return (
    <Box sx={{ pl: 0, minHeight: '100%', bg: 'neutral.0' }}>
      <PageHeader title="Documents" desc="Manage all documents" />
      <Container variant="layout.pageFrame">
        <Flex>
          <Box sx={{ flexGrow: 1 }}>
            {!loading && <ContentLoader />}
            <Box mx={0} mb={3} sx={{}}>
              {loading && vendors && (
                <Table
                  options={{
                    columns: [
                      {
                        Header: '',
                        accessor: 'col1', // accessor is the "key" in the data
                        width: 'auto',
                      },
                      {
                        Header: 'Name',
                        accessor: 'col2',
                        width: '60%',
                      },
                      {
                        Header: 'Time',
                        accessor: 'col3',
                        width: '15%',
                      },
                      {
                        Header: 'Editors',
                        accessor: 'col4',
                        width: '15%',
                      },
                      {
                        Header: 'Status',
                        accessor: 'status',
                        width: '15%',
                      },
                    ],
                    data: vendors,
                  }}
                />
              )}
            </Box>
            <Paginate
              changePage={changePage}
              {...pageMeta}
              info={`${total} of ${total} pages`}
            />
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
                  color: 'gray.6',
                }}>
                Filter by Variant
              </Text>
              <Box
                sx={{
                  borderRight: 'solid 1px',
                  borderLeft: 'solid 1px',
                  borderTop: 'solid 1px',
                  borderColor: 'neutral.1',
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
                  color: 'gray.6',
                }}>
                Filter by State
              </Text>
              <Box
                sx={{
                  borderRight: 'solid 1px',
                  borderLeft: 'solid 1px',
                  borderTop: 'solid 1px',
                  borderColor: 'neutral.1',
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
