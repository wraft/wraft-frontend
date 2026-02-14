import React, { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import NavLink from 'next/link';
import { useRouter } from 'next/router';
import { Drawer, useDrawer, Button, Box, Flex, Text, Spinner } from '@wraft/ui';
import {
  PencilSimple,
  Plus,
  FileText,
  Files,
  ArrowUpRight,
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

// --- Primitives ---

const Stat = ({ label, value }: { label: string; value: string | number }) => (
  <Box>
    <Text
      fontSize="xl"
      fontWeight="700"
      color="text-primary"
      style={{ fontVariantNumeric: 'tabular-nums' }}>
      {value}
    </Text>
    <Text fontSize="xs" color="text-secondary" mt="2px">
      {label}
    </Text>
  </Box>
);

const SectionCard = ({
  title,
  count,
  action,
  children,
}: {
  title: string;
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
    <Flex
      justify="space-between"
      align="center"
      px="md"
      py="sm"
      borderBottom="1px solid"
      borderColor="border">
      <Flex align="center" gap="xs">
        <Text fontSize="sm" fontWeight="600" color="text-primary">
          {title}
        </Text>
        {count !== undefined && (
          <Text
            fontSize="xs"
            fontWeight="500"
            color="text-secondary"
            style={{ fontVariantNumeric: 'tabular-nums' }}>
            {count}
          </Text>
        )}
      </Flex>
      {action}
    </Flex>
    {children}
  </Box>
);

const EmptyBlock = ({
  message,
  actionLabel,
  onAction,
}: {
  message: string;
  actionLabel?: string;
  onAction?: () => void;
}) => (
  <Flex direction="column" align="center" justify="center" py="lg" px="md">
    <Text fontSize="sm" color="text-secondary" textAlign="center" mb="sm">
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

const KV = ({
  label,
  value,
  onClick,
}: {
  label: string;
  value?: string | null;
  onClick?: () => void;
}) => (
  <Flex
    justify="space-between"
    align="center"
    px="md"
    py="8px"
    onClick={onClick}
    cursor={onClick ? 'pointer' : 'default'}
    _hover={onClick ? { bg: 'background-secondary' } : undefined}>
    <Text fontSize="xs" color="text-secondary">
      {label}
    </Text>
    <Text
      fontSize="xs"
      fontWeight="500"
      color={onClick ? 'primary' : 'text-primary'}
      style={{
        maxWidth: 160,
        overflow: 'hidden',
        textOverflow: 'ellipsis',
        whiteSpace: 'nowrap',
      }}>
      {value || '—'}
    </Text>
  </Flex>
);

const Row = ({
  children,
  isLast,
}: {
  children: React.ReactNode;
  isLast?: boolean;
}) => (
  <Flex
    justify="space-between"
    align="center"
    px="md"
    py="8px"
    borderBottom={isLast ? 'none' : '1px solid'}
    borderColor="border">
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
      setDocuments(items.slice(0, 6));
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
      {/* Header: compact, single-line */}
      <Flex justify="space-between" align="center" mb="md">
        <Flex gap="sm" align="center">
          <Flex
            w="32px"
            h="32px"
            borderRadius="sm"
            bg={variant.color || 'green.300'}
            align="center"
            justify="center"
            flexShrink={0}>
            <Text fontSize="sm" fontWeight="700" color="white">
              {variant.prefix?.charAt(0) || 'V'}
            </Text>
          </Flex>
          <Text fontSize="md" fontWeight="600" color="text-primary">
            {variant.name}
          </Text>
          <Text
            fontSize="xs"
            fontWeight="500"
            color="text-secondary"
            bg="background-secondary"
            px="xs"
            py="2px"
            borderRadius="sm">
            {variant.prefix}
          </Text>
          {variant.description && (
            <>
              <Text fontSize="xs" color="text-secondary" opacity={0.4}>
                /
              </Text>
              <Text
                fontSize="xs"
                color="text-secondary"
                style={{
                  maxWidth: 300,
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap',
                }}>
                {variant.description}
              </Text>
            </>
          )}
        </Flex>
        {canManage && (
          <Button variant="secondary" size="sm" onClick={() => setIsOpen(true)}>
            <PencilSimple size={14} />
            Edit
          </Button>
        )}
      </Flex>

      {/* Upgrade banner — tight */}
      {(content as any)?.flow_version_outdated && (
        <Flex
          bg="yellow.50"
          border="1px solid"
          borderColor="yellow.200"
          borderRadius="sm"
          px="md"
          py="xs"
          align="center"
          justify="space-between"
          mb="md">
          <Text fontSize="xs" color="yellow.800">
            Using Flow v{versionNum}. Version{' '}
            {(content as any)?.latest_flow_version?.version_number} available.
          </Text>
          {canManage && (
            <Button variant="secondary" size="xs" onClick={handleUpgrade}>
              Upgrade
            </Button>
          )}
        </Flex>
      )}

      {/* Stats bar — inline, no cards */}
      <Flex
        gap="xl"
        mb="md"
        pb="md"
        borderBottom="1px solid"
        borderColor="border">
        <Stat label="Documents" value={totalDocuments} />
        <Stat label="Templates" value={templates.length} />
        <Stat label="Fields" value={fields.length} />
        <Stat
          label="Flow"
          value={flowName ? `${flowName} v${versionNum}` : '—'}
        />
      </Flex>

      {/* Two-column dashboard */}
      <Box display="grid" gridTemplateColumns="1fr 300px" gap="md">
        {/* Left */}
        <Flex direction="column" gap="md">
          {/* Templates */}
          <SectionCard
            title="Templates"
            count={templates.length}
            action={
              templates.length > 0 ? (
                <NavLink href="/templates">
                  <Flex align="center" gap="2px">
                    <Text fontSize="xs" color="primary">
                      View all
                    </Text>
                    <ArrowUpRight
                      size={10}
                      color="var(--theme-ui-colors-primary)"
                    />
                  </Flex>
                </NavLink>
              ) : undefined
            }>
            {templates.length === 0 ? (
              <EmptyBlock
                message="No templates yet."
                actionLabel="Create Template"
                onAction={() => router.push('/templates')}
              />
            ) : (
              templates.map((t: any, i: number) => (
                <Row key={t.id} isLast={i === templates.length - 1}>
                  <NavLink href={`/templates/${t.id}`}>
                    <Flex align="center" gap="xs">
                      <FileText
                        size={14}
                        color="var(--theme-ui-colors-text-secondary)"
                      />
                      <Text
                        fontSize="sm"
                        fontWeight="500"
                        style={{
                          maxWidth: 320,
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          whiteSpace: 'nowrap',
                        }}>
                        {t.title}
                      </Text>
                    </Flex>
                  </NavLink>
                  <TimeAgo time={t.updated_at} />
                </Row>
              ))
            )}
          </SectionCard>

          {/* Documents */}
          <SectionCard
            title="Recent Documents"
            count={totalDocuments}
            action={
              documents.length > 0 ? (
                <NavLink href="/documents">
                  <Flex align="center" gap="2px">
                    <Text fontSize="xs" color="primary">
                      View all
                    </Text>
                    <ArrowUpRight
                      size={10}
                      color="var(--theme-ui-colors-primary)"
                    />
                  </Flex>
                </NavLink>
              ) : undefined
            }>
            {documents.length === 0 ? (
              <EmptyBlock
                message="No documents yet."
                actionLabel="Create Document"
                onAction={() => router.push('/documents')}
              />
            ) : (
              documents.map((doc: any, i: number) => (
                <Row
                  key={doc.content?.id || i}
                  isLast={i === documents.length - 1}>
                  <Flex
                    align="center"
                    gap="sm"
                    style={{ minWidth: 0, flex: 1 }}>
                    <Files
                      size={14}
                      color="var(--theme-ui-colors-text-secondary)"
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
                      py="2px"
                      borderRadius="sm">
                      {doc.state?.state || 'Draft'}
                    </Text>
                    <TimeAgo time={doc.content?.updated_at} />
                  </Flex>
                </Row>
              ))
            )}
          </SectionCard>
        </Flex>

        {/* Right sidebar */}
        <Flex direction="column" gap="md">
          {/* Configuration */}
          <SectionCard title="Configuration">
            <Box>
              <KV
                label="Layout"
                value={variant.layout?.name}
                onClick={() => setIsLayoutOpen(true)}
              />
              <KV
                label="Theme"
                value={variant.theme?.name}
                onClick={() => setIsThemeOpen(true)}
              />
              <KV label="Flow" value={flowName || undefined} />
              <KV
                label="Version"
                value={versionNum ? `v${versionNum}` : undefined}
              />
              <KV label="Color" value={variant.color || undefined} />
              <KV label="Type" value={variant.type || undefined} />
            </Box>
          </SectionCard>

          {/* Fields */}
          <SectionCard title="Fields" count={fields.length}>
            {fields.length === 0 ? (
              <EmptyBlock
                message="No fields configured."
                actionLabel="Edit Variant"
                onAction={() => setIsOpen(true)}
              />
            ) : (
              fields.map((f: any, i: number) => (
                <Row key={f.id || i} isLast={i === fields.length - 1}>
                  <Text
                    fontSize="xs"
                    fontWeight="500"
                    style={{
                      maxWidth: 140,
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap',
                    }}>
                    {f.name}
                  </Text>
                  <Text fontSize="xs" color="text-secondary">
                    {f.field_type?.name}
                  </Text>
                </Row>
              ))
            )}
          </SectionCard>
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
