import React, {
  useState,
  useEffect,
  useCallback,
  useRef,
  useMemo,
} from 'react';
import { useRouter } from 'next/router';
import { Box, Flex, Text, InputText, Spinner, Tag } from '@wraft/ui';
import styled from '@emotion/styled';
import {
  MagnifyingGlassIcon,
  FileTextIcon,
  PenNibIcon,
  GitBranchIcon,
  ArrowClockwiseIcon,
  ArticleIcon,
  ClockIcon,
  LightningIcon,
  XIcon,
  ArrowRightIcon,
  PlusIcon,
} from '@phosphor-icons/react';

import { fetchAPI } from 'utils/models';
import contentStore from 'store/content.store';

// ─── Types ──────────────────────────────────────────────────
interface QuickAction {
  id: string;
  label: string;
  description: string;
  icon: React.ReactNode;
  category: 'create' | 'action' | 'recent';
  shortcut?: string;
  onAction: () => void;
}

interface RecentItem {
  id: string;
  name: string;
  type: string;
  updatedAt: string;
}

interface ContextOption {
  id: string;
  name: string;
  type: 'module' | 'variant';
  prefix?: string;
  color?: string;
}

const STATIC_MODULES: ContextOption[] = [
  { id: 'forms', name: 'Forms', type: 'module' },
  { id: 'pipelines', name: 'Pipelines', type: 'module' },
  { id: 'flows', name: 'Flows', type: 'module' },
  { id: 'templates', name: 'Templates', type: 'module' },
];

interface QuickActionBarProps {
  isOpen: boolean;
  onClose: () => void;
}

// ─── Styled Components ──────────────────────────────────────
const Overlay = styled(Box)`
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.4);
  backdrop-filter: blur(4px);
  z-index: 9999;
  display: flex;
  align-items: flex-start;
  justify-content: center;
  padding-top: 12vh;
  animation: fadeIn 120ms ease-out;

  @keyframes fadeIn {
    from {
      opacity: 0;
    }
    to {
      opacity: 1;
    }
  }
`;

const PaletteContainer = styled(Box)`
  width: 580px;
  max-height: 520px;
  background: ${({ theme }: any) =>
    theme.colors?.['background-primary'] || '#fff'};
  border-radius: 12px;
  box-shadow:
    0 16px 70px rgba(0, 0, 0, 0.15),
    0 0 0 1px rgba(0, 0, 0, 0.06);
  display: flex;
  flex-direction: column;
  overflow: hidden;
  animation: slideUp 150ms ease-out;

  @keyframes slideUp {
    from {
      opacity: 0;
      transform: translateY(-8px) scale(0.98);
    }
    to {
      opacity: 1;
      transform: translateY(0) scale(1);
    }
  }
`;

const ActionItem = styled(Flex)<{ isActive?: boolean }>`
  cursor: pointer;
  transition: background 80ms ease;
  background: ${({ isActive, theme }: any) =>
    isActive ? theme.colors?.green?.['200'] || '#f0f9f0' : 'transparent'};

  &:hover {
    background: ${({ theme }: any) =>
      theme.colors?.green?.['200'] || '#f0f9f0'};
  }
`;

const KbdKey = styled(Text)`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 20px;
  height: 20px;
  padding: 0 4px;
  font-size: 11px;
  font-weight: 500;
  color: ${({ theme }: any) => theme.colors?.gray?.['900'] || '#666'};
  background: ${({ theme }: any) =>
    theme.colors?.['background-secondary'] || '#f5f5f5'};
  border: 1px solid ${({ theme }: any) => theme.colors?.border || '#e0e0e0'};
  border-radius: 4px;
  font-family: inherit;
  line-height: 1;
`;

const InputWrapper = styled(Box)<{ isShifted?: boolean }>`
  transition: padding-left 150ms ease-out;
  padding-left: ${({ isShifted }) => (isShifted ? '8px' : '0')};
`;

// ─── Component ──────────────────────────────────────────────
const QuickActionBar = ({ isOpen, onClose }: QuickActionBarProps) => {
  const [query, setQuery] = useState('');
  const [activeIndex, setActiveIndex] = useState(0);
  const [templates, setTemplates] = useState<any[]>([]);
  const [loadingTemplates, setLoadingTemplates] = useState(false);
  const [showTemplates, setShowTemplates] = useState(false);
  const [pipelines, setPipelines] = useState<any[]>([]);
  const [loadingPipelines, setLoadingPipelines] = useState(false);
  const [showPipelines, setShowPipelines] = useState(false);
  const [recentItems, setRecentItems] = useState<RecentItem[]>([]);
  const [loadingRecent, setLoadingRecent] = useState(false);

  // Context State
  const [activeContext, setActiveContext] = useState<ContextOption | null>(
    null,
  );
  const [contentTypes, setContentTypes] = useState<ContextOption[]>([]);
  const [contextItems, setContextItems] = useState<any[]>([]);
  const [loadingContextItems, setLoadingContextItems] = useState(false);

  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const setNewContent = contentStore((state) => state.addNewContent);

  // ─── Select Template ────────────────────────────────────
  const selectTemplate = useCallback(
    (template: any) => {
      setNewContent({ id: template.id, template });
      onClose();
      router.push('/documents/new');
    },
    [onClose, router, setNewContent],
  );

  // ─── Quick actions ──────────────────────────────────────
  const quickActions: QuickAction[] = useMemo(
    () => [
      {
        id: 'create-document',
        label: 'Create from Template',
        description: 'Start a new document from an existing template',
        icon: <FileTextIcon size={18} weight="duotone" />,
        category: 'create',
        shortcut: 'T',
        onAction: () => {
          setShowTemplates(true);
          loadTemplates();
        },
      },
      {
        id: 'sign-contract',
        label: 'Sign a Contract',
        description: 'Initiate a document signing workflow',
        icon: <PenNibIcon size={18} weight="duotone" />,
        category: 'create',
        shortcut: 'S',
        onAction: () => {
          onClose();
          router.push('/documents');
        },
      },
      {
        id: 'new-template',
        label: 'Create New Template',
        description: 'Design a reusable document template',
        icon: <ArticleIcon size={18} weight="duotone" />,
        category: 'create',
        onAction: () => {
          onClose();
          router.push('/templates/new');
        },
      },
      {
        id: 'run-pipeline',
        label: 'Run a Pipeline',
        description: 'Execute an existing automated pipeline',
        icon: <LightningIcon size={18} weight="duotone" />,
        category: 'action',
        shortcut: 'R',
        onAction: () => {
          setShowPipelines(true);
          loadPipelines();
        },
      },
      {
        id: 'automate-pipeline',
        label: 'Automate a Pipeline',
        description: 'Set up an automated workflow like employee exit',
        icon: <GitBranchIcon size={18} weight="duotone" />,
        category: 'action',
        shortcut: 'P',
        onAction: () => {
          onClose();
          router.push('/pipelines');
        },
      },
    ],
    [onClose, router],
  );

  // ─── Load content types ──────────────────────────────────
  const loadContentTypes = useCallback(async () => {
    try {
      const data: any = await fetchAPI('content_types?page=1&per_page=100');
      if (data?.content_types) {
        setContentTypes(
          data.content_types.map((ct: any) => ({
            id: ct.id,
            name: ct.name,
            type: 'variant',
            prefix: ct.prefix,
            color: ct.color,
          })),
        );
      }
    } catch {
      setContentTypes([]);
    }
  }, []);

  // ─── Load recent documents ──────────────────────────────
  const loadRecentItems = useCallback(async () => {
    try {
      setLoadingRecent(true);
      const data: any = await fetchAPI(
        'contents?page=1&sort=updated_at_desc&per_page=5',
      );
      if (data?.contents) {
        setRecentItems(
          data.contents.map((doc: any) => ({
            id: doc.content?.id || doc.id,
            name:
              doc.content?.instance_id ||
              doc.content?.serialized?.title ||
              'Untitled',
            type: doc.content_type?.name || 'Document',
            updatedAt: doc.content?.updated_at || '',
          })),
        );
      }
    } catch {
      setRecentItems([]);
    } finally {
      setLoadingRecent(false);
    }
  }, []);

  // ─── Load templates ─────────────────────────────────────
  const loadTemplates = useCallback(async () => {
    try {
      setLoadingTemplates(true);
      const data: any = await fetchAPI(
        'data_templates?page=1&sort=updated_at_desc&per_page=8',
      );
      if (data?.data_templates) {
        setTemplates(data.data_templates);
      }
    } catch {
      setTemplates([]);
    } finally {
      setLoadingTemplates(false);
    }
  }, []);

  // ─── Load pipelines ─────────────────────────────────────
  const loadPipelines = useCallback(async () => {
    try {
      setLoadingPipelines(true);
      const data: any = await fetchAPI(
        'pipelines?sort=inserted_at_desc&page=1',
      );
      if (data?.pipelines) {
        setPipelines(data.pipelines);
      }
    } catch {
      setPipelines([]);
    } finally {
      setLoadingPipelines(false);
    }
  }, []);

  // ─── Context Items Effect ───────────────────────────────
  useEffect(() => {
    if (!activeContext) return;
    let isCancelled = false;

    const fetchContextData = async () => {
      setLoadingContextItems(true);
      try {
        if (activeContext.type === 'variant') {
          const data: any = await fetchAPI(
            `data_templates?page=1&sort=updated_at_desc&per_page=8&content_type_id=${activeContext.id}`,
          );
          if (!isCancelled && data?.data_templates) {
            setContextItems(data.data_templates);
          }
        } else if (activeContext.id === 'pipelines') {
          const data: any = await fetchAPI(
            'pipelines?sort=inserted_at_desc&page=1',
          );
          if (!isCancelled && data?.pipelines) {
            setContextItems(data.pipelines);
          }
        } else if (activeContext.id === 'templates') {
          const data: any = await fetchAPI(
            `data_templates?page=1&sort=updated_at_desc&per_page=8`,
          );
          if (!isCancelled && data?.data_templates) {
            setContextItems(data.data_templates);
          }
        } else {
          if (!isCancelled) setContextItems([]);
        }
      } catch {
        if (!isCancelled) setContextItems([]);
      } finally {
        if (!isCancelled) setLoadingContextItems(false);
      }
    };

    fetchContextData();
    return () => {
      isCancelled = true;
    };
  }, [activeContext]);

  // ─── Effects ────────────────────────────────────────────
  useEffect(() => {
    if (isOpen) {
      setQuery('');
      setActiveContext(null);
      setActiveIndex(0);
      setShowTemplates(false);
      setShowPipelines(false);
      loadRecentItems();
      loadContentTypes();
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [isOpen, loadRecentItems, loadContentTypes]);

  // Reset active index on filter change
  useEffect(() => {
    setActiveIndex(0);
  }, [query, showTemplates, showPipelines, activeContext]);

  // ─── Subview state helpers ───────────────────────────────
  const isSubView = showTemplates || showPipelines || !!activeContext;

  const filteredPipelines = useMemo(() => {
    if (!query.trim()) return pipelines;
    const q = query.toLowerCase();
    return pipelines.filter((p: any) => p.name?.toLowerCase().includes(q));
  }, [query, pipelines]);

  // ─── Context Options ────────────────────────────────────
  const contextOptions = useMemo(() => {
    if (activeContext || !query.trim()) return [];
    const q = query.toLowerCase();
    const allContexts = [...STATIC_MODULES, ...contentTypes];
    return allContexts.filter(
      (c) =>
        c.name.toLowerCase().includes(q) ||
        (c.prefix && c.prefix.toLowerCase().includes(q)),
    );
  }, [query, activeContext, contentTypes]);

  const filteredActions = useMemo(() => {
    if (!query.trim()) return quickActions;
    const q = query.toLowerCase();
    return quickActions.filter(
      (a) =>
        a.label.toLowerCase().includes(q) ||
        a.description.toLowerCase().includes(q),
    );
  }, [query, quickActions]);

  const filteredContextItems = useMemo(() => {
    if (!query.trim()) return contextItems;
    const q = query.toLowerCase();
    return contextItems.filter((item) => {
      const title = item.title || item.name || '';
      return title.toLowerCase().includes(q);
    });
  }, [query, contextItems]);

  // ─── Total item count for keyboard nav ──────────────────
  const totalItems = activeContext
    ? 1 + filteredContextItems.length
    : showTemplates
      ? templates.filter(
          (t) =>
            !query.trim() ||
            t.title.toLowerCase().includes(query.toLowerCase()),
        ).length
      : showPipelines
        ? filteredPipelines.length
        : contextOptions.length +
          filteredActions.length +
          (query.trim() ? 0 : recentItems.length);

  // ─── Keyboard navigation ────────────────────────────────
  const goBackToActions = useCallback(() => {
    setShowTemplates(false);
    setShowPipelines(false);
    setActiveContext(null);
    setQuery('');
  }, []);

  const handleContextSelect = useCallback((context: ContextOption) => {
    setActiveContext(context);
    setQuery('');
    setActiveIndex(0);
  }, []);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === 'Escape') {
        if (isSubView) {
          goBackToActions();
        } else {
          onClose();
        }
        return;
      }

      if (e.key === 'Backspace' && query === '' && activeContext) {
        e.preventDefault();
        goBackToActions();
        return;
      }

      if (e.key === 'ArrowDown') {
        e.preventDefault();
        setActiveIndex((prev) => (prev + 1) % Math.max(totalItems, 1));
        return;
      }

      if (e.key === 'ArrowUp') {
        e.preventDefault();
        setActiveIndex(
          (prev) =>
            (prev - 1 + Math.max(totalItems, 1)) % Math.max(totalItems, 1),
        );
        return;
      }

      if (e.key === 'Enter' || e.key === 'Tab') {
        if (totalItems === 0) return;
        e.preventDefault();

        if (activeContext) {
          if (activeIndex === 0) {
            // New Action
            onClose();
            if (activeContext.type === 'variant') {
              router.push(
                `/documents?content_type_name=${encodeURIComponent(activeContext.name)}`,
              );
            } else if (activeContext.id === 'pipelines') {
              router.push('/pipelines');
            } else if (activeContext.id === 'forms') {
              router.push('/forms');
            } else if (activeContext.id === 'flows') {
              router.push('/manage/flows');
            } else if (activeContext.id === 'templates') {
              router.push('/templates/new');
            }
          } else {
            const item = filteredContextItems[activeIndex - 1];
            if (
              activeContext.type === 'variant' ||
              activeContext.id === 'templates'
            ) {
              selectTemplate(item);
            } else if (activeContext.id === 'pipelines') {
              if (item.stages_count > 0) {
                onClose();
                router.push(`/pipelines/run/${item.id}`);
              }
            }
          }
          return;
        }

        if (showTemplates && templates[activeIndex]) {
          selectTemplate(templates[activeIndex]);
          return;
        } else if (showPipelines && filteredPipelines[activeIndex]) {
          const p = filteredPipelines[activeIndex];
          if (p.stages_count > 0) {
            onClose();
            router.push(`/pipelines/run/${p.id}`);
          }
          return;
        }

        let currentIndex = activeIndex;

        if (!activeContext && !showTemplates && !showPipelines) {
          if (currentIndex < contextOptions.length) {
            handleContextSelect(contextOptions[currentIndex]);
            return;
          }
          currentIndex -= contextOptions.length;

          if (currentIndex < filteredActions.length) {
            filteredActions[currentIndex]?.onAction();
            return;
          }
          currentIndex -= filteredActions.length;

          if (!query.trim() && recentItems[currentIndex]) {
            onClose();
            router.push(`/documents/${recentItems[currentIndex].id}`);
          }
        }
        return;
      }
    },
    [
      onClose,
      isSubView,
      goBackToActions,
      showTemplates,
      showPipelines,
      totalItems,
      activeIndex,
      filteredActions,
      filteredPipelines,
      recentItems,
      templates,
      query,
      router,
      selectTemplate,
      activeContext,
      contextOptions,
      handleContextSelect,
      filteredContextItems,
    ],
  );

  // Scroll active item into view
  useEffect(() => {
    if (listRef.current) {
      const activeEl = listRef.current.querySelector('[data-active="true"]');
      activeEl?.scrollIntoView({ block: 'nearest' });
    }
  }, [activeIndex]);

  if (!isOpen) return null;

  // ─── Time formatting helper ─────────────────────────────
  const timeAgo = (dateStr: string) => {
    if (!dateStr) return '';
    const diff = Date.now() - new Date(dateStr).getTime();
    const mins = Math.floor(diff / 60000);
    if (mins < 1) return 'just now';
    if (mins < 60) return `${mins}m ago`;
    const hrs = Math.floor(mins / 60);
    if (hrs < 24) return `${hrs}h ago`;
    const days = Math.floor(hrs / 24);
    return `${days}d ago`;
  };

  const contextPrefix = activeContext ? (
    <Tag
      variant="info"
      size="sm"
      onRemove={goBackToActions}
      style={{
        animation: 'slideRight 150ms ease-out',
        background: activeContext.color || '#e0f2fe',
        color: activeContext.color ? '#fff' : '#0284c7',
        fontWeight: 600,
      }}>
      {activeContext.prefix || activeContext.name}
    </Tag>
  ) : null;

  // ─── Render ─────────────────────────────────────────────
  return (
    <Overlay onClick={onClose}>
      <PaletteContainer
        onClick={(e: React.MouseEvent) => e.stopPropagation()}
        onKeyDown={handleKeyDown}>
        <style>{`
          @keyframes slideRight {
            from { opacity: 0; transform: translateX(-4px); }
            to { opacity: 1; transform: translateX(0); }
          }
        `}</style>
        {/* Search Input */}
        <Flex
          align="center"
          px="lg"
          gap="sm"
          borderBottom="1px solid"
          borderColor="border">
          <MagnifyingGlassIcon size={16} weight="bold" />
          <InputWrapper flex={1} py="2px" isShifted={!!activeContext}>
            <InputText
              ref={inputRef}
              value={query}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setQuery(e.target.value)
              }
              prefixElement={contextPrefix}
              placeholder={
                activeContext
                  ? `Search ${activeContext.name}...`
                  : showTemplates
                    ? 'Search templates...'
                    : showPipelines
                      ? 'Search pipelines...'
                      : 'What would you like to do?'
              }
              style={{
                border: 'none',
                boxShadow: 'none',
                fontSize: '15px',
                padding: '12px 0',
                background: 'transparent',
              }}
            />
          </InputWrapper>
          {query && (
            <Flex
              as="button"
              align="center"
              justify="center"
              onClick={() => setQuery('')}
              cursor="pointer"
              p="xxs"
              borderRadius="sm"
              border="none"
              bg="transparent"
              sx={{ '&:hover': { bg: 'background-secondary' } }}>
              <XIcon size={14} />
            </Flex>
          )}
        </Flex>

        {/* Content area */}
        <Box ref={listRef} flex={1} overflowY="auto" maxHeight="420px" py="xs">
          {activeContext ? (
            /* ─── Active Context View ───────────────────── */
            <>
              <Flex
                align="center"
                gap="xs"
                px="lg"
                py="xs"
                mb="xxs"
                cursor="pointer"
                onClick={goBackToActions}
                sx={{ '&:hover': { opacity: 0.7 } }}>
                <Text fontSize="xs" color="text-secondary" fontWeight="500">
                  Clear context
                </Text>
              </Flex>

              <ActionItem
                key="new-action"
                isActive={0 === activeIndex}
                data-active={0 === activeIndex}
                align="center"
                gap="sm"
                px="lg"
                py="sm"
                mx="xs"
                borderRadius="md"
                onClick={() => {
                  onClose();
                  if (activeContext.type === 'variant') {
                    router.push(
                      `/documents?content_type_name=${encodeURIComponent(activeContext.name)}`,
                    );
                  } else if (activeContext.id === 'pipelines') {
                    router.push('/pipelines');
                  } else if (activeContext.id === 'forms') {
                    router.push('/forms');
                  } else if (activeContext.id === 'flows') {
                    router.push('/manage/flows');
                  } else if (activeContext.id === 'templates') {
                    router.push('/templates/new');
                  }
                }}>
                <Flex
                  align="center"
                  justify="center"
                  w="32px"
                  h="32px"
                  borderRadius="md"
                  bg="green.100"
                  flexShrink={0}
                  color="green.900">
                  <PlusIcon size={16} weight="bold" />
                </Flex>
                <Flex direction="column" flex={1} gap="1px">
                  <Text fontSize="sm2" fontWeight="500" color="text-primary">
                    New {activeContext.name}
                  </Text>
                  <Text fontSize="xs" color="text-secondary">
                    Create a new {activeContext.name}
                  </Text>
                </Flex>
                <KbdKey>↵</KbdKey>
              </ActionItem>

              {loadingContextItems ? (
                <Flex justify="center" py="xl">
                  <Spinner size={16} />
                </Flex>
              ) : (
                filteredContextItems.map((item, i) => {
                  const idx = i + 1;
                  const isTemplate =
                    activeContext.type === 'variant' ||
                    activeContext.id === 'templates';
                  const isPipeline = activeContext.id === 'pipelines';
                  const title = item.title || item.name;

                  return (
                    <ActionItem
                      key={item.id}
                      isActive={idx === activeIndex}
                      data-active={idx === activeIndex}
                      align="center"
                      gap="sm"
                      px="lg"
                      py="sm"
                      mx="xs"
                      mt={i === 0 ? 'xs' : 0}
                      borderRadius="md"
                      onClick={() => {
                        if (isTemplate) {
                          selectTemplate(item);
                        } else if (isPipeline) {
                          if (item.stages_count > 0) {
                            onClose();
                            router.push(`/pipelines/run/${item.id}`);
                          }
                        }
                      }}>
                      <Box
                        w="4px"
                        h="16px"
                        borderRadius="sm"
                        bg={
                          item.content_type?.color ||
                          activeContext.color ||
                          'green.600'
                        }
                        flexShrink={0}
                      />
                      <Flex direction="column" flex={1} gap="2px">
                        <Text
                          fontSize="sm2"
                          fontWeight="500"
                          color="text-primary"
                          style={{
                            whiteSpace: 'nowrap',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                          }}>
                          {title}
                        </Text>
                        <Text fontSize="xs" color="text-secondary">
                          {item.content_type?.name || activeContext.name}
                        </Text>
                      </Flex>
                      {isPipeline && item.stages_count > 0 && (
                        <Flex
                          align="center"
                          gap="xxs"
                          px="sm"
                          py="xxs"
                          borderRadius="md"
                          bg="green.200"
                          color="green.1100">
                          <LightningIcon size={12} weight="fill" />
                          <Text fontSize="xs" fontWeight="600">
                            Run
                          </Text>
                        </Flex>
                      )}
                      {isTemplate && <ArrowRightIcon size={12} />}
                    </ActionItem>
                  );
                })
              )}
            </>
          ) : showTemplates ? (
            /* ─── Template Picker View ───────────────────── */
            <>
              <Flex
                align="center"
                gap="xs"
                px="lg"
                py="xs"
                mb="xxs"
                cursor="pointer"
                onClick={goBackToActions}
                sx={{ '&:hover': { opacity: 0.7 } }}>
                <Text fontSize="xs" color="text-secondary" fontWeight="500">
                  Back to actions
                </Text>
              </Flex>

              {loadingTemplates ? (
                <Flex justify="center" py="xl">
                  <Spinner size={16} />
                </Flex>
              ) : templates.length === 0 ? (
                <Flex justify="center" py="xl">
                  <Text fontSize="sm" color="text-secondary">
                    No templates found
                  </Text>
                </Flex>
              ) : (
                templates
                  .filter(
                    (t) =>
                      !query.trim() ||
                      t.title.toLowerCase().includes(query.toLowerCase()),
                  )
                  .map((template, i) => (
                    <ActionItem
                      key={template.id}
                      isActive={i === activeIndex}
                      data-active={i === activeIndex}
                      align="center"
                      gap="sm"
                      px="lg"
                      py="sm"
                      mx="xs"
                      borderRadius="md"
                      onClick={() => selectTemplate(template)}>
                      <Box
                        w="4px"
                        h="16px"
                        borderRadius="sm"
                        bg={template.content_type?.color || 'green.600'}
                        flexShrink={0}
                      />
                      <Flex direction="column" flex={1} gap="2px">
                        <Text
                          fontSize="sm2"
                          fontWeight="500"
                          color="text-primary"
                          style={{
                            whiteSpace: 'nowrap',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                          }}>
                          {template.title}
                        </Text>
                        <Text fontSize="xs" color="text-secondary">
                          {template.content_type?.name}
                        </Text>
                      </Flex>
                      <Text fontSize="xs" color="text-secondary">
                        {template.content_type?.prefix}
                      </Text>
                      <ArrowRightIcon size={12} />
                    </ActionItem>
                  ))
              )}
            </>
          ) : showPipelines ? (
            /* ─── Pipeline Picker View ──────────────────── */
            <>
              <Flex
                align="center"
                gap="xs"
                px="lg"
                py="xs"
                mb="xxs"
                cursor="pointer"
                onClick={goBackToActions}
                sx={{ '&:hover': { opacity: 0.7 } }}>
                <Text fontSize="xs" color="text-secondary" fontWeight="500">
                  Back to actions
                </Text>
              </Flex>

              {loadingPipelines ? (
                <Flex justify="center" py="xl">
                  <Spinner size={16} />
                </Flex>
              ) : filteredPipelines.length === 0 ? (
                <Flex
                  direction="column"
                  align="center"
                  justify="center"
                  py="xxl"
                  gap="sm">
                  <GitBranchIcon size={32} weight="duotone" />
                  <Text fontSize="sm" fontWeight="500" color="text-primary">
                    {query.trim()
                      ? `No pipelines match "${query}"`
                      : 'No pipelines yet'}
                  </Text>
                  <Text
                    fontSize="xs"
                    color="text-secondary"
                    textAlign="center"
                    maxWidth="280px">
                    {query.trim()
                      ? 'Try a different search term'
                      : 'Create a pipeline to automate document workflows like employee exit, onboarding, and more.'}
                  </Text>
                  {!query.trim() && (
                    <Flex
                      as="button"
                      type="button"
                      align="center"
                      gap="xs"
                      mt="xs"
                      px="md"
                      py="xs"
                      borderRadius="md"
                      border="1px solid"
                      borderColor="border"
                      bg="background-primary"
                      cursor="pointer"
                      onClick={() => {
                        onClose();
                        router.push('/pipelines');
                      }}
                      sx={{ '&:hover': { bg: 'green.200' } }}>
                      <Text fontSize="sm" fontWeight="500">
                        Go to Pipelines
                      </Text>
                      <ArrowRightIcon size={12} />
                    </Flex>
                  )}
                </Flex>
              ) : (
                filteredPipelines.map((pipeline: any, i: number) => {
                  const hasStages = pipeline.stages_count > 0;
                  return (
                    <ActionItem
                      key={pipeline.id}
                      isActive={i === activeIndex}
                      data-active={i === activeIndex}
                      align="center"
                      gap="sm"
                      px="lg"
                      py="sm"
                      mx="xs"
                      borderRadius="md"
                      onClick={() => {
                        if (hasStages) {
                          onClose();
                          router.push(`/pipelines/run/${pipeline.id}`);
                        }
                      }}
                      style={
                        !hasStages
                          ? { opacity: 0.5, cursor: 'not-allowed' }
                          : {}
                      }>
                      <Flex
                        align="center"
                        justify="center"
                        w="32px"
                        h="32px"
                        borderRadius="md"
                        bg="background-secondary"
                        flexShrink={0}
                        color="green.900">
                        <GitBranchIcon size={16} weight="duotone" />
                      </Flex>
                      <Flex direction="column" flex={1} gap="1px">
                        <Text
                          fontSize="sm2"
                          fontWeight="500"
                          color="text-primary"
                          style={{
                            whiteSpace: 'nowrap',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                          }}>
                          {pipeline.name}
                        </Text>
                        <Text fontSize="xs" color="text-secondary">
                          {hasStages
                            ? `${pipeline.stages_count} stage${pipeline.stages_count !== 1 ? 's' : ''}`
                            : 'No stages configured'}
                        </Text>
                      </Flex>
                      {hasStages ? (
                        <Flex
                          align="center"
                          gap="xxs"
                          px="sm"
                          py="xxs"
                          borderRadius="md"
                          bg="green.200"
                          color="green.1100">
                          <LightningIcon size={12} weight="fill" />
                          <Text fontSize="xs" fontWeight="600">
                            Run
                          </Text>
                        </Flex>
                      ) : (
                        <Text fontSize="xs" color="text-secondary">
                          Setup required
                        </Text>
                      )}
                    </ActionItem>
                  );
                })
              )}
            </>
          ) : (
            /* ─── Main Actions View ──────────────────────── */
            <>
              {/* Context Matches */}
              {contextOptions.length > 0 && (
                <>
                  <Flex px="lg" py="xs" mb="xxs">
                    <Text
                      fontSize="xs"
                      fontWeight="600"
                      color="text-secondary"
                      textTransform="uppercase"
                      letterSpacing="0.5px">
                      Contexts
                    </Text>
                  </Flex>
                  {contextOptions.map((ctx, i) => (
                    <ActionItem
                      key={ctx.id}
                      isActive={i === activeIndex}
                      data-active={i === activeIndex}
                      align="center"
                      gap="sm"
                      px="lg"
                      py="sm"
                      mx="xs"
                      borderRadius="md"
                      onClick={() => handleContextSelect(ctx)}>
                      <Flex
                        align="center"
                        justify="center"
                        w="32px"
                        h="32px"
                        borderRadius="md"
                        bg="background-secondary"
                        flexShrink={0}
                        color="green.900">
                        <MagnifyingGlassIcon size={16} weight="bold" />
                      </Flex>
                      <Flex direction="column" flex={1} gap="1px">
                        <Text
                          fontSize="sm2"
                          fontWeight="500"
                          color="text-primary">
                          {ctx.name}
                        </Text>
                        <Text fontSize="xs" color="text-secondary">
                          Filter by {ctx.name} context
                        </Text>
                      </Flex>
                      {ctx.prefix && <KbdKey>{ctx.prefix}</KbdKey>}
                      <KbdKey>tab</KbdKey>
                    </ActionItem>
                  ))}
                </>
              )}

              {/* Quick Actions */}
              {filteredActions.length > 0 && (
                <>
                  <Flex
                    px="lg"
                    py="xs"
                    mt={contextOptions.length > 0 ? 'sm' : 0}
                    mb="xxs">
                    <Text
                      fontSize="xs"
                      fontWeight="600"
                      color="text-secondary"
                      textTransform="uppercase"
                      letterSpacing="0.5px">
                      Actions
                    </Text>
                  </Flex>
                  {filteredActions.map((action, i) => {
                    const idx = contextOptions.length + i;
                    return (
                      <ActionItem
                        key={action.id}
                        isActive={idx === activeIndex}
                        data-active={idx === activeIndex}
                        align="center"
                        gap="sm"
                        px="lg"
                        py="sm"
                        mx="xs"
                        borderRadius="md"
                        onClick={() => action.onAction()}>
                        <Flex
                          align="center"
                          justify="center"
                          w="32px"
                          h="32px"
                          borderRadius="md"
                          bg="background-secondary"
                          flexShrink={0}
                          color="green.900">
                          {action.icon}
                        </Flex>
                        <Flex direction="column" flex={1} gap="1px">
                          <Text
                            fontSize="sm2"
                            fontWeight="500"
                            color="text-primary">
                            {action.label}
                          </Text>
                          <Text fontSize="xs" color="text-secondary">
                            {action.description}
                          </Text>
                        </Flex>
                        {action.shortcut && <KbdKey>{action.shortcut}</KbdKey>}
                      </ActionItem>
                    );
                  })}
                </>
              )}

              {/* Recent Items */}
              {!query.trim() && recentItems.length > 0 && (
                <>
                  <Flex px="lg" py="xs" mt="sm" mb="xxs">
                    <Flex align="center" gap="xs">
                      <ClockIcon size={12} />
                      <Text
                        fontSize="xs"
                        fontWeight="600"
                        color="text-secondary"
                        textTransform="uppercase"
                        letterSpacing="0.5px">
                        Recent
                      </Text>
                    </Flex>
                  </Flex>
                  {loadingRecent ? (
                    <Flex justify="center" py="md">
                      <Spinner size={14} />
                    </Flex>
                  ) : (
                    recentItems.map((item, i) => {
                      const idx =
                        contextOptions.length + filteredActions.length + i;
                      return (
                        <ActionItem
                          key={item.id}
                          isActive={idx === activeIndex}
                          data-active={idx === activeIndex}
                          align="center"
                          gap="sm"
                          px="lg"
                          py="sm"
                          mx="xs"
                          borderRadius="md"
                          onClick={() => {
                            onClose();
                            router.push(`/documents/${item.id}`);
                          }}>
                          <Flex
                            align="center"
                            justify="center"
                            w="32px"
                            h="32px"
                            borderRadius="md"
                            bg="background-secondary"
                            flexShrink={0}
                            color="gray.800">
                            <ArrowClockwiseIcon size={16} />
                          </Flex>
                          <Flex direction="column" flex={1} gap="1px">
                            <Text
                              fontSize="sm2"
                              fontWeight="500"
                              color="text-primary"
                              style={{
                                whiteSpace: 'nowrap',
                                overflow: 'hidden',
                                textOverflow: 'ellipsis',
                                maxWidth: '360px',
                              }}>
                              {item.name}
                            </Text>
                            <Text fontSize="xs" color="text-secondary">
                              {item.type}
                            </Text>
                          </Flex>
                          <Text fontSize="xs" color="text-secondary">
                            {timeAgo(item.updatedAt)}
                          </Text>
                        </ActionItem>
                      );
                    })
                  )}
                </>
              )}

              {/* Empty state */}
              {contextOptions.length === 0 &&
                filteredActions.length === 0 &&
                query.trim() && (
                  <Flex
                    direction="column"
                    align="center"
                    justify="center"
                    py="xxl"
                    gap="sm">
                    <Text fontSize="sm" color="text-secondary">
                      No actions match &ldquo;{query}&rdquo;
                    </Text>
                  </Flex>
                )}
            </>
          )}
        </Box>

        {/* Footer */}
        <Flex
          px="lg"
          py="sm"
          gap="md"
          borderTop="1px solid"
          borderColor="border"
          align="center"
          bg="background-secondary"
          sx={{ borderRadius: '0 0 12px 12px' }}>
          <Flex align="center" gap="xxs">
            <KbdKey>↑</KbdKey>
            <KbdKey>↓</KbdKey>
            <Text fontSize="xs" color="text-secondary" ml="xxs">
              navigate
            </Text>
          </Flex>
          <Flex align="center" gap="xxs">
            <KbdKey>↵</KbdKey>
            <Text fontSize="xs" color="text-secondary" ml="xxs">
              select
            </Text>
          </Flex>
          <Flex align="center" gap="xxs">
            <KbdKey>esc</KbdKey>
            <Text fontSize="xs" color="text-secondary" ml="xxs">
              {isSubView ? 'back' : 'close'}
            </Text>
          </Flex>
          <Text fontSize="xs" color="text-secondary" ml="auto">
            /
          </Text>
        </Flex>
      </PaletteContainer>
    </Overlay>
  );
};

export default QuickActionBar;
