import React, { useEffect, useState } from 'react';
import NavLink from 'next/link';
import { useRouter } from 'next/router';
import {
  Pagination,
  DropdownMenu,
  Table,
  Box,
  Flex,
  Text,
  InputText,
} from '@wraft/ui';
import { ThreeDotIcon } from '@wraft/icon';
import toast from 'react-hot-toast';
import {
  PlusIcon,
  DownloadIcon,
  MagnifyingGlassIcon,
} from '@phosphor-icons/react';
import { Button } from '@wraft/ui';

import { PageInner, TimeAgo, VariantLine, IconFrame } from 'common/Atoms';
import PageHeader from 'common/PageHeader';
import { fetchAPI, postAPI } from 'utils/models';
import api from 'utils/models';
import { IField } from 'utils/types/content';
import { usePermission } from 'utils/permissions';

const columns = ({
  onCloneTemplete,
  onDownloadTemplate,
  hasPermission,
}: any) => [
  {
    id: 'title',
    header: 'Name',
    accessorKey: 'title',
    cell: ({ row }: any) => (
      <NavLink href={`/templates/${row?.original?.id}`}>
        <Text fontWeight="heading">{row?.original?.title}</Text>
      </NavLink>
    ),
    enableSorting: false,
  },
  {
    id: 'content.type',
    header: 'Variant',
    accessorKey: 'content.type',
    cell: ({ row }: any) => (
      <Flex alignItems="center" gap="sm">
        <VariantLine bg={row?.original?.content_type?.color} />
        <Text fontWeight="body" display="flex">
          {row?.original?.content_type?.name}
        </Text>
      </Flex>
    ),
    enableSorting: false,
  },
  {
    id: 'content.prefix',
    header: 'Prefix',
    accessorKey: 'prefix',
    cell: ({ row }: any) => (
      <Text fontSize="sm">{row.original?.content_type?.prefix}</Text>
    ),
    enableSorting: false,
  },
  {
    id: 'content.updated_at',
    header: 'Updated At',
    accessorKey: 'TIME',
    cell: ({ row }: any) => (
      <Box>
        <TimeAgo time={row.original?.updated_at} />
      </Box>
    ),
    enableSorting: false,
  },
  {
    id: 'id',
    header: '',
    cell: ({ row }: any) => (
      <Flex justifyContent="flex-end">
        <DropdownMenu.Provider>
          <DropdownMenu.Trigger>
            <ThreeDotIcon />
          </DropdownMenu.Trigger>
          {hasPermission('template', 'manage') && (
            <DropdownMenu aria-label="dropdown role">
              <DropdownMenu.Item>
                <NavLink href={`/templates/${row?.original?.id}`}>Edit</NavLink>
              </DropdownMenu.Item>
              <DropdownMenu.Item onClick={() => onCloneTemplete(row.original)}>
                Clone
              </DropdownMenu.Item>
              <DropdownMenu.Item
                onClick={() => onDownloadTemplate(row.original)}>
                <Flex alignItems="center" gap="xs">
                  <DownloadIcon size={14} />
                  Download
                </Flex>
              </DropdownMenu.Item>
            </DropdownMenu>
          )}
        </DropdownMenu.Provider>
      </Flex>
    ),
    enableSorting: false,
    textAlign: 'right',
  },
];

const TemplateList = () => {
  const router: any = useRouter();
  const currentPage: any = parseInt(router.query.page) || 1;
  const { hasPermission } = usePermission();

  const [templates, setTemplates] = useState<Array<IField>>([]);
  const [pageMeta, setPageMeta] = useState<any>();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [page, setPage] = useState<number>();
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
      loadTemplates(page, searchQuery);
    } else {
      loadTemplates(currentPage, searchQuery);
    }
  }, [page, searchQuery]);

  const loadTemplates = async (pageNo: number, search: string = '') => {
    try {
      setIsLoading(true);
      const params = new URLSearchParams();
      if (pageNo > 0) {
        params.append('page', pageNo.toString());
      }
      params.append('sort', 'updated_at_desc');
      if (search.trim()) {
        params.append('title', search.trim());
      }
      const query = params.toString() ? `?${params.toString()}` : '';
      const data: any = await fetchAPI(`data_templates${query}`);
      setTemplates(data.data_templates || []);
      setPageMeta(data);
    } catch (error) {
      console.error('Error fetching templates:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const onPageChange = (newPage: any) => {
    setPage(newPage);
    router.push(
      {
        pathname: router.pathname,
        query: { ...router.query, page: newPage },
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

  const onCloneTemplete = async (template: any) => {
    const cloneData = {
      title_template: template.title_template,
      title: `${template.title} duplicate`,
      data: template.data,
      serialized: template.serialized,
    };

    try {
      const clonedTemplate: any = await postAPI(
        `content_types/${template.content_type.id}/data_templates`,
        cloneData,
      );
      router.push(`/templates/${clonedTemplate.id}`);
      toast.success('Template cloned successfully!');
    } catch (error) {
      console.error('Error cloning template:', error);
      toast.error('Failed to clone template.');
    }
  };

  const onDownloadTemplate = async (template: any) => {
    try {
      const response = await api.post(
        `/template_assets/${template.id}/export`,
        {},
        { responseType: 'blob' },
      );

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      const filename = `${template.title || 'template'}.zip`;

      link.href = url;
      link.setAttribute('download', filename);
      document.body.appendChild(link);
      link.click();

      link.remove();
      window.URL.revokeObjectURL(url);

      toast.success('Template downloaded successfully!');
    } catch (error) {
      toast.error('Failed to download template.');
    }
  };

  return (
    <Box minHeight="100%" bg="background-secondary">
      <PageHeader title="Templates" desc="Content Templates for Variants">
        {hasPermission('template', 'manage') && (
          <Button
            onClick={() => router.push(`/templates/new`)}
            variant="secondary"
            size="sm">
            <PlusIcon size={12} weight="bold" />
            New Template
          </Button>
        )}
      </PageHeader>
      <PageInner>
        <Box mb="xs">
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
        <Box mx={0} mb={3}>
          <Table
            data={templates}
            isLoading={isLoading}
            columns={columns({
              onCloneTemplete,
              onDownloadTemplate,
              hasPermission,
            })}
            skeletonRows={10}
            emptyMessage="No template has been created yet."
          />
          <Box mt="16px">
            {pageMeta && pageMeta?.total_pages > 1 && (
              <Pagination
                totalPage={pageMeta?.total_pages}
                initialPage={currentPage}
                onPageChange={onPageChange}
                totalEntries={pageMeta?.total_entries}
              />
            )}
          </Box>
        </Box>
      </PageInner>
    </Box>
  );
};
export default TemplateList;
