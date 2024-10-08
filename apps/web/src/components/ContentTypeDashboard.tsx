import React, { useEffect, useState } from 'react';
import NextLink from 'next/link';
import { useRouter } from 'next/router';
import { Avatar, Box, Flex, Text } from 'theme-ui';
import { Pagination, Table, DropdownMenu } from '@wraft/ui';
import toast from 'react-hot-toast';
import { ThreeDotIcon } from '@wraft/icon';

import { TimeAgo } from 'common/Atoms';
import Modal from 'common/Modal';
import ConfirmDelete from 'common/ConfirmDelete';
import { fetchAPI, deleteAPI, postAPI } from 'utils/models';

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
  name: string;
  layout_id: string;
  layout: ILayout;
  description: string;
}

export interface IFieldItem {
  name: string;
  type: string;
}

interface Props {
  rerender: boolean;
  setRerender?: (prev: any) => void;
}

const ContentTypeDashboard = ({ rerender, setRerender }: Props) => {
  const [contents, setContents] = useState<Array<IField>>([]);
  const [deleteVariant, setDeleteVariant] = useState<number | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [page, setPage] = useState<number>(1);
  const [pageMeta, setPageMeta] = useState<any>();

  const router: any = useRouter();
  const currentPage: any = parseInt(router.query.page) || 1;

  useEffect(() => {
    if (page) {
      loadData();
    }
  }, [currentPage, rerender]);

  const onDelete = (id: string) => {
    deleteAPI(`content_types/${id}`)
      .then(() => {
        setDeleteVariant(null);
        setRerender && setRerender((prev: boolean) => !prev);
        toast.success('Deleted Successfully', { duration: 1000 });
      })
      .catch(() => {
        toast.error('Delete Failed', { duration: 1000 });
      });
  };

  const loadData = () => {
    setLoading(true);

    const pageNo = currentPage ? `&page=${currentPage}` : '';

    const query = `sort=inserted_at_desc${pageNo}`;

    fetchAPI(`content_types?${query}`)
      .then((data: any) => {
        setLoading(false);
        const res: IField[] = data.content_types;
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

  const generateRandomPrefix = (length = 6) => {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    let prefix = '';
    for (let i = 0; i < length; i++) {
      prefix += characters.charAt(
        Math.floor(Math.random() * characters.length),
      );
    }
    return prefix;
  };

  const onCloneContentType = (row: any) => {
    const originalData = row.original;
    const randomPrefix = generateRandomPrefix();

    const convertedData = {
      name: `${originalData.name} ${randomPrefix} duplicate`,
      layout_id: originalData.layout.id,
      fields: originalData.fields.map((field: any) => ({
        name: field.name,
        key: field.name,
        field_type_id: field.field_type.id,
      })),
      description: originalData.description,
      prefix: randomPrefix,
      flow_id: originalData.flow.id,
      color: originalData.color,
      theme_id: originalData.theme.id,
    };

    postAPI('content_types', convertedData)
      .then((content: any) => {
        router.push(`/content-types/${content.id}`);
        toast.success('Created Successfully', {
          duration: 1000,
          position: 'top-right',
        });
      })
      .catch(() => {
        toast.error('Failed', {
          duration: 1000,
          position: 'top-right',
        });
      });
  };

  const columns = [
    {
      id: 'title',
      header: 'NAME',
      accessorKey: 'title',
      cell: ({ row }: any) => (
        <NextLink href={`/content-types/${row?.original?.id}`}>
          <Flex sx={{ fontSize: 'xs', ml: '-14px' }}>
            <Box
              sx={{
                width: '3px',
                bg: row.original?.color ? row.original?.color : 'blue',
              }}
            />
            <Box ml={3}>
              <Box sx={{ color: 'gray.1000' }}>{row.original?.prefix}</Box>
              <Box as="h5" sx={{ fontSize: 'sm', fontWeight: 500 }}>
                {row?.original?.name}
              </Box>
            </Box>
          </Flex>
        </NextLink>
      ),
      enableSorting: false,
    },
    {
      id: 'content.updated_at',
      header: 'FLOW',
      accessorKey: 'TIME',
      cell: ({ row }: any) => (
        <Box sx={{ fontSize: '14px' }}>{row.original?.flow?.name}</Box>
      ),
      enableSorting: false,
    },
    {
      id: 'content.updated_at',
      header: 'THEME',
      accessorKey: 'TIME',
      cell: ({ row }: any) => (
        <Box sx={{ fontSize: 'sm' }}>{row.original?.theme?.name}</Box>
      ),
      enableSorting: false,
    },
    {
      id: 'content.updated_at',
      header: 'LAYOUT',
      accessorKey: 'TIME',
      cell: ({ row }: any) => (
        <Box sx={{ fontSize: 'sm' }}>{row.original?.layout?.name}</Box>
      ),
      enableSorting: false,
    },

    {
      id: 'content.updated_at',
      header: 'CREATED BY',
      accessorKey: 'TIME',
      cell: ({ row }: any) => (
        <Flex sx={{ alignItems: 'center', gap: '8px' }}>
          <Avatar
            sx={{ width: '16px', height: '16px' }}
            src={row.original?.creator?.profile_pic}
          />
          <Box sx={{ fontSize: 'sm' }}>{row.original?.creator?.name}</Box>
        </Flex>
      ),
      enableSorting: false,
    },
    {
      id: 'content.updated_at',
      header: 'CREATED AT',
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
      header: '',
      cell: ({ row }: any) => (
        <Flex sx={{ justifyContent: 'space-between' }}>
          <Box />
          <Box>
            <DropdownMenu.Provider>
              <DropdownMenu.Trigger>
                <Box
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    position: 'relative',
                    cursor: 'pointer',
                    margin: '0px',
                    padding: '0px',
                    bg: 'transparent',
                    ':disabled': {
                      display: 'none',
                    },
                  }}>
                  <ThreeDotIcon />
                </Box>
              </DropdownMenu.Trigger>
              <DropdownMenu aria-label="dropdown role">
                <DropdownMenu.Item onClick={() => onCloneContentType(row)}>
                  Clone
                </DropdownMenu.Item>

                <DropdownMenu.Item
                  onClick={() => {
                    setDeleteVariant(row.index);
                  }}>
                  <Text variant="" sx={{ cursor: 'pointer', color: 'red.600' }}>
                    Delete
                  </Text>
                </DropdownMenu.Item>
              </DropdownMenu>
              <Modal
                isOpen={deleteVariant === row.index}
                onClose={() => setDeleteVariant(null)}>
                {
                  <ConfirmDelete
                    title="Delete Variant"
                    text={`Are you sure you want to delete ‘${row.original.name}’?`}
                    setOpen={setDeleteVariant}
                    onConfirmDelete={async () => {
                      onDelete(row.original.id);
                    }}
                  />
                }
              </Modal>
            </DropdownMenu.Provider>
          </Box>
        </Flex>
      ),

      enableSorting: false,
      textAlign: 'right',
    },
  ];

  return (
    <Box>
      <Table
        data={contents}
        isLoading={loading}
        columns={columns}
        skeletonRows={10}
        emptyMessage="No blocks has been created yet."
      />
      <Box mt="16px">
        {pageMeta && pageMeta?.total_pages > 1 && (
          <Pagination
            totalPage={pageMeta?.total_pages}
            initialPage={currentPage}
            onPageChange={changePage}
            totalEntries={pageMeta?.total_entries}
          />
        )}
      </Box>
    </Box>
  );
};
export default ContentTypeDashboard;
