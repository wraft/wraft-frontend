import React, { FC, useEffect, useState } from 'react';
import NextLink from 'next/link';
import { useRouter } from 'next/router';
// import { ThreeDotIcon } from '@wraft/icon';
import toast from 'react-hot-toast';
import { Avatar } from 'theme-ui';
import {
  Table,
  Pagination,
  DropdownMenu,
  Text,
  Box,
  Flex,
  Modal,
} from '@wraft/ui';
import { DotsThreeVertical } from '@phosphor-icons/react';

import ConfirmDelete from 'common/ConfirmDelete';
import { TimeAgo } from 'common/Atoms';
import { deleteAPI, fetchAPI } from 'utils/models';
import { usePermission } from 'utils/permissions';

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
  const [pageMeta, setPageMeta] = useState<any>();
  const [loading, setLoading] = useState<boolean>(false);
  const [page, setPage] = useState<number>(1);
  const [deleteFlow, setDeleteFlow] = useState<number | null>(null);

  const router: any = useRouter();
  const currentPage: any = parseInt(router.query.page) || 1;
  const { hasPermission } = usePermission();

  const loadData = (pageNumber: number) => {
    setLoading(true);
    const query =
      pageNumber > 0 ? `?page=${pageNumber}&sort=inserted_at_desc` : '';
    fetchAPI(`flows${query}`)
      .then((data: any) => {
        setLoading(false);
        const res: IField[] = data.flows;
        setContents(res);
        setPageMeta(data);
      })
      .catch(() => {
        setLoading(false);
      });
  };

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

  useEffect(() => {
    loadData(page);
  }, [page, rerender]);

  const onDelete = (index: number) => {
    setDeleteFlow(null);

    deleteAPI(`flows/${contents[index].flow.id}`).then(() => {
      setRerender((prev: boolean) => !prev);
      toast.success('Deleted a flow', {
        duration: 1000,
        position: 'top-right',
      });
    });
  };

  const columns = [
    {
      id: 'content.name',
      header: 'Name',
      accessorKey: 'content.name',
      enableSorting: false,
      size: 250,
      cell: ({ row }: any) => {
        return (
          <>
            <NextLink href={`/manage/flows/${row.original?.flow?.id}`}>
              <Text fontSize="base" fontWeight="bold">
                {row.original?.flow?.name}
              </Text>
            </NextLink>
            {/* <Drawer open={false} setOpen={() => {}}>
              <FlowForm setOpen={() => {}} />
            </Drawer> */}
          </>
        );
      },
    },
    {
      id: 'content.updated_at',
      header: 'LAST UPDATED',
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
      id: 'content.created',
      header: 'CREATED BY',
      accessorKey: 'created',
      cell: ({ row }: any) => (
        <Flex align="center" gap="sm">
          <Avatar
            sx={{ width: '16px', height: '16px' }}
            src={row.original?.creator?.profile_pic}
          />
          <Text>{row.original?.creator?.name}</Text>
        </Flex>
      ),
      enableSorting: false,
    },
    {
      id: 'content.id',
      header: '',
      accessor: 'content.id',
      enableSorting: false,
      cell: ({ row }: any) => {
        return (
          <>
            <Flex justify="space-between">
              <DropdownMenu.Provider>
                <DropdownMenu.Trigger>
                  <DotsThreeVertical size={12} stroke="bold" />
                </DropdownMenu.Trigger>
                {hasPermission('flow', 'delete') && (
                  <DropdownMenu aria-label="dropdown role">
                    <DropdownMenu.Item
                      onClick={() => {
                        setDeleteFlow(row.index);
                      }}>
                      Delete
                    </DropdownMenu.Item>
                  </DropdownMenu>
                )}
              </DropdownMenu.Provider>
            </Flex>
            <Modal
              ariaLabel="Delete Flow"
              open={deleteFlow === row.index}
              onClose={() => setDeleteFlow(null)}>
              {
                <ConfirmDelete
                  title="Delete Flow"
                  text={`Are you sure you want to delete ‘${row.original.flow.name}’?`}
                  setOpen={setDeleteFlow}
                  onConfirmDelete={async () => {
                    onDelete(row.index);
                  }}
                />
              }
            </Modal>
          </>
        );
      },
    },
  ];

  return (
    <Box w="100%">
      <Table data={contents} columns={columns} isLoading={loading} />
      {pageMeta && pageMeta?.total_pages > 1 && (
        <Pagination
          totalPage={pageMeta?.total_pages}
          initialPage={currentPage}
          onPageChange={changePage}
          totalEntries={pageMeta?.total_entries}
        />
      )}
    </Box>
  );
};
export default Form;
