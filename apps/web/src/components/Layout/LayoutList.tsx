import React, { useEffect, useState } from 'react';
import NextLink from 'next/link';
import { useRouter } from 'next/router';
import toast from 'react-hot-toast';
import { MagnifyingGlassIcon } from '@phosphor-icons/react';
import {
  Table,
  Box,
  Flex,
  Text,
  DropdownMenu,
  Modal,
  useDrawer,
  Drawer,
  Pagination,
  InputText,
} from '@wraft/ui';
import { ThreeDotIcon } from '@wraft/icon';

import { TimeAgo, IconFrame } from 'common/Atoms';
import ConfirmDelete from 'common/ConfirmDelete';
import { fetchAPI, deleteAPI } from 'utils/models';
import { usePermission } from 'utils/permissions';

import LayoutForm from './LayoutForm';

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
  rerender?: boolean;
}

const LayoutList = ({ rerender }: Props) => {
  const [contents, setContents] = useState<Array<IField>>([]);
  const [deleteLayout, setDeleteLayout] = useState<number | null>(null);
  const [isEdit, setIsEdit] = useState<number | boolean>(false);
  const [loading, setIslLoading] = useState<number | boolean>(false);
  const [pageMeta, setPageMeta] = useState<any>();
  const [page, setPage] = useState<number>(1);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const { hasPermission } = usePermission();

  const router: any = useRouter();
  const currentPage: any = parseInt(router.query.page as string) || 1;
  const stateDrawer = useDrawer();

  useEffect(() => {
    if (router.query.search) {
      setSearchQuery(router.query.search as string);
    }
  }, [router.query.search]);

  useEffect(() => {
    loadLayout(page, searchQuery);
  }, [page, rerender, searchQuery]);

  const onDelete = (_id: string) => {
    deleteAPI(`layouts/${_id}`)
      .then(() => {
        toast.success('Deleted Layout', {
          duration: 1000,
          position: 'top-right',
        });
        loadLayout(page, searchQuery);
        setDeleteLayout(null);
      })
      .catch(() => {
        toast.error('Failed to delete Layout', {
          duration: 1000,
          position: 'top-right',
        });
      });
  };

  /**
   * Load all Layouts with pagination and search
   */
  const loadLayout = (pageNumber: number, search: string = '') => {
    setIslLoading(true);
    const params = new URLSearchParams();
    if (pageNumber > 0) {
      params.append('page', pageNumber.toString());
    }
    params.append('sort', 'inserted_at_desc');
    if (search.trim()) {
      params.append('name', search.trim());
    }
    const query = params.toString() ? `?${params.toString()}` : '';
    fetchAPI(`layouts${query}`)
      .then((data: any) => {
        setIslLoading(false);
        const res: IField[] = data.layouts;
        setContents(res);
        setPageMeta(data);
      })
      .catch(() => {
        setIslLoading(false);
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

  const columns = [
    {
      id: 'content.name',
      header: 'Layout Name',
      accessorKey: 'content.name',
      cell: ({ row }: any) => (
        <>
          <NextLink href={`/manage/layouts/${row.original.id}`}>
            <Text>{row.original?.name}</Text>
          </NextLink>
          <Drawer
            open={isEdit === row.index}
            store={stateDrawer}
            aria-label="field drawer"
            withBackdrop={true}
            onClose={() => setIsEdit(false)}>
            <LayoutForm setOpen={setIsEdit} cId={row.original.id} />
          </Drawer>
        </>
      ),
      enableSorting: false,
    },
    {
      id: 'content.description',
      header: 'Desc',
      accessorKey: 'description',
      cell: ({ row }: any) => <Text>{row.original?.description}</Text>,
      enableSorting: false,
    },
    {
      id: 'content.engine.name',
      header: 'Engine',
      accessorKey: 'name',
      cell: ({ row }: any) => <Text>{row.original?.engine?.name}</Text>,
      enableSorting: false,
    },
    {
      id: 'content.update_at',
      header: 'Updated',
      accessorKey: 'update_at',
      cell: ({ row }: any) => (
        <Box>
          <TimeAgo time={row.original?.update_at} />
        </Box>
      ),
      enableSorting: false,
    },
    {
      id: 'content.id',
      header: '',
      accessor: 'content.id',
      cell: ({ row }: any) => {
        return (
          <Flex justifyContent="flex-end">
            <DropdownMenu.Provider>
              <DropdownMenu.Trigger>
                <ThreeDotIcon />
              </DropdownMenu.Trigger>
              {hasPermission('layout', 'delete') && (
                <DropdownMenu aria-label="dropdown role">
                  <DropdownMenu.Item
                    onClick={() => {
                      setDeleteLayout(row.index);
                    }}>
                    Delete
                  </DropdownMenu.Item>
                </DropdownMenu>
              )}
            </DropdownMenu.Provider>

            <Modal
              ariaLabel="Delete Layout"
              open={deleteLayout === row.index}
              onClose={() => setDeleteLayout(null)}>
              {
                <ConfirmDelete
                  title="Delete Layout"
                  text={`Are you sure you want to delete ‘${row.original.name}’?`}
                  setOpen={setDeleteLayout}
                  onConfirmDelete={async () => {
                    onDelete(row.original.id);
                  }}
                />
              }
            </Modal>
          </Flex>
        );
      },
    },
  ];

  return (
    <Box w="100%">
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
export default LayoutList;
