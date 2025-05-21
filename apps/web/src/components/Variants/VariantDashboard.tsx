import React, { useEffect, useState } from 'react';
import NextLink from 'next/link';
import { useRouter } from 'next/router';
import { Avatar } from 'theme-ui';
import {
  Pagination,
  Table,
  DropdownMenu,
  Box,
  Flex,
  Text,
  Modal,
} from '@wraft/ui';
import toast from 'react-hot-toast';
import { ThreeDotIcon } from '@wraft/icon';
import { DotsThree } from '@phosphor-icons/react';

import { PageInner, TimeAgo } from 'common/Atoms';
import ConfirmDelete from 'common/ConfirmDelete';
import { fetchAPI, deleteAPI, postAPI } from 'utils/models';
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

const VariantDashboard = ({ rerender, setRerender }: Props) => {
  const [contents, setContents] = useState<Array<IField>>([]);
  const [deleteVariant, setDeleteVariant] = useState<number | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [page, setPage] = useState<number>(1);
  const [pageMeta, setPageMeta] = useState<any>();
  const { hasPermission } = usePermission();

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

    postAPI('variant', convertedData)
      .then((content: any) => {
        router.push(`/variants/${content.id}`);
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
      id: 'content.id',
      header: 'Id',
      accessorKey: 'id',
      cell: ({ row }: any) => (
        <Text fontSize="sm2">{row.original?.prefix}</Text>
      ),
      enableSorting: false,
    },
    {
      id: 'Name',
      header: 'Name',
      accessorKey: 'name',
      cell: ({ row }: any) => (
        <NextLink href={`/variants/${row?.original?.id}`}>
          <Flex>
            <Box
              w="3px"
              bg={row.original?.color ? row.original?.color : 'blue'}
            />
            <Box ml="sm">
              {/* <Text fontSize="sm" color="text-secondary">
                {row.original?.prefix}
              </Text> */}
              <Text fontWeight="heading">{row?.original?.name}</Text>
            </Box>
          </Flex>
        </NextLink>
      ),
      enableSorting: false,
    },

    {
      id: 'content.flow',
      header: 'Flow',
      accessorKey: 'flow',
      cell: ({ row }: any) => (
        <Text fontSize="sm2">{row.original?.flow?.name}</Text>
      ),
      enableSorting: false,
    },
    // {
    //   id: 'content.theme',
    //   header: 'Theme',
    //   cell: ({ row }: any) => <Text>{row.original?.theme?.name}</Text>,
    //   enableSorting: false,
    // },

    // {
    //   id: 'content.layout',
    //   header: 'Layout',
    //   accessorKey: 'layout',
    //   cell: ({ row }: any) => <Text>{row.original?.layout?.name}</Text>,
    //   enableSorting: false,
    // },
    {
      id: 'content.type',
      header: 'Type',
      cell: ({ row }: any) => <Text>{row.original?.type}</Text>,
      enableSorting: false,
    },
    {
      id: 'content.creator',
      header: 'Created By',
      cell: ({ row }: any) => (
        <Flex align="center" gap="sm">
          <Avatar
            sx={{ width: '16px', height: '16px' }}
            src={row.original?.creator?.profile_pic}
          />
          <Text fontSize="sm2" fontWeight={500}>
            {row.original?.creator?.name}
          </Text>
        </Flex>
      ),
      enableSorting: false,
    },
    {
      id: 'content.updated_at',
      header: 'Created at',
      accessorKey: 'TIME',
      cell: ({ row }: any) => (
        <TimeAgo fontSize="sm2" time={row.original?.updated_at} />
      ),
      enableSorting: false,
    },
    {
      id: 'content.name',
      header: '',
      cell: ({ row }: any) => (
        <Flex justifyContent="space-between">
          <Box />
          <Box>
            <DropdownMenu.Provider>
              <DropdownMenu.Trigger>
                <Box
                  display="flex"
                  alignItems="center"
                  position="relative"
                  cursor="pointer"
                  margin="0px"
                  padding="0px">
                  <DotsThree />
                </Box>
              </DropdownMenu.Trigger>
              <DropdownMenu aria-label="dropdown role">
                {hasPermission('variant', 'manage') && (
                  <DropdownMenu.Item onClick={() => onCloneContentType(row)}>
                    Clone
                  </DropdownMenu.Item>
                )}
                {hasPermission('variant', 'delete') && (
                  <DropdownMenu.Item
                    onClick={() => {
                      setDeleteVariant(row.index);
                    }}>
                    <Text cursor="pointer" color="red.600">
                      Delete
                    </Text>
                  </DropdownMenu.Item>
                )}
              </DropdownMenu>
              <Modal
                ariaLabel="Delete Variant"
                open={deleteVariant === row.index}
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
    <PageInner>
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
    </PageInner>
  );
};
export default VariantDashboard;
