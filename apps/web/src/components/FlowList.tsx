import React, { FC, useEffect, useState } from 'react';

import { Drawer } from '@wraft-ui/Drawer';
import Router from 'next/router';
import toast from 'react-hot-toast';
import { Box, Spinner } from 'theme-ui';

import { deleteAPI, fetchAPI } from '../utils/models';

import { TimeAgo } from './Atoms';
import { Button, Table } from './common';
import FlowForm from './FlowForm';
import { OptionsIcon } from './Icons';
import Paginate, { IPageMeta } from './Paginate';

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
  // const [flows, setFlows] = useState<Array<any>>([]);
  const [isOpen, setIsOpen] = useState<number | null>(null);

  useEffect(() => {
    console.log('❤️‍🔥......contents', contents);
  }, [contents]);
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

  const columns = [
    {
      id: 'content.name',
      header: 'Name',
      accessorKey: 'content.name',
      enableSorting: false,
      cell: ({ row }: any) => {
        console.log('roooooooooooooooo', row);
        return (
          <Button
            variant="text"
            onClick={() => {
              // setIsEdit(row.index);
              Router.push(`/manage/flows/${row.original?.flow?.id}`);
            }}>
            <Box>
              <Box>{row.original?.flow?.name}</Box>
            </Box>
            <Drawer open={false} setOpen={() => {}}>
              <FlowForm
                setOpen={() => {}}
                // cId={row.original.id}
              />
            </Drawer>
          </Button>
        );
      },
    },
    {
      id: 'content.updated_at',
      header: 'Updated',
      accessorKey: 'content.updated_at',
      enableSorting: false,
      cell: ({ row }: any) => {
        return (
          row.original.flow.updated_at && (
            <TimeAgo time={row.original?.flow?.updated_at} />
          )
        );
      },
    },
    {
      id: 'content.id',
      header: '',
      accessor: 'content.id',
      enableSorting: false,
      cell: ({ row }: any) => {
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
                    variant="text"
                    onClick={async () => {
                      setIsOpen(null);
                      await deleteAPI(`flows/${contents[row.index].flow.id}`);
                      setTimeout(() => {
                        setRerender((prev: boolean) => !prev);
                        toast.success('Deleted a flow', {
                          duration: 1000,
                          position: 'top-right',
                        });
                      }, 1000);
                    }}
                    style={{
                      cursor: 'pointer',
                      textAlign: 'left',
                      width: '100%',
                      background: 'white',
                      color: 'red.600',
                      padding: 3,
                      // ':disabled': {
                      //   color: 'gray.300',
                      // },
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
    },
  ];

  return (
    <Box sx={{ width: '100%' }}>
      <Box mx={0} sx={{ width: '100%' }}>
        {!loading && (
          <Box>
            <Spinner width={40} height={40} color="primary" />
          </Box>
        )}

        <Box sx={{ width: '100%' }}>
          <Box mx={0} mb={3} sx={{ width: '100%' }}>
            {contents && <Table data={contents} columns={columns} />}
          </Box>
          <Box mx={2}>
            <Paginate
              changePage={changePage}
              {...pageMeta}
              info={`${page} of ${total} pages`}
            />
          </Box>
        </Box>
      </Box>
    </Box>
  );
};
export default Form;
