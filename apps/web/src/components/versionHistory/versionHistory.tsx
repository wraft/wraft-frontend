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
} from '@wraft/ui';

import { IconFrame } from 'common/Atoms';
import { fetchAPI, postAPI } from 'utils/models';

import { DiffViewer } from './diffViewer';

interface Author {
  email: string;
  name: string;
}

interface APIVersion {
  id: string;
  inserted_at: string;
  naration: string | null;
  raw: string;
  version_number: number;
  author: Author;
  current_version?: boolean;
}

interface UIVersion extends APIVersion {
  name: string;
  isCurrentVersion: boolean;
  hasChanges: boolean;
  previousVersionRaw?: string;
}

interface VersionHistoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  contentId: string;
}

interface ContentResponse {
  versions: APIVersion[];
}

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
        previousVersionRaw: prev?.raw,
      };
    })
    .reverse(); // newest first
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

  const formatDateTime = (timestamp: string): string => {
    try {
      const date = new Date(timestamp);
      return `${format(date, 'MMMM d')}, ${format(date, 'h:mm a')}`;
    } catch {
      return 'Invalid date';
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
              onKeyDown={(e) => {
                if (e.key === 'Enter') handleRename();
                if (e.key === 'Escape') {
                  setNewName(version.name);
                  setIsRenaming(false);
                }
              }}
              fontSize="sm"
              fontWeight="500"
              size="sm"
            />
          ) : (
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
          )}
          <Text fontSize="xs" color="text-secondary">
            {formatDateTime(version.inserted_at)}
            {version.author && ` • ${version.author.name}`}
          </Text>
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

const VersionList: React.FC<{
  versions: UIVersion[];
  selectedId: string | null;
  loading: boolean;
  onSelect: (version: UIVersion) => void;
  onRestore: (version: UIVersion) => void;
  onRename: (id: string, newName: string) => void;
}> = ({ versions, selectedId, loading, onSelect, onRestore, onRename }) => {
  if (loading) {
    return (
      <Box p="md" textAlign="center">
        <Spinner />
      </Box>
    );
  }

  return (
    <Box maxHeight="100%" overflowY="auto">
      {versions.map((v) => (
        <VersionItem
          key={v.id}
          version={v}
          isSelected={selectedId === v.id}
          onSelect={() => onSelect(v)}
          onRestore={() => onRestore(v)}
          onRename={(name) => onRename(v.id, name)}
        />
      ))}
    </Box>
  );
};

export const VersionHistoryModal: React.FC<VersionHistoryModalProps> = ({
  isOpen,
  onClose,
  contentId,
}) => {
  const [apiVersions, setApiVersions] = useState<APIVersion[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const versions = useMemo(() => transformVersions(apiVersions), [apiVersions]);
  const selectedVersion =
    versions.find((v) => v.id === selectedId) || versions[0] || null;

  useEffect(() => {
    if (isOpen && contentId) loadVersions();
  }, [isOpen, contentId]);

  const loadVersions = async (versionType: string = 'save') => {
    try {
      setLoading(true);
      const res = (await fetchAPI(
        `contents/${contentId}?version_type=${versionType}`,
      )) as ContentResponse;
      setApiVersions(res?.versions || []);
      setSelectedId(res?.versions?.[0]?.id || null);
    } catch (err) {
      console.error('Failed to load versions', err);
    } finally {
      setLoading(false);
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
      await loadVersions();
    } catch (err) {
      console.error('Restore failed', err);
    }
  };

  const handleRename = async (id: string, newName: string) => {
    try {
      await postAPI(`versions/${id}`, {
        naration: newName,
      });
      setApiVersions((prev) =>
        prev.map((v) => (v.id === id ? { ...v, naration: newName } : v)),
      );
    } catch (err) {
      toast.error('Failed to rename version');
    }
  };

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
          {loading ? (
            <Spinner />
          ) : selectedVersion ? (
            <DiffViewer version={selectedVersion} />
          ) : (
            <Text color="text-secondary">No versions available</Text>
          )}
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
              All Versions ({versions.length})
            </Text>
            <Button variant="ghost" onClick={onClose}>
              ×
            </Button>
          </Flex>

          <Box flex="1" minHeight="0" overflow="hidden">
            <VersionList
              versions={versions}
              selectedId={selectedVersion?.id || null}
              loading={loading}
              onSelect={(v) => setSelectedId(v.id)}
              onRestore={handleRestore}
              onRename={handleRename}
            />
          </Box>
        </Box>
      </Flex>
    </Modal>
  );
};
