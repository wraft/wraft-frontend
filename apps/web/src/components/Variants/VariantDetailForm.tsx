import React, { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import NavLink from 'next/link';
import { useRouter } from 'next/router';
import { Drawer, useDrawer, Button, Box, Flex, Text, Spinner } from '@wraft/ui';
import { PencilSimple, Plus, FileText, Files } from '@phosphor-icons/react';
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

// --- Primitives ---

const Section = ({
  label,
  count,
  action,
  children,
}: {
  label: string;
  count?: number;
  action?: React.ReactNode;
  children: React.ReactNode;
}) => (
  <Box
    border="1px solid"
    borderColor="border"
    borderRadius="md"
    bg="background-primary"
    overflow="hidden">
    <Flex justify="space-between" align="center" px="lg" pt="md" pb="sm">
      <Flex align="center" gap="xs">
        <Text fontSize="xs" fontWeight="600" color="text-secondary">
          {label}
        </Text>
        {count !== undefined && (
          <Text
            fontSize="xs"
            color="text-secondary"
            style={{ fontVariantNumeric: 'tabular-nums', opacity: 0.6 }}>
            {count}
          </Text>
        )}
      </Flex>
      {action}
    </Flex>
    {children}
  </Box>
);

const Empty = ({
  message,
  actionLabel,
  onAction,
}: {
  message: string;
  actionLabel?: string;
  onAction?: () => void;
}) => (
  <Flex direction="column" align="center" justify="center" py="xl" px="lg">
    <Text fontSize="xs" color="text-secondary" mb="sm">
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

const Property = ({
  label,
  value,
  onClick,
}: {
  label: string;
  value?: string | null;
  onClick?: () => void;
}) => {
  const interactive = !!onClick;
  return (
    <Flex
      justify="space-between"
      align="center"
      px="lg"
      py="sm"
      onClick={onClick}
      cursor={interactive ? 'pointer' : 'default'}
      style={
        interactive ? { transition: 'background 120ms ease-out' } : undefined
      }>
      <Text fontSize="xs" color="text-secondary">
        {label}
      </Text>
      <Text
        fontSize="xs"
        fontWeight="500"
        color={interactive ? 'green.900' : 'text-primary'}
        style={{
          maxWidth: 140,
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          whiteSpace: 'nowrap',
        }}>
        {value || '—'}
      </Text>
    </Flex>
  );
};

const ListRow = ({
  children,
  isLast,
}: {
  children: React.ReactNode;
  isLast?: boolean;
}) => (
  <Flex
    justify="space-between"
    align="center"
    px="lg"
    py="sm"
    borderTop="1px solid"
    borderColor="border"
    style={isLast ? { borderBottom: 'none' } : undefined}>
    {children}
  </Flex>
);

// --- Main ---

const VariantDetailForm = () => {
  const [content, setContent] = useState<ContentType | undefined>(undefined);
  const [templates, setTemplates] = useState<any[]>([]);
  const [documents, setDocuments] = useState<any[]>([]);
  const [documentsMeta, setDocumentsMeta] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [isOpen, setIsOpen] = useState(false);
  const [isLayoutOpen, setIsLayoutOpen] = useState(false);
  const [isThemeOpen, setIsThemeOpen] = useState(false);
  const [rerender, setRerender] = useState(false);
  const { hasPermission } = usePermission();
  const editDrawer = useDrawer();
  const layoutDrawer = useDrawer();
  const themeDrawer = useDrawer();
  const router = useRouter();
  const cId: string = router.query.id as string;

  useEffect(() => {
    if (cId) loadAllData(cId);
  }, [cId, rerender]);

  const loadAllData = async (id: string) => {
    try {
      setLoading(true);
      const variantData: any = await fetchAPI(`content_types/${id}`);
      setContent(variantData);
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
      setTemplates(data?.data_templates || []);
    } catch {
      setTemplates([]);
    }
  };

  const loadDocuments = async (variantName?: string) => {
    if (!variantName) {
      setDocuments([]);
      setDocumentsMeta({ total_entries: 0 });
      return;
    }
    try {
      const data: any = await fetchAPI(
        `contents?sort=inserted_at_desc&page=1&content_type_name=${encodeURIComponent(variantName)}`,
      );
      const items = data?.contents || [];
      setDocuments(items.slice(0, 5));
      setDocumentsMeta({ total_entries: data.total_entries || items.length });
    } catch {
      setDocuments([]);
      setDocumentsMeta({ total_entries: 0 });
    }
  };

  const handleUpgrade = async () => {
    try {
      await putAPI(`content_types/${cId}/upgrade_flow_version`, {
        flow_version_id: (content as any)?.latest_flow_version?.id,
      });
      toast.success('Flow version upgraded.');
      loadAllData(cId);
    } catch (error: any) {
      toast.error(
        error?.response?.data?.errors?.[0] || 'Failed to upgrade flow version',
      );
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
  const flowName = variant.flow?.flow?.name || variant.flow?.name;
  const versionNum = (content as any)?.flow_version?.version_number;
  const canManage = hasPermission('variant', 'manage');

  return (
    <>
      {/* Header */}
      <Flex justify="space-between" align="flex-start" mb="lg">
        <Flex gap="sm" align="center">
          <Flex
            w="28px"
            h="28px"
            borderRadius="md"
            bg={variant.color || 'green.300'}
            align="center"
            justify="center"
            flexShrink={0}>
            <Text fontSize="xs" fontWeight="700" color="white">
              {variant.prefix?.charAt(0) || 'V'}
            </Text>
          </Flex>
          <Box>
            <Flex align="center" gap="xs">
              <Text fontSize="base" fontWeight="600" color="text-primary">
                {variant.name}
              </Text>
              <Text
                fontSize="xs"
                fontWeight="500"
                color="text-secondary"
                bg="background-secondary"
                px="xs"
                py="xxs"
                borderRadius="sm"
                style={{ fontVariantNumeric: 'tabular-nums' }}>
                {variant.prefix}
              </Text>
            </Flex>
            {variant.description && (
              <Text
                fontSize="xs"
                color="text-secondary"
                mt="xxs"
                style={{
                  maxWidth: 400,
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap',
                }}>
                {variant.description}
              </Text>
            )}
          </Box>
        </Flex>
        {canManage && (
          <Button variant="secondary" size="sm" onClick={() => setIsOpen(true)}>
            <PencilSimple size={14} />
            Edit
          </Button>
        )}
      </Flex>

      {/* Upgrade banner */}
      {(content as any)?.flow_version_outdated && (
        <Flex
          bg="orange.50"
          border="1px solid"
          borderColor="orange.200"
          borderRadius="md"
          px="lg"
          py="sm"
          align="center"
          justify="space-between"
          mb="lg">
          <Text fontSize="xs" color="orange.900">
            Using flow v{versionNum}. Version{' '}
            {(content as any)?.latest_flow_version?.version_number} is
            available.
          </Text>
          {canManage && (
            <Button variant="secondary" size="xs" onClick={handleUpgrade}>
              Upgrade
            </Button>
          )}
        </Flex>
      )}

      {/* Dashboard grid */}
      <Box display="grid" gridTemplateColumns="1fr 260px" gap="lg">
        {/* Left column */}
        <Flex direction="column" gap="lg">
          {/* Templates */}
          <Section
            label="Templates"
            count={templates.length}
            action={
              templates.length > 0 ? (
                <NavLink href="/templates">
                  <Text fontSize="xs" color="green.900" fontWeight="500">
                    View all
                  </Text>
                </NavLink>
              ) : undefined
            }>
            {templates.length === 0 ? (
              <Empty
                message="No templates yet"
                actionLabel="Create template"
                onAction={() => router.push('/templates')}
              />
            ) : (
              templates.map((t: any, i: number) => (
                <ListRow key={t.id} isLast={i === templates.length - 1}>
                  <NavLink href={`/templates/${t.id}`}>
                    <Flex align="center" gap="sm">
                      <FileText
                        size={14}
                        color="var(--theme-ui-colors-text-secondary)"
                      />
                      <Text
                        fontSize="sm"
                        fontWeight="500"
                        style={{
                          maxWidth: 300,
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          whiteSpace: 'nowrap',
                        }}>
                        {t.title}
                      </Text>
                    </Flex>
                  </NavLink>
                  <Text fontSize="xs" color="text-secondary" flexShrink={0}>
                    <TimeAgo time={t.updated_at} />
                  </Text>
                </ListRow>
              ))
            )}
          </Section>

          {/* Recent documents */}
          <Section
            label="Recent documents"
            count={totalDocuments}
            action={
              documents.length > 0 ? (
                <NavLink href="/documents">
                  <Text fontSize="xs" color="green.900" fontWeight="500">
                    View all
                  </Text>
                </NavLink>
              ) : undefined
            }>
            {documents.length === 0 ? (
              <Empty
                message="No documents yet"
                actionLabel="Create document"
                onAction={() => router.push('/documents')}
              />
            ) : (
              documents.map((doc: any, i: number) => (
                <ListRow
                  key={doc.content?.id || i}
                  isLast={i === documents.length - 1}>
                  <Flex
                    align="center"
                    gap="sm"
                    style={{ minWidth: 0, flex: 1 }}>
                    <Files
                      size={14}
                      color="var(--theme-ui-colors-text-secondary)"
                      style={{ flexShrink: 0 }}
                    />
                    <Flex direction="column" style={{ minWidth: 0 }}>
                      <Text
                        fontSize="sm"
                        fontWeight="500"
                        style={{
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          whiteSpace: 'nowrap',
                        }}>
                        {doc.content?.instance_id || `Document ${i + 1}`}
                      </Text>
                      <Text fontSize="xs" color="text-secondary">
                        {doc.creator?.name}
                      </Text>
                    </Flex>
                  </Flex>
                  <Flex align="center" gap="sm" flexShrink={0}>
                    <Text
                      fontSize="xs"
                      fontWeight="500"
                      color="text-secondary"
                      bg="background-secondary"
                      px="xs"
                      py="xxs"
                      borderRadius="sm">
                      {doc.state?.state || 'Draft'}
                    </Text>
                    <Text fontSize="xs" color="text-secondary">
                      <TimeAgo time={doc.content?.updated_at} />
                    </Text>
                  </Flex>
                </ListRow>
              ))
            )}
          </Section>
        </Flex>

        {/* Right sidebar */}
        <Flex direction="column" gap="lg">
          {/* Configuration */}
          <Section label="Configuration">
            <Box>
              <Property
                label="Layout"
                value={variant.layout?.name}
                onClick={() => setIsLayoutOpen(true)}
              />
              <Property
                label="Theme"
                value={variant.theme?.name}
                onClick={() => setIsThemeOpen(true)}
              />
              <Property label="Flow" value={flowName || undefined} />
              <Property
                label="Version"
                value={versionNum ? `v${versionNum}` : undefined}
              />
              <Property label="Color" value={variant.color || undefined} />
            </Box>
          </Section>

          {/* Fields */}
          <Section label="Fields" count={fields.length}>
            {fields.length === 0 ? (
              <Empty
                message="No fields configured"
                actionLabel="Edit variant"
                onAction={() => setIsOpen(true)}
              />
            ) : (
              fields.map((f: any, i: number) => (
                <ListRow key={f.id || i} isLast={i === fields.length - 1}>
                  <Text
                    fontSize="xs"
                    fontWeight="500"
                    style={{
                      maxWidth: 120,
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap',
                    }}>
                    {f.name}
                  </Text>
                  <Text fontSize="xs" color="text-secondary">
                    {f.field_type?.name}
                  </Text>
                </ListRow>
              ))
            )}
          </Section>
        </Flex>
      </Box>

      {/* Drawers */}
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
