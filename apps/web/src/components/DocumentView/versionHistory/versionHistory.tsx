import React, { useState, useEffect, useMemo } from 'react';
import { format } from 'date-fns';
import toast from 'react-hot-toast';
import { DotsThreeVerticalIcon, XIcon } from '@phosphor-icons/react';
import {
  Modal,
  Flex,
  Box,
  Text,
  DropdownMenu,
  InputText,
  Spinner,
  Pagination,
} from '@wraft/ui';

import { IconFrame } from 'common/Atoms';
import { fetchAPI, postAPI } from 'utils/models';

import { DiffViewer } from './diffViewer';
import {
  APIVersion,
  UIVersion,
  formatDateTime,
  transformVersions,
} from './utils';
interface VersionsResponse {
  page_number: number;
  total_entries: number;
  total_pages: number;
  versions: APIVersion[];
}

interface VersionHistoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  contentId: string;
}

type DiffResponse = Parameters<typeof DiffViewer>[0]['diffData'];

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
      py="sm"
      px="md"
      cursor="pointer"
      bg={isSelected ? 'green.200' : 'transparent'}
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
              <Flex justify="space-between" align="center">
                <Text
                  color={isSelected ? 'primary.800' : 'text-primary'}
                  lines={2}>
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
              <Text fontSize="xs" color="text-secondary" lines={1}>
                {formatDateTime(version.inserted_at)}
                {version.author && ` • ${version.author.name}`}
              </Text>
            </>
          )}
        </Box>

        <DropdownMenu.Provider>
          <DropdownMenu.Trigger>
            <IconFrame size="sm" color="icon">
              <DotsThreeVerticalIcon size={18} />
            </IconFrame>
          </DropdownMenu.Trigger>
          <DropdownMenu>
            <DropdownMenu.Item onClick={() => setIsRenaming(true)}>
              Rename Version
            </DropdownMenu.Item>
            {!version.isCurrentVersion && (
              <DropdownMenu.Item onClick={onRestore}>
                Restore Version
              </DropdownMenu.Item>
            )}
          </DropdownMenu>
        </DropdownMenu.Provider>
      </Flex>
    </Box>
  );
};

const VersionContent: React.FC<{
  version: UIVersion;
  diffData: DiffResponse | null;
  isLoading: boolean;
}> = ({ version, diffData, isLoading }) => {
  if (isLoading)
    return (
      <Flex justify="center" align="center" h="100%">
        <Spinner />
      </Flex>
    );
  if (!version)
    return (
      <Flex align="center" justifyContent="space-around" h="100%">
        <Text color="text-secondary">
          This Document does not have any snapshots yet.
        </Text>
      </Flex>
    );

  if (!diffData) {
    return (
      <Flex align="center" justifyContent="space-around" h="100%">
        <Text color="text-secondary">
          No content available for this version
        </Text>
      </Flex>
    );
  }

  return (
    <>
      <Box px="md" pt="md">
        <Text fontSize="lg" fontWeight="heading" mb="md">
          {version.name} - Created on{' '}
          {format(new Date(version.inserted_at), 'MMMM d, yyyy')}
        </Text>
      </Box>

      <Flex bg="background-secondary" py="md" direction="row" overflow="hidden">
        <Box w="794px" mx="auto">
          <DiffViewer diffData={diffData} />
        </Box>
      </Flex>
    </>
  );
};

export const VersionHistoryModal: React.FC<VersionHistoryModalProps> = ({
  isOpen,
  onClose,
  contentId,
}) => {
  const [apiVersions, setApiVersions] = useState<APIVersion[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [diffData, setDiffData] = useState<DiffResponse | null>(null);
  const [loading, setLoading] = useState({ versions: false, diff: false });
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
      setLoading((prev) => ({ ...prev, versions: true }));
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
    } catch (error) {
      console.error('Failed to load versions:', error);
      toast.error('Failed to load versions');
    } finally {
      setLoading((prev) => ({ ...prev, versions: false }));
    }
  };

  const loadDiffData = async (
    previousVersionId: string,
    currentVersionId: string,
  ) => {
    try {
      setLoading((prev) => ({ ...prev, diff: true }));
      const res = await fetchAPI(
        `versions/${previousVersionId}/${currentVersionId}`,
      );
      setDiffData(res as DiffResponse);
    } catch (error) {
      console.error('Failed to load diff data:', error);
      toast.error('Failed to load version comparison');
    } finally {
      setLoading((prev) => ({ ...prev, diff: false }));
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
    } catch (error) {
      console.error('Restore failed:', error);
    }
  };

  const handleRename = async (id: string, newName: string) => {
    try {
      await postAPI(`versions/${id}`, { naration: newName });
      await loadVersions(currentPage);
    } catch (error) {
      console.error('Failed to rename version:', error);
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
        overflow="hidden"
        position="relative"
        gap="lg"
        m="-xl"
        maxH="100%"
        w="80vw"
        h="90vh">
        <Flex direction="column" w="calc(100% - 340px)">
          <VersionContent
            version={selectedVersion}
            diffData={diffData}
            isLoading={loading.versions || loading.diff}
          />
        </Flex>

        <Box
          borderLeft="1px solid"
          borderColor="border"
          px="lg"
          display="flex"
          flexDirection="column"
          w="340px"
          h="100%">
          <Flex justify="space-between" align="center" py="md">
            <Text fontSize="lg" fontWeight="heading">
              All Versions ({pagination.totalEntries})
            </Text>

            <IconFrame color="icon">
              <XIcon size={16} cursor="pointer" onClick={onClose} />
            </IconFrame>
          </Flex>

          <Box flex="1" minHeight="0" overflow="hidden">
            {loading.versions ? (
              <Flex p="md" textAlign="center">
                <Spinner />
              </Flex>
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
