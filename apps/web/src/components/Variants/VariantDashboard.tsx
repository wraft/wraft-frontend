import React, { useEffect, useState } from 'react';
import NextLink from 'next/link';
import { useRouter } from 'next/router';
import {
  Pagination,
  Table,
  DropdownMenu,
  Box,
  Flex,
  Text,
  Modal,
  InputText,
} from '@wraft/ui';
import toast from 'react-hot-toast';
import { ThreeDotIcon } from '@wraft/icon';
import { MagnifyingGlassIcon } from '@phosphor-icons/react';

import { TimeAgo, IconFrame } from 'common/Atoms';
import ConfirmDelete from 'common/ConfirmDelete';
import UserCard from 'common/UserCard';
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
  const [searchQuery, setSearchQuery] = useState<string>(
    (router.query.search as string) || '',
  );

  useEffect(() => {
    if (router.query.search) {
      setSearchQuery(router.query.search as string);
    }
    if (router.query.page) {
      setPage(parseInt(router.query.page as string));
    }
  }, [router.query.search, router.query.page]);

  useEffect(() => {
    if (page) {
      loadData(page, searchQuery);
    } else {
      loadData(currentPage, searchQuery);
    }
  }, [currentPage, rerender, searchQuery]);

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

  const loadData = (pageNumber: number, search: string = '') => {
    setLoading(true);

    const params = new URLSearchParams();
    if (pageNumber > 0) {
      params.append('page', pageNumber.toString());
    }
    params.append('sort', 'inserted_at_desc');
    if (search.trim()) {
      params.append('name', search.trim());
    }
    const query = params.toString() ? `?${params.toString()}` : '';

    fetchAPI(`content_types${query}`)
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

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    setPage(1);
    const currentPath = router.pathname;
    const currentQuery = {
      ...router.query,
      page: 1,
      search: query || undefined,
    };
    if (!query) {
      delete currentQuery.search;
    }
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
              <Text fontSize="sm" color="text-secondary">
                {row.original?.prefix}
              </Text>
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
      cell: ({ row }: any) => <Text>{row.original?.flow?.name}</Text>,
      enableSorting: false,
    },
    {
      id: 'content.theme',
      header: 'Theme',
      cell: ({ row }: any) => <Text>{row.original?.theme?.name}</Text>,
      enableSorting: false,
    },

    {
      id: 'content.layout',
      header: 'Layout',
      accessorKey: 'layout',
      cell: ({ row }: any) => <Text>{row.original?.layout?.name}</Text>,
      enableSorting: false,
    },
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
        <UserCard
          profilePic={row.original?.creator?.profile_pic}
          name={row.original?.creator?.name}
          size="sm"
        />
      ),
      enableSorting: false,
    },
    {
      id: 'content.updated_at',
      header: 'CREATED AT',
      accessorKey: 'TIME',
      cell: ({ row }: any) => <TimeAgo time={row.original?.updated_at} />,
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
                  <ThreeDotIcon />
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
    <Box>
      <Box mb="lg">
        <Flex gap="md" align="end" justify="flex-start">
          <Box w="320px" bg="background-primary">
            <InputText
              placeholder="Search by name..."
              value={searchQuery}
              size="md"
              onChange={(e) => handleSearch(e.target.value)}
              icon={
                <IconFrame size={12} color="gray.700">
                  <MagnifyingGlassIcon width="18px" />
                </IconFrame>
              }
              iconPlacement="right"
            />
          </Box>
        </Flex>
      </Box>
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
export default VariantDashboard;
