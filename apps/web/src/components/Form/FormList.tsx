import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import toast from 'react-hot-toast';
import { useThemeUI } from 'theme-ui';
import {
  Box,
  DropdownMenu,
  Flex,
  Modal,
  Pagination,
  Table,
  Text,
} from '@wraft/ui';
import { EllipsisHIcon } from '@wraft/icon';

import { TimeAgo } from 'common/Atoms';
import ConfirmDelete from 'common/ConfirmDelete';
import { NextLinkText } from 'common/NavLink';
import { fetchAPI, deleteAPI } from 'utils/models';

export interface Theme {
  total_pages: number;
  total_entries: number;
  form_collections: FormElement[];
  page_number: number;
}

export interface FormElement {
  updated_at: string;
  title: string;
  inserted_at: string;
  id: string;
  description: string;
}

interface Meta {
  total_pages: number;
  total_entries: number;
  page_number: number;
}

type Props = {
  rerender: boolean;
  setRerender: (e: any) => void;
};

const FormList = ({ rerender, setRerender }: Props) => {
  const [contents, setContents] = useState<Array<FormElement>>([]);
  const [pageMeta, setPageMeta] = useState<Meta>();
  const [loading, setLoading] = useState<boolean>(true);
  const [page, setPage] = useState<number>(1);
  const [isOpen, setIsOpen] = useState<number | null>(null);
  const [deleteOpen, setDeleteOpen] = useState<number | null>(null);

  const { theme } = useThemeUI();

  const loadData = (pageNumber: number) => {
    setLoading(true);
    const query =
      pageNumber > 0 ? `?page=${pageNumber}&sort=inserted_at_desc` : '';
    fetchAPI(`forms${query}`)
      .then((data: any) => {
        setLoading(false);
        const res: FormElement[] = data.forms;
        setContents(res);
        setPageMeta(data);
      })
      .catch(() => {
        setLoading(false);
      });
  };

  const onDelete = (id: string) => {
    deleteAPI(`forms/${id}`).then(() => {
      setRerender((prev: boolean) => !prev);
      toast.success('Deleted Theme', {
        duration: 1000,
        position: 'top-right',
      });
    });
    setDeleteOpen(null);
  };

  useEffect(() => {
    loadData(page);
  }, [page, rerender]);

  const router: any = useRouter();
  const currentPage: any = parseInt(router.query.page) || 1;
  const columns = [
    {
      id: 'content.name',
      header: 'Name',
      accessorKey: 'content.name',
      enableSorting: false,
      size: 250,
      cell: ({ row }: any) => {
        return (
          <NextLinkText href={`/forms/${row.original?.id}`}>
            <Text fontWeight="heading">{row.original?.name}</Text>
          </NextLinkText>
        );
      },
    },
    {
      id: 'content.description',
      header: 'Description',
      accessorKey: 'content.description',
      enableSorting: false,
      size: 250,
      cell: ({ row }: any) => {
        return <Text>{row.original?.description}</Text>;
      },
    },
    {
      id: 'content.updated_at',
      header: 'Last Updated',
      accessorKey: 'content.updated_at',
      enableSorting: false,
      cell: ({ row }: any) => {
        return (
          row.original.updated_at && <TimeAgo time={row.original?.updated_at} />
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
            <Flex justifyContent="space-between">
              <DropdownMenu.Provider>
                <DropdownMenu.Trigger>
                  <Box
                    onClick={() => {
                      setIsOpen(row.index);
                    }}>
                    <EllipsisHIcon
                      color={
                        (theme.colors &&
                          theme.colors.gray &&
                          theme.colors.gray[800]) ||
                        'black'
                      }
                    />
                  </Box>
                </DropdownMenu.Trigger>
                <DropdownMenu aria-label="action-dropdown">
                  <DropdownMenu.Item
                    onClick={() => {
                      setIsOpen(null);
                      setDeleteOpen(row.index);
                    }}>
                    Delete
                  </DropdownMenu.Item>
                </DropdownMenu>
              </DropdownMenu.Provider>
            </Flex>
            <Modal
              ariaLabel="Delete form"
              open={deleteOpen === row.index}
              onClose={() => setDeleteOpen(null)}>
              {
                <ConfirmDelete
                  title="Delete Form"
                  text={`Are you sure you want to delete ‘${row.original.name}’?`}
                  setOpen={setDeleteOpen}
                  onConfirmDelete={async () => {
                    onDelete(row.original.id);
                  }}
                />
              }
            </Modal>
          </>
        );
      },
    },
  ];

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
  return (
    <Flex direction="column" gap="md">
      <Table
        data={contents}
        columns={columns}
        isLoading={loading}
        emptyMessage="No forms has been created yet."
      />
      <Box>
        {pageMeta && pageMeta?.total_pages > 1 && (
          <Pagination
            totalPage={pageMeta.total_pages}
            initialPage={currentPage}
            onPageChange={changePage}
            totalEntries={pageMeta.total_entries}
          />
        )}
      </Box>
    </Flex>
  );
};

export default FormList;
