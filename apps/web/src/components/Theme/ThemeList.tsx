import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { FontIcon, ThreeDotIcon } from '@wraft/icon';
import toast from 'react-hot-toast';
import { MagnifyingGlassIcon } from '@phosphor-icons/react';
import {
  Box,
  DropdownMenu,
  Flex,
  Text,
  Modal,
  Table,
  Pagination,
  InputText,
} from '@wraft/ui';

import ConfirmDelete from 'common/ConfirmDelete';
import Link from 'common/NavLink';
import { IconFrame } from 'common/Atoms';
import { fetchAPI, deleteAPI } from 'utils/models';
import { usePermission } from 'utils/permissions';

export interface Theme {
  total_pages: number;
  total_entries: number;
  themes: ThemeElement[];
  page_number: number;
}
export interface ThemeElement {
  updated_at: string;
  typescale: any;
  name: string;
  inserted_at: string;
  id: string;
  font: string;
  file: null;
}

type Props = {
  refreshKey?: number;
};

const ThemeList = ({ refreshKey }: Props) => {
  const router = useRouter();
  const currentPage: any = parseInt(router.query.page as string) || 1;

  const [contents, setContents] = useState<Array<ThemeElement>>([]);
  const [deleteTheme, setDeleteTheme] = useState<number | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [pageMeta, setPageMeta] = useState<any>();
  const [page, setPage] = useState<number>(currentPage);
  const [searchQuery, setSearchQuery] = useState<string>(
    (router.query.search as string) || '',
  );
  const { hasPermission } = usePermission();

  useEffect(() => {
    if (router.query.search) {
      setSearchQuery(router.query.search as string);
    }
    if (router.query.page) {
      setPage(parseInt(router.query.page as string));
    }
  }, [router.query.search, router.query.page]);

  useEffect(() => {
    loadData(page, searchQuery);
  }, [page, searchQuery, refreshKey]);

  const loadData = async (pageNumber: number, search: string = '') => {
    setLoading(true);

    try {
      const params = new URLSearchParams();
      if (pageNumber > 0) {
        params.append('page', pageNumber.toString());
      }
      params.append('sort', 'inserted_at_desc');
      if (search.trim()) {
        params.append('name', search.trim());
      }
      const query = params.toString() ? `?${params.toString()}` : '';
      const res: any = await fetchAPI(`themes${query}`);
      setContents(res.themes);
      setPageMeta(res);
    } catch (err) {
      console.error('Error loading themes:', err);
    } finally {
      setLoading(false);
    }
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

  const onDelete = async (id: string) => {
    try {
      const request = deleteAPI(`themes/${id}`);
      await request;
      toast.success('Successfully deleted theme');
      setDeleteTheme(null);
      await loadData(page, searchQuery);
    } catch (err) {
      console.error('Error deleting theme:', err);
      toast.error('Failed to delete theme');
    }
  };

  const columns = [
    {
      id: 'content.name',
      header: 'NAME',
      accessorKey: 'content.name',
      cell: ({ row }: any) => (
        <Link href={`/manage/themes/${row.original.id}`} key={row.index}>
          <Text>{row.original.name}</Text>
        </Link>
      ),
      enableSorting: false,
    },
    {
      id: 'content.font',
      header: 'FONT',
      accessorKey: 'content.font',
      cell: ({ row }: any) => (
        <Flex key={row.index} align="center" gap="xs">
          <FontIcon height={18} width={18} />

          <Text>{row.original.font}</Text>
        </Flex>
      ),
      enableSorting: false,
    },
    {
      id: 'content.color',
      header: 'COLOR',
      accessorKey: 'content.color',
      cell: ({ row }: any) => (
        <Flex key={row.index} align="center" gap="sm">
          <Box
            h="12px"
            w="12px"
            borderRadius="sm"
            bg={row.original.primary_color}
          />
          <Box
            h="12px"
            w="12px"
            borderRadius="sm"
            bg={row.original.secondary_color}
          />
          <Box
            h="12px"
            w="12px"
            borderRadius="sm"
            bg={row.original.body_color}
          />
        </Flex>
      ),
      enableSorting: false,
    },
    {
      id: 'content.id',
      header: '',
      accessor: 'content.id',
      cell: ({ row }: any) => {
        return (
          <Flex justify="space-between">
            <DropdownMenu.Provider>
              <DropdownMenu.Trigger>
                <ThreeDotIcon />
              </DropdownMenu.Trigger>
              {hasPermission('theme', 'delete') && (
                <DropdownMenu aria-label="dropdown role">
                  <DropdownMenu.Item onClick={() => setDeleteTheme(row.index)}>
                    Delete
                  </DropdownMenu.Item>
                </DropdownMenu>
              )}
            </DropdownMenu.Provider>
            <Modal
              ariaLabel="delete theme"
              open={deleteTheme === row.index}
              onClose={() => setDeleteTheme(null)}>
              {
                <ConfirmDelete
                  title="Delete Theme"
                  text={`Are you sure you want to delete ‘${row.original.name}’?`}
                  setOpen={setDeleteTheme}
                  onConfirmDelete={async () => {
                    onDelete(row.original.id);
                  }}
                />
              }
            </Modal>
          </Flex>
        );
      },
      size: 10,
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
export default ThemeList;
