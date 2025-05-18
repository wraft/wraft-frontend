import React, { useEffect, useState } from 'react';
import NavLink from 'next/link';
import { useRouter } from 'next/router';
import { Pagination, DropdownMenu, Table, Box, Flex, Text } from '@wraft/ui';
import { ThreeDotIcon } from '@wraft/icon';
import toast from 'react-hot-toast';
import { Plus } from '@phosphor-icons/react';
import { Button } from '@wraft/ui';

import { TimeAgo } from 'common/Atoms';
import PageHeader from 'common/PageHeader';
import { fetchAPI, postAPI } from 'utils/models';
import { IField } from 'utils/types/content';
import { usePermission } from 'utils/permissions';

const columns = ({ onCloneTemplete, hasPermission }: any) => [
  {
    id: 'title',
    header: 'Name',
    accessorKey: 'title',
    cell: ({ row }: any) => (
      <NavLink href={`/templates/edit/${row?.original?.id}`}>
        <Text fontWeight="heading">{row?.original?.title}</Text>
      </NavLink>
    ),
    enableSorting: false,
  },
  {
    id: 'content.type',
    header: 'Type',
    accessorKey: 'content.type',
    cell: ({ row }: any) => (
      <Flex alignItems="center" gap="sm">
        <Box
          as="span"
          display="block"
          borderRadius="4px"
          h="12px"
          w="12px"
          border="solid 1px"
          borderColor="border"
          alignItems="center"
          bg={row?.original?.content_type?.color}
        />

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
                <NavLink href={`/templates/edit/${row?.original?.id}`}>
                  Edit
                </NavLink>
              </DropdownMenu.Item>
              <DropdownMenu.Item onClick={() => onCloneTemplete(row.original)}>
                Clone
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
  const [templates, setTemplates] = useState<Array<IField>>([]);
  const [pageMeta, setPageMeta] = useState<any>();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [page, setPage] = useState<number>();
  const { hasPermission } = usePermission();

  const router: any = useRouter();
  const currentPage: any = parseInt(router.query.page) || 1;

  useEffect(() => {
    loadTemplates(currentPage);
  }, []);

  useEffect(() => {
    if (page) {
      loadTemplates(page);
    }
  }, [page]);

  const loadTemplates = async (pageNo: number) => {
    try {
      setIsLoading(true);
      const query = `?page=${pageNo}&sort=updated_at_desc`;
      const data: any = await fetchAPI(`data_templates${query}`);
      setTemplates(data.data_templates || []);
      setPageMeta(data);
    } catch (error) {
      console.error('Error fetching templates:', error);
      toast.error('Failed to load templates.');
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
      router.push(`/templates/edit/${clonedTemplate.id}`);
      toast.success('Template cloned successfully!');
    } catch (error) {
      console.error('Error cloning template:', error);
      toast.error('Failed to clone template.');
    }
  };

  return (
    <Box minHeight="100%" bg="background-secondary">
      <PageHeader title="Templates" desc="Content Templates for Variants">
        {hasPermission('template', 'manage') && (
          <Button
            variant="secondary"
            display="flex"
            size="sm"
            fontSize="sm2"
            borderRadius="lg"
            borderColor="gray.600"
            onClick={() => router.push(`/templates/new`)}>
            <Plus height={4} weight="bold" />
            New Template
          </Button>
        )}
      </PageHeader>
      <Box p="lg" px="xl">
        <Box mx={0} mb={3}>
          <Table
            data={templates}
            isLoading={isLoading}
            columns={columns({ onCloneTemplete, hasPermission })}
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
      </Box>
    </Box>
  );
};
export default TemplateList;
