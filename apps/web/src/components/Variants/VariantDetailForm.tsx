import React, { useEffect, useState, useMemo } from 'react';
import dynamic from 'next/dynamic';
import NavLink from 'next/link';
import { useRouter } from 'next/router';
import { Drawer, useDrawer, Button, Box, Flex, Text, Spinner } from '@wraft/ui';
import { PencilSimple, Plus, FileText, Files } from '@phosphor-icons/react';
import toast from 'react-hot-toast';
import { useTheme } from '@xstyled/emotion';

import { DocumentCard } from 'components/Dashboard/DocumentCard';
import Back from 'common/Back';
import { TimeAgo } from 'common/Atoms';
import { BarChart } from 'common/charts/BarChart';
import { createChartConfig } from 'common/charts/ChartConfig';
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

const Card = ({
  children,
  p = '0',
}: {
  children: React.ReactNode;
  p?: string;
}) => (
  <Box
    border="1px solid"
    borderColor="border"
    borderRadius="md"
    bg="background-primary"
    overflow="hidden"
    p={p}>
    {children}
  </Box>
);

const TabButton = ({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) => (
  <Box
    as="button"
    onClick={onClick}
    pb="sm"
    px="sm"
    borderBottom="2px solid"
    borderColor={active ? 'green.500' : 'transparent'}
    color={active ? 'green.900' : 'text-secondary'}
    fontWeight={active ? '600' : '500'}
    fontSize="sm"
    bg="transparent"
    cursor="pointer"
    style={{ transition: 'all 0.2s' }}>
    {children}
  </Box>
);

const CardHeader = ({
  title,
  count,
  action,
}: {
  title: string;
  count?: number;
  action?: React.ReactNode;
}) => (
  <Flex
    justify="space-between"
    align="center"
    px="lg"
    py="md"
    borderBottom="1px solid"
    borderColor="border">
    <Flex align="center" gap="sm">
      <Text fontSize="sm" fontWeight="600" color="text-primary">
        {title}
      </Text>
      {count !== undefined && (
        <Text
          fontSize="xs"
          fontWeight="500"
          color="text-secondary"
          bg="background-secondary"
          px="xs"
          py="xxs"
          borderRadius="sm"
          style={{ fontVariantNumeric: 'tabular-nums' }}>
          {count}
        </Text>
      )}
    </Flex>
    {action}
  </Flex>
);

const CardEmpty = ({
  message,
  actionLabel,
  onAction,
}: {
  message: string;
  actionLabel?: string;
  onAction?: () => void;
}) => (
  <Flex direction="column" align="center" justify="center" py="xxl" px="lg">
    <Text fontSize="sm" color="text-secondary" mb="md">
      {message}
    </Text>
    {actionLabel && onAction && (
      <Button variant="secondary" size="sm" onClick={onAction}>
        <Plus size={12} weight="bold" />
        {actionLabel}
      </Button>
    )}
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
    px="lg"
    py="sm"
    borderBottom={isLast ? 'none' : '1px solid'}
    borderColor="border">
    {children}
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
      <Text fontSize="sm" color="text-secondary">
        {label}
      </Text>
      <Text
        fontSize="sm"
        fontWeight="500"
        color={interactive ? 'green.900' : 'text-primary'}
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
};

// --- Main ---

const VariantDetailForm = () => {
  const [content, setContent] = useState<ContentType | undefined>(undefined);
  const [templates, setTemplates] = useState<any[]>([]);
  const [documents, setDocuments] = useState<any[]>([]);
  const [documentsMeta, setDocumentsMeta] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [isOpen, setIsOpen] = useState(false);
  const [drawerStep, setDrawerStep] = useState(0);
  const [isLayoutOpen, setIsLayoutOpen] = useState(false);
  const [isThemeOpen, setIsThemeOpen] = useState(false);
  const [rerender, setRerender] = useState(false);
  const [activeTab, setActiveTab] = useState<
    'overview' | 'contents' | 'activities'
  >('overview');

  const { hasPermission } = usePermission();
  const editDrawer = useDrawer();
  const layoutDrawer = useDrawer();
  const themeDrawer = useDrawer();
  const router = useRouter();
  const cId: string = router.query.id as string;
  const theme: any = useTheme();

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
  const flowName = variant.flow?.flow?.name || (variant.flow as any)?.name;
  const versionNum = (content as any)?.flow_version?.version_number;
  const canManage = hasPermission('variant', 'manage');

  const openDrawerAt = (step: number) => {
    setDrawerStep(step);
    setIsOpen(true);
  };

  // Dummy data for charts
  const chartData = [
    { name: 'Jan', documents: 12 },
    { name: 'Feb', documents: 19 },
    { name: 'Mar', documents: 15 },
    { name: 'Apr', documents: 22 },
    { name: 'May', documents: 30 },
    { name: 'Jun', documents: 25 },
  ];

  const chartConfig = createChartConfig(['documents'], {
    documents: {
      label: 'Documents Created',
      color: variant.color || theme.colors.green['400'],
    },
  });

  return (
    <>
      {/* Header bar */}
      <Box
        borderBottom="1px solid"
        borderColor="border"
        py="md"
        px="lg"
        w="100%"
        position="sticky"
        top={0}
        zIndex={10}
        bg="background-primary">
        <Flex align="center">
          <Back
            fallbackRoute={(isAuthenticated: boolean) =>
              isAuthenticated ? '/variants' : '/login'
            }
          />
          <Flex
            align="center"
            gap="sm"
            ml="sm"
            style={{ minWidth: 0, flex: 1 }}>
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
            <Flex direction="column" style={{ minWidth: 0 }} pl="sm">
              <Flex align="center" gap="xs">
                <Text fontSize="md" fontWeight="heading" color="text-primary">
                  {variant.name}
                </Text>
                <Text
                  fontSize="sm"
                  fontWeight="500"
                  color="text-secondary"
                  bg="#eee"
                  px="xs"
                  py="xxs"
                  borderRadius="sm"
                  style={{ fontVariantNumeric: 'tabular-nums' }}>
                  {variant.prefix}
                </Text>
              </Flex>
              {variant.description && (
                <Text
                  fontSize="sm2"
                  color="text-secondary"
                  style={{
                    maxWidth: 480,
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap',
                  }}>
                  {variant.description}
                </Text>
              )}
            </Flex>
          </Flex>
          <Flex gap="sm" flexShrink={0}>
            {canManage && (
              <Button
                variant="secondary"
                size="sm"
                onClick={() => openDrawerAt(0)}>
                <PencilSimple size={14} />
                Edit
              </Button>
            )}
          </Flex>
        </Flex>
      </Box>

      {/* Page body */}
      <Box px="xl" py="lg" style={{ overflow: 'auto', flex: 1 }}>
        <Flex gap="xl" style={{ maxWidth: 1600, margin: '0 auto' }}>
          {/* LEFT PANEL (Main Content) - 75% */}
          <Flex direction="column" gap="lg" flex={3} style={{ minWidth: 0 }}>
            {/* Tabs */}
            <Flex
              gap="md"
              borderBottom="1px solid"
              borderColor="border"
              mb="md">
              <TabButton
                active={activeTab === 'overview'}
                onClick={() => setActiveTab('overview')}>
                Overview
              </TabButton>
              <TabButton
                active={activeTab === 'contents'}
                onClick={() => setActiveTab('contents')}>
                Contents
              </TabButton>
              <TabButton
                active={activeTab === 'activities'}
                onClick={() => setActiveTab('activities')}>
                Activities
              </TabButton>
            </Flex>

            {activeTab === 'overview' && (
              <Flex direction="column" gap="xl">
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
                    justify="space-between">
                    <Text fontSize="sm" color="orange.900">
                      Using flow v{versionNum}. Version{' '}
                      {(content as any)?.latest_flow_version?.version_number} is
                      available.
                    </Text>
                    {canManage && (
                      <Button
                        variant="secondary"
                        size="xs"
                        onClick={handleUpgrade}>
                        Upgrade
                      </Button>
                    )}
                  </Flex>
                )}

                {/* Combined Stats & Chart Unit */}
                <Box display="grid" gridTemplateColumns="2fr 1fr" gap="lg">
                  {/* Chart Area */}
                  <Box>
                    <BarChart
                      title="Document Activity"
                      description="Last 6 months"
                      data={chartData}
                      dataKeys={['documents']}
                      height={240}
                      showGrid
                      showLegend={false}
                      showTooltip
                      config={chartConfig}
                      hoverBarColor={variant.color || theme.colors.green['400']}
                    />
                  </Box>

                  {/* Stats Grid */}
                  <Box display="grid" gridTemplateColumns="1fr 1fr" gap="md">
                    {[
                      { label: 'Documents', value: totalDocuments },
                      { label: 'Templates', value: templates.length },
                      { label: 'Fields', value: fields.length },
                      { label: 'Flow v.', value: versionNum || 0 },
                    ].map((stat) => (
                      <Card key={stat.label} p="md">
                        <Flex
                          direction="column"
                          justify="space-between"
                          h="100%">
                          <Text fontSize="xs" color="text-secondary" mb="xxs">
                            {stat.label}
                          </Text>
                          <Text
                            fontSize="xl"
                            fontWeight="600"
                            color="text-primary"
                            style={{ fontVariantNumeric: 'tabular-nums' }}>
                            {stat.value}
                          </Text>
                        </Flex>
                      </Card>
                    ))}
                  </Box>
                </Box>

                {/* Recent Documents using DocumentCard */}
                <Box>
                  <Flex justify="space-between" align="center" mb="md">
                    <Text fontSize="md" fontWeight="600">
                      Recent Documents
                    </Text>
                    {documents.length > 0 && (
                      <NavLink
                        href={`/documents?content_type_name=${encodeURIComponent(variant.name)}`}>
                        <Text fontSize="sm" color="green.900" fontWeight="500">
                          View all
                        </Text>
                      </NavLink>
                    )}
                  </Flex>

                  {documents.length === 0 ? (
                    <Card>
                      <CardEmpty
                        message="No documents yet"
                        actionLabel="Create document"
                        onAction={() => router.push('/documents')}
                      />
                    </Card>
                  ) : (
                    <Flex direction="column" gap="sm">
                      {documents.map((doc: any) => (
                        <DocumentCard
                          key={doc.content.id}
                          content={{
                            content: doc.content,
                            creator: doc.creator,
                            state: doc.state,
                            flow: doc.flow,
                            content_type: { color: variant.color },
                          }}
                          hideState={false}
                        />
                      ))}
                    </Flex>
                  )}
                </Box>
              </Flex>
            )}

            {activeTab === 'contents' && (
              <Flex direction="column" gap="lg">
                <Card>
                  <CardHeader
                    title="Templates"
                    count={templates.length}
                    action={
                      templates.length > 0 ? (
                        <NavLink
                          href={`/templates?content_type_id=${variant.id}`}>
                          <Text
                            fontSize="sm"
                            color="green.900"
                            fontWeight="500">
                            View all
                          </Text>
                        </NavLink>
                      ) : undefined
                    }
                  />
                  {templates.length === 0 ? (
                    <CardEmpty
                      message="No templates yet"
                      actionLabel="Create template"
                      onAction={() => router.push('/templates')}
                    />
                  ) : (
                    templates.map((t: any, i: number) => (
                      <Row key={t.id} isLast={i === templates.length - 1}>
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
                                maxWidth: 360,
                                overflow: 'hidden',
                                textOverflow: 'ellipsis',
                                whiteSpace: 'nowrap',
                              }}>
                              {t.title}
                            </Text>
                          </Flex>
                        </NavLink>
                        <Text
                          fontSize="sm"
                          color="text-secondary"
                          flexShrink={0}>
                          <TimeAgo time={t.updated_at} />
                        </Text>
                      </Row>
                    ))
                  )}
                </Card>
              </Flex>
            )}

            {activeTab === 'activities' && (
              <Card>
                <CardEmpty message="No recent activities" />
              </Card>
            )}
          </Flex>

          {/* RIGHT PANEL (Sidebar) - 25% */}
          <Flex direction="column" gap="lg" flex={1} style={{ minWidth: 320 }}>
            {/* Configuration */}
            <Card>
              <CardHeader
                title="Configuration"
                action={
                  canManage ? (
                    <Text
                      fontSize="sm"
                      color="green.900"
                      fontWeight="500"
                      cursor="pointer"
                      onClick={() => openDrawerAt(1)}>
                      Edit
                    </Text>
                  ) : undefined
                }
              />
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
            </Card>

            {/* Fields */}
            <Card>
              <CardHeader
                title="Fields"
                count={fields.length}
                action={
                  canManage ? (
                    <Text
                      fontSize="sm"
                      color="green.900"
                      fontWeight="500"
                      cursor="pointer"
                      onClick={() => openDrawerAt(2)}>
                      Edit
                    </Text>
                  ) : undefined
                }
              />
              {fields.length === 0 ? (
                <CardEmpty
                  message="No fields configured"
                  actionLabel="Add fields"
                  onAction={() => openDrawerAt(2)}
                />
              ) : (
                fields.map((f: any, i: number) => (
                  <Row key={f.id || i} isLast={i === fields.length - 1}>
                    <Text
                      fontSize="sm"
                      fontWeight="500"
                      style={{
                        maxWidth: 160,
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
            </Card>
          </Flex>
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
          <Form
            step={drawerStep}
            setIsOpen={setIsOpen}
            setRerender={setRerender}
          />
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
