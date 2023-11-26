import React, { FC, useEffect, useState } from 'react';
import { Box, Text, Spinner, Button } from 'theme-ui';
import MenuItem from './NavLink';
import { deleteEntity, fetchAPI } from '../utils/models';
import Paginate, { IPageMeta } from './Paginate';

import { Table } from './Table';
import { OptionsIcon } from './Icons';
import { useStoreState } from 'easy-peasy';

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

export interface IFlow {
  name: string;
  inserted_at: string;
  id: string;
  email: string;
}

export interface ICreator {
  updated_at: string;
  name: string;
  inserted_at: string;
  id: string;
  email: string;
}

export interface IField {
  user_count: number;
  id: string;
  name: string;
  flow: IFlow;
  creator: ICreator;
}

export interface IFieldItem {
  name: string;
  type: string;
}

const ItemField: FC<any> = ({ flow }) => {
  return (
    <Box key={flow.id} pb={2} pt={2} sx={{ borderBottom: 'solid 1px #eee' }}>
      <MenuItem
        href={`/manage/flows/edit/[id]`}
        path={`/manage/flows/edit/${flow.id}`}>
        <Box>
          <Text as="h4">{flow.name}</Text>
          {/* <Text sx={{ fontSize: 0 }} color="gray.6">
            {flow.id}
          </Text> */}
        </Box>
      </MenuItem>
    </Box>
  );
};

interface Props {
  rerender: boolean;
  setRerender: any;
}

const Form: FC<Props> = ({ rerender, setRerender }) => {
  const token = useStoreState((state) => state.auth.token);
  const [contents, setContents] = useState<Array<IField>>([]);
  const [pageMeta, setPageMeta] = useState<IPageMeta>();
  const [loading, setLoading] = useState<boolean>(false);
  const [page, setPage] = useState<number>(1);
  const [total, setTotal] = useState<number>(1);
  const [flows, setFlows] = useState<Array<any>>([]);
  const [isOpen, setIsOpen] = useState<number | null>(null);

  const loadData = (page: number) => {
    const pageNo = page > 0 ? `?page=${page}&sort=inserted_at_desc` : '';
    fetchAPI(`flows${pageNo}`)
      .then((data: any) => {
        setLoading(true);
        const res: IField[] = data.flows;
        setTotal(data.total_pages);
        setContents(res);
        setPageMeta(data);
      })
      .catch(() => {
        setLoading(true);
      });
  };

  const changePage = (_e: any) => {
    setPage(_e?.selected + 1);
  };

  useEffect(() => {
    loadData(page);
  }, [page, rerender]);

  useEffect(() => {
    if (contents && contents.length > 0) {
      const row: any = [];
      contents.map((r: any) => {
        const rFormated = {
          col1: <ItemField {...r} />,
          col2: <Box>{r.flow.updated_at}</Box>,
        };

        row.push(rFormated);
      });

      setFlows(row);
    }
  }, [contents, rerender]);

  return (
    <Box
      py={3}
      mt={4}
      sx={{ width: '100%' }}
      // variant="layout.pageFrame"
    >
      <Box mx={0} mb={3} sx={{ width: '100%' }}>
        {!loading && (
          <Box>
            <Spinner width={40} height={40} color="primary" />
          </Box>
        )}

        <Box
          //  variant="layout.contentFrame"
          sx={{ width: '100%' }}>
          <Box mx={0} mb={3} sx={{ width: '100%' }}>
            {flows && (
              <Table
                options={{
                  columns: [
                    {
                      Header: 'Name',
                      accessor: 'col1',
                      width: '50%',
                    },
                    {
                      Header: 'Updated',
                      accessor: 'col2',
                      width: '45%',
                    },
                    {
                      Header: '',
                      accessor: 'col3',
                      Cell: ({ row }) => {
                        return (
                          <>
                            <Box
                              sx={{ cursor: 'pointer', position: 'relative' }}
                              onClick={() => {
                                setIsOpen(row.index);
                              }}
                              onMouseLeave={() => setIsOpen(null)}>
                              <OptionsIcon />
                              {isOpen === row.index ? (
                                <Box
                                  sx={{
                                    position: 'absolute',
                                    bg: 'bgWhite',
                                    right: 0,
                                    top: 0,
                                    zIndex: 10,
                                    border: '1px solid',
                                    borderColor: 'neutral.1',
                                    width: '155px',
                                  }}>
                                  <Button
                                    variant="text.pM"
                                    onClick={async () => {
                                      setIsOpen(null);
                                      await deleteEntity(
                                        `flows/${contents[row.index].flow.id}`,
                                        token,
                                      );
                                      setTimeout(() => {
                                        setRerender((prev: boolean) => !prev);
                                      }, 1000);
                                    }}
                                    sx={{
                                      cursor: 'pointer',
                                      textAlign: 'left',
                                      width: '100%',
                                      bg: 'bgWhite',
                                      color: 'red.5',
                                      p: 3,
                                      ':disabled': {
                                        color: 'gray.2',
                                      },
                                    }}>
                                    Delete
                                  </Button>
                                </Box>
                              ) : (
                                <Box />
                              )}
                            </Box>
                          </>
                        );
                      },
                      width: '3%',
                    },
                  ],
                  data: flows,
                }}
              />
            )}
          </Box>
        </Box>
        <Paginate
          changePage={changePage}
          {...pageMeta}
          info={`${page} of ${total} pages`}
        />
      </Box>
    </Box>
  );
};
export default Form;
