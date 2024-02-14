import React, { FC, useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { Box, Text, Spinner, Button } from 'theme-ui';

import { deleteAPI, fetchAPI } from '../utils/models';
import { TimeAgo } from './Atoms';
import { OptionsIcon } from './Icons';
import MenuItem from './NavLink';
import Paginate, { IPageMeta } from './Paginate';
import { Table } from './Table';

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
          col2: <TimeAgo time={r.flow.updated_at} />,
        };

        row.push(rFormated);
      });

      setFlows(row);
    }
  }, [contents, rerender]);

  return (
    <Box sx={{ width: '100%' }}>
      <Box mx={0} mb={3} sx={{ width: '100%' }}>
        {!loading && (
          <Box>
            <Spinner width={40} height={40} color="primary" />
          </Box>
        )}

        <Box sx={{ width: '100%' }}>
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
                                    bg: 'backgroundWhite',
                                    right: 0,
                                    top: 0,
                                    zIndex: 10,
                                    border: '1px solid',
                                    borderColor: 'border',
                                    width: '155px',
                                  }}>
                                  <Button
                                    variant="text.pM"
                                    onClick={async () => {
                                      setIsOpen(null);
                                      await deleteAPI(
                                        `flows/${contents[row.index].flow.id}`,
                                      );
                                      setTimeout(() => {
                                        setRerender((prev: boolean) => !prev);
                                        toast.success('Deleted a flow', {
                                          duration: 1000,
                                          position: 'top-right',
                                        });
                                      }, 1000);
                                    }}
                                    sx={{
                                      cursor: 'pointer',
                                      textAlign: 'left',
                                      width: '100%',
                                      bg: 'backgroundWhite',
                                      color: 'red.600',
                                      p: 3,
                                      ':disabled': {
                                        color: 'gray.300',
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
          <Paginate
            changePage={changePage}
            {...pageMeta}
            info={`${page} of ${total} pages`}
          />
        </Box>
      </Box>
    </Box>
  );
};
export default Form;
