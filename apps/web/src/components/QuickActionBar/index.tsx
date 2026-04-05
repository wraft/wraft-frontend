import React, {
  useState,
  useEffect,
  useCallback,
  useRef,
  useMemo,
} from 'react';
import { useRouter } from 'next/router';
import { Box, Flex, Text, InputText, Spinner } from '@wraft/ui';
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

  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const setNewContent = contentStore((state) => state.addNewContent);

  // Select a template: store it and navigate to the editor
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

  // ─── Filter actions by query ────────────────────────────
  const filteredActions = useMemo(() => {
    if (!query.trim()) return quickActions;
    const q = query.toLowerCase();
    return quickActions.filter(
      (a) =>
        a.label.toLowerCase().includes(q) ||
        a.description.toLowerCase().includes(q),
    );
  }, [query, quickActions]);

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

  // ─── Effects ────────────────────────────────────────────
  useEffect(() => {
    if (isOpen) {
      setQuery('');
      setActiveIndex(0);
      setShowTemplates(false);
      setShowPipelines(false);
      loadRecentItems();
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [isOpen, loadRecentItems]);

  // Reset active index on filter change
  useEffect(() => {
    setActiveIndex(0);
  }, [query, showTemplates, showPipelines]);

  // ─── Subview state helpers ───────────────────────────────
  const isSubView = showTemplates || showPipelines;

  const filteredPipelines = useMemo(() => {
    if (!query.trim()) return pipelines;
    const q = query.toLowerCase();
    return pipelines.filter((p: any) => p.name?.toLowerCase().includes(q));
  }, [query, pipelines]);

  // ─── Total item count for keyboard nav ──────────────────
  const totalItems = showTemplates
    ? templates.filter(
        (t) =>
          !query.trim() || t.title.toLowerCase().includes(query.toLowerCase()),
      ).length
    : showPipelines
      ? filteredPipelines.length
      : filteredActions.length + recentItems.length;

  // ─── Keyboard navigation ────────────────────────────────
  const goBackToActions = useCallback(() => {
    setShowTemplates(false);
    setShowPipelines(false);
    setQuery('');
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

      if (e.key === 'Enter') {
        e.preventDefault();
        if (showTemplates && templates[activeIndex]) {
          selectTemplate(templates[activeIndex]);
        } else if (showPipelines && filteredPipelines[activeIndex]) {
          const p = filteredPipelines[activeIndex];
          if (p.stages_count > 0) {
            onClose();
            router.push(`/pipelines/run/${p.id}`);
          }
        } else if (activeIndex < filteredActions.length) {
          filteredActions[activeIndex]?.onAction();
        } else {
          const recentIndex = activeIndex - filteredActions.length;
          if (recentItems[recentIndex]) {
            onClose();
            router.push(`/documents/${recentItems[recentIndex].id}`);
          }
        }
        return;
      }

      // Backspace at empty query goes back
      if (e.key === 'Backspace' && query === '' && isSubView) {
        goBackToActions();
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

  // ─── Render ─────────────────────────────────────────────
  return (
    <Overlay onClick={onClose}>
      <PaletteContainer
        onClick={(e: React.MouseEvent) => e.stopPropagation()}
        onKeyDown={handleKeyDown}>
        {/* Search Input */}
        <Flex
          align="center"
          px="lg"
          gap="sm"
          borderBottom="1px solid"
          borderColor="border">
          <MagnifyingGlassIcon size={16} weight="bold" />
          <Box flex={1} py="2px">
            <InputText
              ref={inputRef}
              value={query}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setQuery(e.target.value)
              }
              placeholder={
                showTemplates
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
          </Box>
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
          {showTemplates ? (
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
                      sx={
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
              {/* Quick Actions */}
              {filteredActions.length > 0 && (
                <>
                  <Flex px="lg" py="xs" mb="xxs">
                    <Text
                      fontSize="xs"
                      fontWeight="600"
                      color="text-secondary"
                      textTransform="uppercase"
                      letterSpacing="0.5px">
                      Actions
                    </Text>
                  </Flex>
                  {filteredActions.map((action, i) => (
                    <ActionItem
                      key={action.id}
                      isActive={i === activeIndex}
                      data-active={i === activeIndex}
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
                  ))}
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
                      const idx = filteredActions.length + i;
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
              {filteredActions.length === 0 && query.trim() && (
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
