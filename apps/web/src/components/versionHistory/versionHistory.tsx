import React, { useState, useEffect, useMemo } from 'react';
import { format } from 'date-fns';
import toast from 'react-hot-toast';
import { DotsThreeVerticalIcon } from '@phosphor-icons/react';
import {
  Modal,
  Flex,
  Box,
  Text,
  Button,
  DropdownMenu,
  InputText,
  Spinner,
  Pagination,
} from '@wraft/ui';

import { IconFrame } from 'common/Atoms';
import { fetchAPI, postAPI } from 'utils/models';

import { DiffViewer } from './diffViewer';

interface Author {
  email: string;
  name: string;
}

interface VersionsResponse {
  page_number: number;
  total_entries: number;
  total_pages: number;
  versions: APIVersion[];
}

interface APIVersion {
  id: string;
  inserted_at: string;
  naration: string | null;
  type: string;
  version_number: number;
  author: Author;
  current_version?: boolean;
}

interface UIVersion extends APIVersion {
  name: string;
  isCurrentVersion: boolean;
  hasChanges: boolean;
  previousVersionId?: string;
}

interface VersionHistoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  contentId: string;
}

interface DiffResponse {
  base_version: {
    id: string;
    serialized: {
      body: string;
      fields: string;
      title: string;
      serialized: string;
    };
  };
  target_version: {
    id: string;
    serialized: {
      body: string;
      fields: string;
      title: string;
      serialized: string;
    };
  };
}

const formatDateTime = (timestamp: string): string => {
  try {
    const date = new Date(timestamp);
    return `${format(date, 'MMMM d')}, ${format(date, 'h:mm a')}`;
  } catch {
    return 'Invalid date';
  }
};

const transformVersions = (apiVersions: APIVersion[]): UIVersion[] => {
  if (!apiVersions?.length) return [];

  const chronological = [...apiVersions].sort(
    (a, b) =>
      new Date(a.inserted_at).getTime() - new Date(b.inserted_at).getTime(),
  );

  return chronological
    .map((version, index) => {
      const prev = index > 0 ? chronological[index - 1] : null;
      return {
        ...version,
        name: version.naration || `Version ${version.version_number}`,
        isCurrentVersion: !!version.current_version,
        hasChanges: !!prev,
        previousVersionId: prev?.id,
      };
    })
    .reverse();
};

const VersionItem: React.FC<{
  version: UIVersion;
  isSelected: boolean;
  onSelect: () => void;
  onRestore: () => void;
  onRename: (newName: string) => void;
}> = ({ version, isSelected, onSelect, onRestore, onRename }) => {
  const [isRenaming, setIsRenaming] = useState(false);
  const [newName, setNewName] = useState(version.name);

  const handleRename = () => {
    if (newName.trim() && newName !== version.name) {
      onRename(newName.trim());
      toast.success('Version renamed successfully');
    }
    setIsRenaming(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') handleRename();
    if (e.key === 'Escape') {
      setNewName(version.name);
      setIsRenaming(false);
    }
  };

  return (
    <Box
      py="xs"
      px="sm"
      cursor="pointer"
      bg={isSelected ? 'rgba(66, 133, 244, 0.1)' : 'transparent'}
      onClick={onSelect}
      borderRadius="sm">
      <Flex justify="space-between" align="center">
        <Box flex="1">
          {isRenaming ? (
            <InputText
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              onBlur={handleRename}
              onKeyDown={handleKeyDown}
              fontSize="sm"
              fontWeight="500"
              size="sm"
            />
          ) : (
            <>
              <Flex justify="space-between" align="center" mb="xxs">
                <Text
                  fontSize="sm"
                  fontWeight="500"
                  color={isSelected ? 'primary.600' : 'text-primary'}>
                  {version.name}
                </Text>
                {version.isCurrentVersion && (
                  <Text
                    fontSize="xs"
                    color="green.800"
                    fontWeight="medium"
                    bg="green.50"
                    px="xs"
                    py="xxs"
                    borderRadius="sm">
                    Current
                  </Text>
                )}
              </Flex>
              <Text fontSize="xs" color="text-secondary">
                {formatDateTime(version.inserted_at)}
                {version.author && ` • ${version.author.name}`}
              </Text>
            </>
          )}
        </Box>

        <DropdownMenu.Provider>
          <DropdownMenu.Trigger>
            <IconFrame size="sm" color="icon">
              <DotsThreeVerticalIcon size={14} />
            </IconFrame>
          </DropdownMenu.Trigger>
          <DropdownMenu>
            {!version.isCurrentVersion && (
              <DropdownMenu.Item onClick={onRestore}>
                Restore Version
              </DropdownMenu.Item>
            )}
            <DropdownMenu.Item onClick={() => setIsRenaming(true)}>
              Rename Version
            </DropdownMenu.Item>
          </DropdownMenu>
        </DropdownMenu.Provider>
      </Flex>
    </Box>
  );
};

const VersionContent: React.FC<{
  version: UIVersion;
  diffData: DiffResponse | null;
  loading: boolean;
}> = ({ version, diffData, loading }) => {
  if (loading) return <Spinner />;
  if (!version)
    return <Text color="text-secondary">No versions available</Text>;

  const isFirstVersion = version.version_number === 1;
  const hasContent = diffData?.base_version?.serialized?.body;

  if (!diffData) {
    return (
      <Text color="text-secondary">No content available for this version</Text>
    );
  }

  if (isFirstVersion) {
    return (
      <Box
        minHeight="200px"
        maxHeight="600px"
        w="100%"
        overflowY="auto"
        bg="background-primary"
        p="lg"
        fontSize="sm"
        lineHeight="1.6">
        <Text color="text-secondary" fontWeight="medium" mb="md">
          {version.name}
        </Text>
        <Box
          p="sm"
          bg="gray.50"
          borderRadius="sm"
          maxHeight="400px"
          overflowY="auto">
          <Text fontSize="sm" color="text-secondary" whiteSpace="pre-wrap">
            {hasContent || 'No content available'}
          </Text>
          <Text fontSize="xs" color="text-secondary" mt="sm">
            Created on {format(new Date(version.inserted_at), 'MMMM d, yyyy')}
          </Text>
        </Box>
      </Box>
    );
  }

  return <DiffViewer diffData={diffData} />;
};

export const VersionHistoryModal: React.FC<VersionHistoryModalProps> = ({
  isOpen,
  onClose,
  contentId,
}) => {
  const [apiVersions, setApiVersions] = useState<APIVersion[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [diffData, setDiffData] = useState<DiffResponse | null>(null);
  const [diffLoading, setDiffLoading] = useState(false);
  const [pagination, setPagination] = useState({
    pageNumber: 1,
    totalEntries: 0,
    totalPages: 1,
  });
  const [currentPage, setCurrentPage] = useState(1);

  const versions = useMemo(() => transformVersions(apiVersions), [apiVersions]);
  const selectedVersion =
    versions.find((v) => v.id === selectedId) || versions[0] || null;

  const loadVersions = async (page: number = 1) => {
    try {
      setLoading(true);
      const query = `page=${page}&sort=inserted_at_desc&page_size=10`;
      const response = (await fetchAPI(
        `contents/${contentId}/versions?${query}`,
      )) as VersionsResponse;

      setApiVersions(response.versions || []);
      setSelectedId(response.versions?.[0]?.id || null);
      setPagination({
        pageNumber: response.page_number,
        totalEntries: response.total_entries,
        totalPages: response.total_pages,
      });
    } catch (err) {
      console.error('Failed to load versions', err);
      toast.error('Failed to load versions');
    } finally {
      setLoading(false);
    }
  };

  const loadDiffData = async (
    previousVersionId: string,
    currentVersionId: string,
  ) => {
    try {
      setDiffLoading(true);
      const res = await fetchAPI(
        `versions/${previousVersionId}/${currentVersionId}`,
      );
      setDiffData(res as DiffResponse);
    } catch (err) {
      console.error('Failed to load diff data', err);
      toast.error('Failed to load version comparison');
    } finally {
      setDiffLoading(false);
    }
  };

  const handleRestore = async (version: UIVersion) => {
    try {
      await toast.promise(
        postAPI(`contents/${contentId}/restore/${version.id}`, {}),
        {
          loading: 'Restoring version...',
          success: `Restored to ${version.name}`,
          error: 'Failed to restore version',
        },
      );
      await loadVersions(currentPage);
    } catch (err) {
      console.error('Restore failed', err);
    }
  };

  const handleRename = async (id: string, newName: string) => {
    try {
      await postAPI(`versions/${id}`, { naration: newName });
      await loadVersions(currentPage);
    } catch (err) {
      toast.error('Failed to rename version');
    }
  };

  useEffect(() => {
    if (isOpen && contentId) {
      loadVersions(currentPage);
    }
  }, [isOpen, contentId, currentPage]);

  useEffect(() => {
    if (!selectedVersion) {
      setDiffData(null);
      return;
    }

    const targetId = selectedVersion.id;
    const baseId =
      selectedVersion.version_number === 1
        ? selectedVersion.id
        : selectedVersion.previousVersionId;

    if (baseId) {
      loadDiffData(baseId, targetId);
    } else {
      setDiffData(null);
    }
  }, [selectedVersion]);

  if (!isOpen) return null;

  return (
    <Modal ariaLabel="Version History" open={isOpen} onClose={onClose}>
      <Flex
        h="100vh"
        w="60vw"
        style={{ maxHeight: '100vh', overflow: 'hidden' }}>
        <Box flex="3" p="lg" bg="surface">
          <Text as="h3" fontSize="lg" fontWeight="bold" mb="md">
            {selectedVersion?.name || 'Version History'}
          </Text>
          <VersionContent
            version={selectedVersion}
            diffData={diffData}
            loading={loading || diffLoading}
          />
        </Box>

        <Box
          flex="1"
          borderLeft="1px solid"
          borderColor="gray.600"
          pl="lg"
          display="flex"
          flexDirection="column"
          h="100%">
          <Flex justify="space-between" align="center" mb="sm">
            <Text fontSize="md" fontWeight="semibold">
              All Versions ({pagination.totalEntries})
            </Text>
            <Button variant="ghost" onClick={onClose}>
              ×
            </Button>
          </Flex>

          <Box flex="1" minHeight="0" overflow="hidden">
            {loading ? (
              <Box p="md" textAlign="center">
                <Spinner />
              </Box>
            ) : (
              <Box maxHeight="100%" overflowY="auto">
                {versions.map((version) => (
                  <VersionItem
                    key={version.id}
                    version={version}
                    isSelected={selectedId === version.id}
                    onSelect={() => setSelectedId(version.id)}
                    onRestore={() => handleRestore(version)}
                    onRename={(name) => handleRename(version.id, name)}
                  />
                ))}
              </Box>
            )}
          </Box>

          {pagination.totalPages > 1 && (
            <Box mt="md" p="xs" borderTop="1px solid" borderColor="gray.600">
              <Pagination
                totalPage={pagination.totalPages}
                initialPage={currentPage}
                onPageChange={setCurrentPage}
                totalEntries={pagination.totalEntries}
              />
            </Box>
          )}
        </Box>
      </Flex>
    </Modal>
  );
};
