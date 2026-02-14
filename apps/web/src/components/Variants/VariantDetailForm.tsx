import React, { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import NavLink from 'next/link';
import { useRouter } from 'next/router';
import { Drawer, useDrawer, Button, Box, Flex, Text, Spinner } from '@wraft/ui';
import {
  PencilSimpleIcon,
  Plus,
  FileText,
  ListBullets,
  Clock,
} from '@phosphor-icons/react';
import toast from 'react-hot-toast';

import { TimeAgo } from 'common/Atoms';
import { ContentType } from 'utils/types';
import { fetchAPI, putAPI } from 'utils/models';
import { usePermission } from 'utils/permissions';

import Form from './VariantForm';

const LayoutForm = dynamic(() => import('components/Layout/LayoutForm'), {
  loading: () => <Spinner />,
});
const ThemeAddForm = dynamic(() => import('components/Theme/ThemeForm'), {
  loading: () => <Spinner />,
});

// --- Helper Components ---

const DetailItem = ({
  label,
  value,
  onClick,
}: {
  label: string;
  value?: string | null;
  onClick?: () => void;
}) => {
  return (
    <Flex
      justify="space-between"
      align="center"
      px="lg"
      py="sm"
      onClick={onClick}
      cursor={onClick ? 'pointer' : 'default'}
      _hover={onClick ? { bg: 'background-secondary' } : undefined}>
      <Text fontSize="sm" color="text-secondary">
        {label}
      </Text>
      <Text
        fontSize="sm"
        fontWeight="500"
        color={onClick ? 'primary' : 'text-primary'}>
        {value || '—'}
      </Text>
    </Flex>
  );
};

const StatCard = ({
  label,
  value,
}: {
  label: string;
  value: number | string;
}) => (
  <Box
    border="1px solid"
    borderColor="border"
    borderRadius="md"
    bg="background-primary"
    px="lg"
    py="md">
    <Text fontSize="sm" color="text-secondary" mb="xs">
      {label}
    </Text>
    <Text fontSize="lg" fontWeight="700">
      {value}
    </Text>
  </Box>
);

const SectionHeader = ({
  title,
  count,
  action,
}: {
  title: string;
  count?: number | string;
  action?: React.ReactNode;
}) => (
  <Flex
    justify="space-between"
    align="center"
    px="lg"
    py="sm"
    borderBottom="1px solid"
    borderColor="border">
    <Flex align="center" gap="sm">
      <Text fontSize="sm" fontWeight="600" color="text-secondary">
        {title}
      </Text>
      {count !== undefined && (
        <Text fontSize="sm2" fontWeight="600" color="text-secondary">
          {count}
        </Text>
      )}
    </Flex>
    {action}
  </Flex>
);

const EmptyState = ({
  icon,
  message,
  actionLabel,
  onAction,
}: {
  icon: React.ReactNode;
  message: string;
  actionLabel?: string;
  onAction?: () => void;
}) => (
  <Flex
    direction="column"
    align="center"
    justify="center"
    py="xl"
    px="lg"
    gap="sm">
    <Box opacity={0.4}>{icon}</Box>
    <Text fontSize="sm" color="text-secondary" textAlign="center">
      {message}
    </Text>
    {actionLabel && onAction && (
      <Button variant="secondary" size="xs" onClick={onAction}>
        <Plus size={12} weight="bold" />
        {actionLabel}
      </Button>
    )}
  </Flex>
);

// --- Main Component ---

const VariantDetailForm = () => {
  const [content, setContent] = useState<ContentType | undefined>(undefined);
  const [templates, setTemplates] = useState<any[]>([]);
  const [documents, setDocuments] = useState<any[]>([]);
  const [documentsMeta, setDocumentsMeta] = useState<any>(null);
  const [activity, setActivity] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [isLayoutOpen, setIsLayoutOpen] = useState<boolean>(false);
  const [isThemeOpen, setIsThemeOpen] = useState<boolean>(false);
  const [rerender, setRerender] = useState<boolean>(false);
  const { hasPermission } = usePermission();
  const editDrawer = useDrawer();
  const layoutDrawer = useDrawer();
  const themeDrawer = useDrawer();
  const router = useRouter();
  const cId: string = router.query.id as string;

  useEffect(() => {
    if (cId) {
      loadAllData(cId);
    }
  }, [cId, rerender]);

  const loadAllData = async (id: string) => {
    try {
      setLoading(true);
      const variantData: any = await fetchAPI(`content_types/${id}`);
      setContent(variantData);

      // Load templates and documents in parallel
      const variantName = variantData?.content_type?.name;
      await Promise.allSettled([loadTemplates(id), loadDocuments(variantName)]);
    } catch {
      // variant fetch failed
    } finally {
      setLoading(false);
    }
  };

  const loadTemplates = async (id: string) => {
    try {
      const data: any = await fetchAPI(`content_types/${id}/data_templates`);
      const items = data?.data_templates || [];
      setTemplates(items);
    } catch {
      setTemplates([]);
    }
  };

  const loadDocuments = async (variantName?: string) => {
    if (!variantName) {
      setDocuments([]);
      setDocumentsMeta({ total_entries: 0 });
      setActivity([]);
      return;
    }
    try {
      const data: any = await fetchAPI(
        `contents?sort=inserted_at_desc&page=1&content_type_name=${encodeURIComponent(variantName)}`,
      );
      const items = data?.contents || [];
      setDocuments(items.slice(0, 5));
      setDocumentsMeta({ total_entries: data.total_entries || items.length });
      setActivity([]);
    } catch {
      setDocuments([]);
      setDocumentsMeta({ total_entries: 0 });
      setActivity([]);
    }
  };

  if (loading) {
    return (
      <Flex align="center" justify="center" py="3xl">
        <Spinner size={24} />
      </Flex>
    );
  }

  if (!content?.content_type) return null;

  const variant = content.content_type;
  const fields = variant.fields || [];
  const totalDocuments = documentsMeta?.total_entries || 0;

  return (
    <>
      {/* Profile Header */}
      <Flex justify="space-between" align="flex-start" mb="lg">
        <Flex gap="md" align="center">
          <Flex
            w="48px"
            h="48px"
            borderRadius="md"
            bg={variant.color || 'green.300'}
            align="center"
            justify="center"
            flexShrink={0}>
            <Text fontSize="lg" fontWeight="700" color="white">
              {variant.prefix?.charAt(0) || 'V'}
            </Text>
          </Flex>
          <Box>
            <Flex gap="sm" align="center">
              <Text variant="lg" fontWeight="600">
                {variant.name}
              </Text>
              <Flex bg="background-secondary" px="sm" py="xs" borderRadius="sm">
                <Text fontSize="xs" fontWeight="600" color="text-secondary">
                  {variant.prefix}
                </Text>
              </Flex>
              <Flex bg="background-secondary" px="sm" py="xs" borderRadius="sm">
                <Text fontSize="xs" fontWeight="600" color="text-secondary">
                  {variant.type}
                </Text>
              </Flex>
            </Flex>
            {variant.description && (
              <Text fontSize="sm" color="text-secondary" mt="xs">
                {variant.description}
              </Text>
            )}
          </Box>
        </Flex>
        {hasPermission('variant', 'manage') && (
          <Button variant="secondary" onClick={() => setIsOpen(true)}>
            <PencilSimpleIcon size={16} />
            Edit
          </Button>
        )}
      </Flex>

      {/* Stats Row */}
      <Box display="grid" gridTemplateColumns="repeat(4, 1fr)" gap="md" mb="xl">
        <StatCard label="Documents" value={totalDocuments} />
        <StatCard label="Templates" value={templates.length} />
        <StatCard label="Fields" value={fields.length} />
        <StatCard
          label="Flow"
          value={
            variant.flow?.flow?.name || variant.flow?.name
              ? `${variant.flow?.flow?.name || variant.flow?.name} (v${(content as any)?.flow_version?.version_number || '?'})`
              : 'None'
          }
        />
      </Box>

      {/* Flow Version Upgrade Banner */}
      {(content as any)?.flow_version_outdated && (
        <Flex
          bg="yellow.50"
          border="1px solid"
          borderColor="yellow.200"
          borderRadius="md"
          px="md"
          py="sm"
          align="center"
          justify="space-between"
          mb="xl">
          <Text fontSize="sm" color="yellow.800">
            This document type uses Flow v
            {(content as any)?.flow_version?.version_number}. Version{' '}
            {(content as any)?.latest_flow_version?.version_number} is
            available.
          </Text>
          {hasPermission('variant', 'manage') && (
            <Button
              variant="secondary"
              size="xs"
              onClick={async () => {
                try {
                  await putAPI(`content_types/${cId}/upgrade_flow_version`, {
                    flow_version_id: (content as any)?.latest_flow_version?.id,
                  });
                  toast.success(
                    'Flow version upgraded. New documents will use the updated flow.',
                  );
                  loadAllData(cId);
                } catch (error: any) {
                  toast.error(
                    error?.response?.data?.errors?.[0] ||
                      'Failed to upgrade flow version',
                  );
                }
              }}>
              Upgrade
            </Button>
          )}
        </Flex>
      )}

      {/* Main Content: Two-column layout */}
      <Box display="grid" gridTemplateColumns="1fr 340px" gap="xl">
        {/* Left Column */}
        <Flex direction="column" gap="xl">
          {/* Templates */}
          <Box
            border="1px solid"
            borderColor="border"
            borderRadius="md"
            bg="background-primary"
            overflow="hidden">
            <SectionHeader
              title="Templates"
              count={templates.length}
              action={
                templates.length > 0 ? (
                  <NavLink href="/templates">
                    <Text fontSize="sm" color="primary" cursor="pointer">
                      View all
                    </Text>
                  </NavLink>
                ) : undefined
              }
            />
            <Box>
              {templates.length === 0 ? (
                <EmptyState
                  icon={<FileText size={28} />}
                  message="No templates created yet for this variant."
                  actionLabel="Create Template"
                  onAction={() => router.push('/templates')}
                />
              ) : (
                templates.map((t: any, index: number) => (
                  <Flex
                    key={t.id}
                    justify="space-between"
                    align="center"
                    px="lg"
                    py="sm"
                    borderBottom={
                      index < templates.length - 1 ? '1px solid' : 'none'
                    }
                    borderColor="border">
                    <NavLink href={`/templates/${t.id}`}>
                      <Text fontSize="sm" fontWeight="500">
                        {t.title}
                      </Text>
                    </NavLink>
                    <TimeAgo time={t.updated_at} />
                  </Flex>
                ))
              )}
            </Box>
          </Box>

          {/* Recent Documents */}
          <Box
            border="1px solid"
            borderColor="border"
            borderRadius="md"
            bg="background-primary"
            overflow="hidden">
            <SectionHeader
              title="Recent Documents"
              count={totalDocuments}
              action={
                documents.length > 0 ? (
                  <NavLink href="/documents">
                    <Text fontSize="sm" color="primary" cursor="pointer">
                      View all
                    </Text>
                  </NavLink>
                ) : undefined
              }
            />
            <Box>
              {documents.length === 0 ? (
                <EmptyState
                  icon={<ListBullets size={28} />}
                  message="No documents generated yet. Create a document from a template to get started."
                  actionLabel="Create Document"
                  onAction={() => router.push('/documents')}
                />
              ) : (
                documents.map((doc: any, index: number) => (
                  <Flex
                    key={doc.content?.id || index}
                    justify="space-between"
                    align="center"
                    px="lg"
                    py="sm"
                    borderBottom={
                      index < documents.length - 1 ? '1px solid' : 'none'
                    }
                    borderColor="border">
                    <Flex direction="column" gap="xs">
                      <Text fontSize="sm" fontWeight="500">
                        {doc.content?.instance_id || `Document ${index + 1}`}
                      </Text>
                      <Text fontSize="xs" color="text-secondary">
                        {doc.creator?.name}
                      </Text>
                    </Flex>
                    <Flex align="center" gap="md">
                      <Flex
                        bg="background-secondary"
                        px="sm"
                        py="xs"
                        borderRadius="sm">
                        <Text
                          fontSize="xs"
                          fontWeight="600"
                          color="text-secondary">
                          {doc.state?.state || 'Draft'}
                        </Text>
                      </Flex>
                      <TimeAgo time={doc.content?.updated_at} />
                    </Flex>
                  </Flex>
                ))
              )}
            </Box>
          </Box>
        </Flex>

        {/* Right Column (Sidebar) */}
        <Flex direction="column" gap="xl">
          {/* Configuration */}
          <Box
            border="1px solid"
            borderColor="border"
            borderRadius="md"
            bg="background-primary"
            overflow="hidden">
            <SectionHeader title="Configuration" />
            <Box>
              <DetailItem
                label="Layout"
                value={variant.layout?.name}
                onClick={() => setIsLayoutOpen(true)}
              />
              <DetailItem
                label="Theme"
                value={variant.theme?.name}
                onClick={() => setIsThemeOpen(true)}
              />
              <DetailItem
                label="Flow Version"
                value={
                  (content as any)?.flow_version
                    ? `v${(content as any).flow_version.version_number}`
                    : undefined
                }
              />
              <DetailItem label="Color" value={variant.color || '—'} />
            </Box>
          </Box>

          {/* Fields */}
          <Box
            border="1px solid"
            borderColor="border"
            borderRadius="md"
            bg="background-primary"
            overflow="hidden">
            <SectionHeader title="Fields" count={fields.length} />
            <Box>
              {fields.length === 0 ? (
                <EmptyState
                  icon={<ListBullets size={28} />}
                  message="No fields configured for this variant."
                  actionLabel="Edit Variant"
                  onAction={() => setIsOpen(true)}
                />
              ) : (
                fields.map((f: any, index: number) => (
                  <Flex
                    key={f.id || index}
                    justify="space-between"
                    align="center"
                    px="lg"
                    py="sm"
                    borderBottom={
                      index < fields.length - 1 ? '1px solid' : 'none'
                    }
                    borderColor="border">
                    <Text fontSize="sm">{f.name}</Text>
                    <Text fontSize="sm" color="text-secondary">
                      {f.field_type?.name}
                    </Text>
                  </Flex>
                ))
              )}
            </Box>
          </Box>

          {/* Recent Activity */}
          <Box
            border="1px solid"
            borderColor="border"
            borderRadius="md"
            bg="background-primary"
            overflow="hidden">
            <SectionHeader title="Recent Activity" />
            <Box>
              {activity.length === 0 ? (
                <EmptyState
                  icon={<Clock size={28} />}
                  message="No recent activity to show."
                />
              ) : (
                activity.map((a: any, index: number) => (
                  <Box
                    key={a.id}
                    px="lg"
                    py="sm"
                    borderBottom={
                      index < activity.length - 1 ? '1px solid' : 'none'
                    }
                    borderColor="border">
                    <Text fontSize="sm">{a.action}</Text>
                    <TimeAgo time={a.time} />
                  </Box>
                ))
              )}
            </Box>
          </Box>
        </Flex>
      </Box>

      <Drawer
        open={isOpen}
        store={editDrawer}
        aria-label="Edit variant"
        withBackdrop={true}
        onClose={() => setIsOpen(false)}>
        {isOpen && (
          <Form step={0} setIsOpen={setIsOpen} setRerender={setRerender} />
        )}
      </Drawer>

      <Drawer
        open={isLayoutOpen}
        store={layoutDrawer}
        aria-label="Edit Layout"
        withBackdrop={true}
        onClose={() => setIsLayoutOpen(false)}>
        {isLayoutOpen && variant.layout?.id && (
          <LayoutForm
            setOpen={setIsLayoutOpen}
            cId={variant.layout.id}
            setRerender={setRerender}
          />
        )}
      </Drawer>

      <Drawer
        open={isThemeOpen}
        store={themeDrawer}
        aria-label="Edit Theme"
        withBackdrop={true}
        onClose={() => setIsThemeOpen(false)}>
        {isThemeOpen && variant.theme?.id && (
          <ThemeAddForm
            setIsOpen={setIsThemeOpen}
            themeId={variant.theme.id}
            setRerender={setRerender}
          />
        )}
      </Drawer>
    </>
  );
};

export default VariantDetailForm;
