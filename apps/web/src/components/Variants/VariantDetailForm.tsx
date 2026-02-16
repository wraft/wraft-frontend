import React, { useEffect, useState, useMemo } from 'react';
import dynamic from 'next/dynamic';
import NavLink from 'next/link';
import { useRouter } from 'next/router';
import { Drawer, useDrawer, Button, Box, Flex, Text, Spinner } from '@wraft/ui';
import {
  PencilSimple,
  Plus,
  FileText,
  Files,
  TrendUp,
  TrendDown,
} from '@phosphor-icons/react';
import toast from 'react-hot-toast';
import { useTheme } from '@xstyled/emotion';

import { DocumentCard } from 'components/Dashboard/DocumentCard';
import Back from 'common/Back';
import { TimeAgo } from 'common/Atoms';
import { BarChart } from 'common/charts/BarChart';
import { createChartConfig } from 'common/charts/ChartConfig';
import { ContentType, ContentTypeVersion } from 'utils/types';
import { fetchAPI, putAPI, postAPI, deleteAPI } from 'utils/models';
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

const TemplateCard = ({ template }: { template: any }) => (
  <NavLink href={`/templates/${template.id}`}>
    <Box
      border="1px solid"
      borderColor="border"
      borderRadius="md"
      p="md"
      bg="background-primary"
      style={{ transition: 'all 0.2s', cursor: 'pointer' }}>
      <Flex align="center" gap="sm" mb="sm">
        <FileText size={20} color="var(--theme-ui-colors-green-500)" />
        <Text fontSize="md" fontWeight="600" color="text-primary">
          {template.title}
        </Text>
      </Flex>
      {template.description && (
        <Text
          fontSize="sm"
          color="text-secondary"
          mb="md"
          style={{
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden',
          }}>
          {template.description}
        </Text>
      )}
      <Flex justify="space-between" align="center">
        <Text fontSize="xs" color="text-tertiary">
          Updated <TimeAgo time={template.updated_at} />
        </Text>
        <Text fontSize="xs" color="text-tertiary">
          v{template.version || '1.0'}
        </Text>
      </Flex>
    </Box>
  </NavLink>
);

const StatBlock = ({
  label,
  value,
  trend,
}: {
  label: string;
  value: number;
  trend?: number;
}) => (
  <Box
    p="lg"
    border="1px solid"
    borderColor="border"
    borderRadius="md"
    bg="background-primary"
    flex={1}
    display="flex"
    flexDirection="column"
    justifyContent="center">
    <Text fontSize="sm" color="text-secondary" mb="xs" fontWeight="500">
      {label}
    </Text>
    <Flex align="baseline" gap="sm">
      <Text
        fontSize="3xl"
        fontWeight="600"
        lineHeight="1"
        color="text-primary"
        style={{ fontVariantNumeric: 'tabular-nums' }}>
        {value}
      </Text>
      {trend !== undefined && (
        <Flex
          align="center"
          gap="xxs"
          color={trend > 0 ? 'green.600' : 'red.600'}>
          {trend > 0 ? (
            <TrendUp weight="bold" size={14} />
          ) : (
            <TrendDown weight="bold" size={14} />
          )}
          <Text fontSize="xs" fontWeight="600">
            {Math.abs(trend)}%
          </Text>
        </Flex>
      )}
    </Flex>
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
  const [versions, setVersions] = useState<ContentTypeVersion[]>([]);
  const [loading, setLoading] = useState(true);
  const [isOpen, setIsOpen] = useState(false);
  const [drawerStep, setDrawerStep] = useState(0);
  const [isLayoutOpen, setIsLayoutOpen] = useState(false);
  const [isThemeOpen, setIsThemeOpen] = useState(false);
  const [rerender, setRerender] = useState(false);
  const [activeTab, setActiveTab] = useState<
    'overview' | 'contents' | 'activities'
  >('overview');
  const [chartInterval, setChartInterval] = useState<'month' | 'week' | 'day'>(
    'month',
  );
  const [chartData, setChartData] = useState<any[]>([]);
  const [chartLoading, setChartLoading] = useState(false);
  const [selectedVersionId, setSelectedVersionId] = useState<string | null>(
    null,
  );

  const { hasPermission } = usePermission();
  const editDrawer = useDrawer();
  const layoutDrawer = useDrawer();
  const themeDrawer = useDrawer();
  const router = useRouter();
  const cId: string = router.query.id as string;
  const theme: any = useTheme();

  useEffect(() => {
    if (cId) {
      loadAllData(cId, selectedVersionId);
      loadChartData(cId, chartInterval);
    }
  }, [cId, selectedVersionId, rerender]);

  useEffect(() => {
    if (cId) {
      loadChartData(cId, chartInterval);
    }
  }, [chartInterval]);

  const loadChartData = async (id: string, interval: string) => {
    try {
      setChartLoading(true);
      const data: any = await fetchAPI(
        `content_types/${id}/chart?period=alltime&interval=${interval}&select_by=insert`,
      );
      // Transform data for BarChart
      const transformed = data.map((item: any) => ({
        name: new Date(item.datetime).toLocaleDateString('en-US', {
          month: 'short',
          day: interval === 'month' ? undefined : 'numeric',
          year: interval === 'year' ? 'numeric' : undefined,
        }),
        documents: item.total,
      }));
      setChartData(transformed);
    } catch {
      setChartData([]);
    } finally {
      setChartLoading(false);
    }
  };

  const loadAllData = async (id: string, versionId: string | null = null) => {
    try {
      setLoading(true);
      let variantData: any;

      if (versionId) {
        try {
          const vData: any = await fetchAPI(
            `content_type_versions/${versionId}`,
          );
          variantData = { content_type: vData.content_type_version };
        } catch {
          // Fallback to main content type if version fetch fails
          variantData = await fetchAPI(`content_types/${id}`);
        }
      } else {
        variantData = await fetchAPI(`content_types/${id}`);
      }

      setContent(variantData);
      const variantName = variantData?.content_type?.name;

      await Promise.allSettled([
        loadTemplates(id),
        loadDocuments(variantName),
        loadVersions(id),
      ]);
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

  const loadVersions = async (id: string) => {
    try {
      const data: any = await fetchAPI(`content_types/${id}/versions`);
      setVersions(data?.content_type_versions || []);
    } catch {
      setVersions([]);
    }
  };

  const handleCreateDraft = async () => {
    try {
      await postAPI(`content_types/${cId}/versions`, {});
      toast.success('Draft version created');
      loadVersions(cId);
    } catch (error: any) {
      toast.error(error?.message || 'Failed to create draft');
    }
  };

  const handlePublish = async (versionId: string) => {
    try {
      await postAPI(`content_type_versions/${versionId}/publish`, {});
      toast.success('Version published');
      loadVersions(cId);
    } catch (error: any) {
      toast.error(error?.message || 'Failed to publish version');
    }
  };

  const handleActivate = async (versionId: string) => {
    try {
      await postAPI(`content_type_versions/${versionId}/activate`, {});
      toast.success('Version activated');
      loadVersions(cId);
      // Reload content to update active version details
      const variantData: any = await fetchAPI(`content_types/${cId}`);
      setContent(variantData);
    } catch (error: any) {
      toast.error(error?.message || 'Failed to activate version');
    }
  };

  const handleDeleteDraft = async (versionId: string) => {
    if (!confirm('Are you sure you want to delete this draft?')) return;
    try {
      await deleteAPI(`content_type_versions/${versionId}`);
      toast.success('Draft deleted');
      loadVersions(cId);
    } catch (error: any) {
      toast.error(error?.message || 'Failed to delete draft');
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
      setDocuments(items.slice(0, 5)); // Load top 5 for Overview
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
                    <Flex justify="space-between" align="center" mb="sm">
                      <Text
                        as="h4"
                        fontWeight="heading"
                        fontSize="md"
                        color="text-secondary">
                        Document Activity
                      </Text>
                      <Flex
                        gap="xs"
                        bg="background-secondary"
                        p="2px"
                        borderRadius="md">
                        {['day', 'week', 'month'].map((interval) => (
                          <Button
                            key={interval}
                            size="xs"
                            variant={
                              chartInterval === interval ? 'secondary' : 'ghost'
                            }
                            onClick={() => setChartInterval(interval as any)}
                            style={{
                              textTransform: 'capitalize',
                              height: 24,
                              boxShadow:
                                chartInterval === interval
                                  ? '0 1px 2px rgba(0,0,0,0.1)'
                                  : 'none',
                            }}>
                            {interval}
                          </Button>
                        ))}
                      </Flex>
                    </Flex>
                    {chartLoading ? (
                      <Flex
                        h={240}
                        align="center"
                        justify="center"
                        border="1px solid"
                        borderColor="border"
                        borderRadius="md"
                        bg="background-primary">
                        <Spinner />
                      </Flex>
                    ) : chartData.length > 0 ? (
                      <BarChart
                        data={chartData}
                        dataKeys={['documents']}
                        height={240}
                        showGrid
                        showLegend={false}
                        showTooltip
                        config={chartConfig}
                        hoverBarColor={
                          variant.color || theme.colors.green['400']
                        }
                      />
                    ) : (
                      <Flex
                        h={240}
                        align="center"
                        justify="center"
                        border="1px solid"
                        borderColor="border"
                        borderRadius="md"
                        bg="background-primary"
                        direction="column"
                        gap="sm">
                        <Text color="text-secondary">
                          No activity data available
                        </Text>
                      </Flex>
                    )}
                  </Box>

                  {/* Stats Grid */}
                  <Flex direction="column" gap="md">
                    <StatBlock
                      label="Total Documents"
                      value={totalDocuments}
                      trend={12.5}
                    />
                    <StatBlock
                      label="Active Templates"
                      value={templates.length}
                      trend={2.4}
                    />
                  </Flex>
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
              <Flex direction="column" gap="xxl">
                {/* Templates Grid */}
                <Box>
                  <Flex justify="space-between" align="center" mb="md">
                    <Text fontSize="md" fontWeight="600">
                      Templates
                    </Text>
                    <Button
                      variant="secondary"
                      size="xs"
                      onClick={() => router.push('/templates/new')}>
                      <Plus size={12} weight="bold" />
                      Create Template
                    </Button>
                  </Flex>

                  {templates.length === 0 ? (
                    <Card>
                      <CardEmpty
                        message="No templates yet"
                        actionLabel="Create template"
                        onAction={() => router.push('/templates/new')}
                      />
                    </Card>
                  ) : (
                    <Box
                      display="grid"
                      gridTemplateColumns="repeat(auto-fill, minmax(280px, 1fr))"
                      gap="md">
                      {templates.map((t: any) => (
                        <TemplateCard key={t.id} template={t} />
                      ))}
                    </Box>
                  )}
                </Box>

                {/* Documents List */}
                <Box>
                  <Flex justify="space-between" align="center" mb="md">
                    <Text fontSize="md" fontWeight="600">
                      All Documents
                    </Text>
                    {documents.length > 0 && (
                      <NavLink
                        href={`/documents?content_type_name=${encodeURIComponent(variant.name)}`}>
                        <Text fontSize="sm" color="green.900" fontWeight="500">
                          View full list
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

            {activeTab === 'activities' && (
              <Card>
                <CardEmpty message="No recent activities" />
              </Card>
            )}
          </Flex>

          {/* RIGHT PANEL (Sidebar) - 25% */}
          <Flex direction="column" gap="lg" flex={1} style={{ minWidth: 320 }}>
            {/* Versions */}
            <Card>
              <CardHeader
                title="Versions"
                action={
                  canManage ? (
                    <Flex
                      as="button"
                      align="center"
                      gap="xs"
                      onClick={handleCreateDraft}
                      style={{
                        cursor: 'pointer',
                        background: 'none',
                        border: 'none',
                      }}>
                      <Plus
                        size={14}
                        weight="bold"
                        color="var(--theme-ui-colors-green-600)"
                      />
                      <Text fontSize="xs" color="green.600" fontWeight="600">
                        New Draft
                      </Text>
                    </Flex>
                  ) : undefined
                }
              />
              {versions.length === 0 ? (
                <CardEmpty
                  message="No versions found"
                  actionLabel="Create Draft"
                  onAction={handleCreateDraft}
                />
              ) : (
                versions.map((v: ContentTypeVersion) => (
                  <Row
                    key={v.id}
                    isLast={false}
                    // highlight selected
                    // onClick={() => setSelectedVersionId(v.id)}
                  >
                    <Flex
                      direction="column"
                      onClick={() => setSelectedVersionId(v.id)}
                      style={{ cursor: 'pointer', flex: 1 }}>
                      <Flex align="center" gap="xs">
                        <Text
                          fontSize="sm"
                          fontWeight={
                            selectedVersionId === v.id ? '700' : '600'
                          }
                          color={
                            selectedVersionId === v.id
                              ? 'green.900'
                              : 'text-primary'
                          }>
                          v{v.version_number}
                        </Text>
                        {v.status === 'draft' && (
                          <Text
                            fontSize="xs"
                            bg="orange.100"
                            color="orange.800"
                            px="xs"
                            borderRadius="sm">
                            Draft
                          </Text>
                        )}
                        {v.status === 'published' && (
                          <Text
                            fontSize="xs"
                            bg="green.100"
                            color="green.800"
                            px="xs"
                            borderRadius="sm">
                            Published
                          </Text>
                        )}
                        {(content as any)?.active_version?.id === v.id && (
                          <Text
                            fontSize="xs"
                            bg="blue.100"
                            color="blue.800"
                            px="xs"
                            borderRadius="sm">
                            Active
                          </Text>
                        )}
                      </Flex>
                      <Text fontSize="xs" color="text-tertiary">
                        <TimeAgo time={v.inserted_at} />
                      </Text>
                    </Flex>
                    {canManage && (
                      <Flex gap="xs">
                        {v.status === 'draft' && (
                          <>
                            <Button
                              size="xs"
                              variant="ghost"
                              onClick={(e) => {
                                e.stopPropagation();
                                handlePublish(v.id);
                              }}>
                              Publish
                            </Button>
                            <Button
                              size="xs"
                              variant="ghost"
                              color="red"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleDeleteDraft(v.id);
                              }}>
                              Delete
                            </Button>
                          </>
                        )}
                        {v.status === 'published' &&
                          (content as any)?.active_version?.id !== v.id && (
                            <Button
                              size="xs"
                              variant="ghost"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleActivate(v.id);
                              }}>
                              Activate
                            </Button>
                          )}
                      </Flex>
                    )}
                  </Row>
                ))
              )}
            </Card>

            {selectedVersionId && (
              <Box mb="lg">
                <Button
                  variant="secondary"
                  size="sm"
                  style={{ width: '100%' }}
                  onClick={() => setSelectedVersionId(null)}>
                  Back to Active Version
                </Button>
              </Box>
            )}

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
            versionId={selectedVersionId}
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
