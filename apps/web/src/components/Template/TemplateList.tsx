import React, { useEffect, useState } from 'react';
import NavLink from 'next/link';
import { useRouter } from 'next/router';
import { Pagination, DropdownMenu, Table, Box, Flex, Text } from '@wraft/ui';
import { ThreeDotIcon } from '@wraft/icon';
import toast from 'react-hot-toast';
import { Plus } from '@phosphor-icons/react';
import { Button } from '@wraft/ui';

import { IconFrame, PageInner, TimeAgo, VariantLine } from 'common/Atoms';
import PageHeader from 'common/PageHeader';
import { Variant } from 'schemas/template-filter';
import { fetchAPI, postAPI } from 'utils/models';
import { IField } from 'utils/types/content';
import { usePermission } from 'utils/permissions';

import TemplateFilterSidebar from './TemplateFilterSidebar';

const columns = ({ onCloneTemplete, hasPermission }: any) => [
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
  const [variants, setVariants] = useState<Variant[]>([]);
  const [isVariantsLoading, setIsVariantsLoading] = useState<boolean>(false);
  const [selectedVariantIds, setSelectedVariantIds] = useState<string[]>([]);
  const { hasPermission } = usePermission();

  const router: any = useRouter();
  const currentPage: any = parseInt(router.query.page) || 1;
  const contentTypeIdFilter: any = router.query.content_type_id || '';

  useEffect(() => {
    const variantIds = contentTypeIdFilter
      ? contentTypeIdFilter.split(',').filter((id: string) => id !== '')
      : [];

    const validIds = variantIds.filter((id: string) =>
      variants.some((v) => v.id === id),
    );

    if (validIds.length < variantIds.length) {
      toast.error('Filter no longer exists');
      const newQuery = { ...router.query };
      delete newQuery.content_type_id;
      newQuery.page = '1';
      router.replace(
        { pathname: router.pathname, query: newQuery },
        undefined,
        { shallow: true },
      );
      return;
    }

    setSelectedVariantIds(validIds);
  }, [contentTypeIdFilter, variants]);

  useEffect(() => {
    loadTemplates(currentPage);
    loadVariants();
  }, []);

  useEffect(() => {
    if (page) {
      loadTemplates(page);
    }
  }, [page]);

  useEffect(() => {
    loadTemplates(currentPage);
  }, [contentTypeIdFilter]);

  const loadVariants = async () => {
    try {
      setIsVariantsLoading(true);
      const data: any = await fetchAPI('content_types');
      setVariants(data.content_types || []);
    } catch (error) {
      console.error('Error fetching variants:', error);
    } finally {
      setIsVariantsLoading(false);
    }
  };

  const loadTemplates = async (pageNo: number) => {
    try {
      setIsLoading(true);
      const params = new URLSearchParams();
      params.append('page', pageNo.toString());
      params.append('sort', 'updated_at_desc');

      if (contentTypeIdFilter) {
        params.append('content_type_id', contentTypeIdFilter);
      }

      const query = `?${params.toString()}`;
      const data: any = await fetchAPI(`data_templates${query}`);
      setTemplates(data.data_templates || []);
      setPageMeta(data);
    } catch (error) {
      console.error('Error fetching templates:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const onVariantToggle = (variantName: string) => {
    const variant = variants.find((v) => v.name === variantName);
    if (!variant) return;

    const newSelection = selectedVariantIds.includes(variant.id)
      ? selectedVariantIds.filter((id) => id !== variant.id)
      : [...selectedVariantIds, variant.id];

    setSelectedVariantIds(newSelection);

    const newQuery = { ...router.query };
    if (newSelection.length > 0) {
      newQuery.content_type_id = newSelection.join(',');
    } else {
      delete newQuery.content_type_id;
    }
    newQuery.page = '1';

    router.push({ pathname: router.pathname, query: newQuery }, undefined, {
      shallow: true,
    });
  };

  const onClearAllFilters = () => {
    setSelectedVariantIds([]);

    const newQuery = { ...router.query };
    delete newQuery.content_type_id;
    newQuery.page = '1';

    router.push({ pathname: router.pathname, query: newQuery }, undefined, {
      shallow: true,
    });
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
      router.push(`/templates/${clonedTemplate.id}`);
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
            onClick={() => router.push(`/templates/new`)}
            variant="secondary"
            size="sm">
            <Plus size={12} weight="bold" />
            New Template
          </Button>
        )}
      </PageHeader>
      <PageInner>
        <Flex>
          <Box flexGrow={1}>
            <Box mb="sm">
              <Table
                data={templates}
                isLoading={isLoading}
                columns={columns({ onCloneTemplete, hasPermission })}
                skeletonRows={10}
                emptyMessage={
                  <Box mx="auto" gap="md" w="60%">
                    <Text as="h3" fontSize="md">
                      No templates
                    </Text>
                    <Text color="text-secondary" mb="md">
                      {selectedVariantIds.length > 0
                        ? 'No templates match your filters.'
                        : 'You have no recent templates to display.'}
                    </Text>
                    <Button variant="secondary" size="sm">
                      <IconFrame color="gray.800" mr="xs">
                        <Plus size={12} weight="bold" />
                      </IconFrame>
                      Add Template
                    </Button>
                  </Box>
                }
              />
            </Box>
            {pageMeta && pageMeta?.total_pages > 1 && (
              <Pagination
                totalPage={pageMeta?.total_pages}
                initialPage={currentPage}
                onPageChange={onPageChange}
                totalEntries={pageMeta?.total_entries}
              />
            )}
          </Box>
          <TemplateFilterSidebar
            variants={variants}
            selectedVariantIds={selectedVariantIds}
            onVariantToggle={onVariantToggle}
            onClearAll={onClearAllFilters}
            isLoading={isVariantsLoading}
          />
        </Flex>
      </PageInner>
    </Box>
  );
};
export default TemplateList;
