import React, { useState, useMemo } from 'react';
import { Box, Button, Text, Flex, Drawer, Checkbox } from '@wraft/ui';
import {
  ArrowSquareOut,
  ArrowsClockwise,
  FolderIcon,
  ImageIcon,
  FileTextIcon,
  FileIcon,
  ArrowLeftIcon,
  CheckSquare,
  Square,
  ArrowSquareInIcon,
} from '@phosphor-icons/react';
import toast from 'react-hot-toast';
import { HomeIcon } from '@wraft/icon';

import { IconFrame } from 'common/Atoms';

import { useGoogleDriveRepository } from '../hooks/useGoogleDriveRepository';
import { StorageItem } from '../types';
import { DriveFile } from './GoogleDrive/googleDriveClient';

interface GoogleDriveDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export const GoogleDriveDrawer: React.FC<GoogleDriveDrawerProps> = ({
  isOpen,
  onClose,
}) => {
  const {
    files,
    isLoading,
    error,
    hasConnection,
    currentFolder,
    currentFolderName,
    folderStack,
    fetchFiles,
    syncFileToRepository,
    syncMultipleFiles,
    navigateToFolder,
    navigateBack,
    refreshConnection,
  } = useGoogleDriveRepository();

  const [syncingFiles, setSyncingFiles] = useState<Set<string>>(new Set());
  const [selectedFiles, setSelectedFiles] = useState<Set<string>>(new Set());
  const [isImporting, setIsImporting] = useState(false);

  // Memoized values for selection state
  const selectableFiles = useMemo(
    () => files.filter((file) => !file.is_folder),
    [files],
  );

  const allSelectableSelected = useMemo(
    () =>
      selectableFiles.length > 0 &&
      selectableFiles.every((file) => selectedFiles.has(file.id)),
    [selectableFiles, selectedFiles],
  );

  const someSelected = useMemo(() => selectedFiles.size > 0, [selectedFiles]);

  // Selection handlers
  const handleSelectFile = (fileId: string, selected: boolean) => {
    setSelectedFiles((prev) => {
      const newSet = new Set(prev);
      if (selected) {
        newSet.add(fileId);
      } else {
        newSet.delete(fileId);
      }
      return newSet;
    });
  };

  const handleSelectAll = () => {
    if (allSelectableSelected) {
      setSelectedFiles(new Set());
    } else {
      setSelectedFiles(new Set(selectableFiles.map((file) => file.id)));
    }
  };

  // Bulk import handler
  const handleBulkImport = async () => {
    if (selectedFiles.size === 0) {
      toast.error('No files selected for import');
      return;
    }

    setIsImporting(true);
    const selectedFilesList = files.filter((file) =>
      selectedFiles.has(file.id),
    );

    try {
      toast.loading(`Importing ${selectedFiles.size} files...`);

      // Convert to DriveFile format
      const driveFiles: DriveFile[] = selectedFilesList.map((file) => ({
        id: file.id,
        name: file.name,
        mimeType: file.mime_type || 'application/octet-stream',
        createdTime: file.inserted_at,
        modifiedTime: file.updated_at,
        size: file.file_size?.toString(),
      }));

      console.log('driveFiles', driveFiles);

      // Use the bulk sync method
      const result = await syncMultipleFiles(driveFiles);
      console.log('result', result);

      toast.dismiss();

      if (result.success > 0 && result.failed === 0) {
        toast.success(`Successfully imported ${result.success} files!`);
      } else if (result.success > 0 && result.failed > 0) {
        toast.success(
          `Imported ${result.success} files. ${result.failed} failed.`,
        );
      } else {
        toast.error(`Failed to import ${result.failed} files.`);
      }

      // Clear selection after import
      setSelectedFiles(new Set());
    } finally {
      setIsImporting(false);
    }
  };

  const handleSync = async (file: StorageItem) => {
    if (file.is_folder) {
      toast.error('Cannot sync folders');
      return;
    }

    setSyncingFiles((prev) => new Set(prev).add(file.id));

    try {
      const driveFile: DriveFile = {
        id: file.id,
        name: file.name,
        mimeType: file.mime_type || 'application/octet-stream',
        createdTime: file.inserted_at,
        modifiedTime: file.updated_at,
        webViewLink: file.metadata?.web_view_link,
        webContentLink: file.metadata?.web_content_link,
        thumbnailLink: file.metadata?.thumbnail_link,
        owners: file.metadata?.owners,
        parents: file.metadata?.parents,
        size: file.file_size?.toString(),
      };

      const success = await syncFileToRepository(driveFile);
      if (success) {
        // Optionally refresh the repository to show the new file
        // This would require a callback from the parent component
      }
    } finally {
      setSyncingFiles((prev) => {
        const newSet = new Set(prev);
        newSet.delete(file.id);
        return newSet;
      });
    }
  };

  const handleFolderClick = (file: StorageItem) => {
    if (file.is_folder) {
      console.log('Navigating to folder:', file.name, file.id);
      // Clear selection when navigating to a new folder
      setSelectedFiles(new Set());
      navigateToFolder(file.id, file.name);
    }
  };

  const getFileIcon = (file: StorageItem) => {
    if (file.is_folder) {
      return (
        <IconFrame color="green.900">
          <FolderIcon size={22} />
        </IconFrame>
      );
    }

    const mimeType = file.mime_type || '';

    if (mimeType.startsWith('image/')) {
      return (
        <IconFrame color="green.900">
          <ImageIcon size={22} />
        </IconFrame>
      );
    }

    if (mimeType.includes('document') || mimeType.includes('text')) {
      return (
        <IconFrame color="green.900">
          <FileTextIcon size={22} />
        </IconFrame>
      );
    }

    return (
      <IconFrame color="green.900">
        <FileIcon size={22} />
      </IconFrame>
    );
  };

  const formatFileSize = (bytes?: number) => {
    if (!bytes) return 'Unknown size';

    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(1024));
    return `${Math.round((bytes / Math.pow(1024, i)) * 100) / 100} ${sizes[i]}`;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  if (!hasConnection) {
    return (
      <Drawer
        open={isOpen}
        placement="right"
        withBackdrop={true}
        hideOnInteractOutside={true}>
        <Drawer.Header>
          <Drawer.Title>Google Drive Files</Drawer.Title>
          <Button variant="ghost" onClick={onClose} style={{ padding: '8px' }}>
            ✕
          </Button>
        </Drawer.Header>

        <Box p="4" w="100%" maxW="600px">
          <Box
            p="4"
            style={{
              border: '1px solid #f59e0b',
              borderRadius: '8px',
              backgroundColor: '#fef3c7',
            }}>
            <Text fontWeight="bold" style={{ color: '#92400e' }}>
              No Google Drive Connection
            </Text>
            <Text fontSize="sm" mt="2" style={{ color: '#a16207' }}>
              Please connect your Google Drive account in the Integrations
              section first.
            </Text>
          </Box>
        </Box>
      </Drawer>
    );
  }

  return (
    <Drawer
      open={isOpen}
      placement="right"
      withBackdrop={true}
      hideOnInteractOutside={true}>
      <Drawer.Header>
        <Flex align="center" justify="space-between" w="100%">
          <Flex align="center" gap="sm">
            {currentFolder && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  setSelectedFiles(new Set());
                  navigateBack();
                }}
                title={
                  folderStack.length > 0
                    ? `Back to ${folderStack[folderStack.length - 1]?.name}`
                    : 'Back to root'
                }>
                <ArrowLeftIcon size={16} />
              </Button>
            )}
            <Flex direction="column" align="start">
              <Drawer.Title>Google Drive Files</Drawer.Title>
              {currentFolder && (
                <Flex align="center" gap="xs" mt="1" justify="center">
                  <Text fontSize="xs" style={{ color: '#6b7280' }}>
                    <HomeIcon width={10} height={10} />
                  </Text>
                  {folderStack.map((folder) => (
                    <React.Fragment key={folder.id}>
                      <Text fontSize="xs" style={{ color: '#6b7280' }}>
                        /
                      </Text>
                      <Text fontSize="xs" style={{ color: '#6b7280' }}>
                        {folder.name}
                      </Text>
                    </React.Fragment>
                  ))}
                  {currentFolderName && (
                    <>
                      <Text fontSize="xs" style={{ color: '#6b7280' }}>
                        /
                      </Text>
                      <Text
                        fontSize="xs"
                        fontWeight="medium"
                        style={{ color: '#374151' }}>
                        {currentFolderName}
                      </Text>
                    </>
                  )}
                </Flex>
              )}
            </Flex>
          </Flex>

          <Flex align="center" gap="xs">
            {selectableFiles.length > 0 && (
              <>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleSelectAll}
                  title={
                    allSelectableSelected ? 'Deselect all' : 'Select all files'
                  }
                  disabled={isLoading}>
                  {allSelectableSelected ? (
                    <Square size={16} />
                  ) : (
                    <CheckSquare size={16} />
                  )}
                  <Text as="span" ml="1" fontSize="xs">
                    {allSelectableSelected ? 'None' : 'All'}
                  </Text>
                </Button>
                {someSelected && (
                  <Button
                    variant="primary"
                    size="sm"
                    onClick={handleBulkImport}
                    disabled={isImporting || isLoading}
                    title={`Import ${selectedFiles.size} selected files`}>
                    <ArrowSquareInIcon size={16} />
                    <Text as="span" ml="1" fontSize="xs">
                      Import ({selectedFiles.size})
                    </Text>
                  </Button>
                )}
              </>
            )}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => fetchFiles(currentFolder || undefined)}
              disabled={isLoading}
              title="Refresh files">
              <ArrowsClockwise size={16} />
            </Button>
            <Button
              variant="ghost"
              onClick={onClose}
              style={{ padding: '8px' }}>
              ✕
            </Button>
          </Flex>
        </Flex>
      </Drawer.Header>

      <Box
        p="4"
        w="100%"
        maxW="600px"
        h="calc(100vh - 80px)"
        style={{ overflowY: 'auto' }}>
        {error && (
          <Box
            p="4"
            mb="4"
            style={{
              border: '1px solid #ef4444',
              borderRadius: '8px',
              backgroundColor: '#fef2f2',
            }}>
            <Text style={{ color: '#991b1b' }}>{error}</Text>
          </Box>
        )}

        {isImporting && (
          <Box
            p="4"
            mb="4"
            style={{
              border: '1px solid #3b82f6',
              borderRadius: '8px',
              backgroundColor: '#eff6ff',
            }}>
            <Flex align="center" gap="2">
              <ArrowsClockwise
                size={16}
                style={{
                  color: '#3b82f6',
                  animation: 'spin 1s linear infinite',
                }}
              />
              <Text style={{ color: '#1e40af' }}>
                Importing {selectedFiles.size} files to repository...
              </Text>
            </Flex>
          </Box>
        )}

        {isLoading && files.length === 0 ? (
          <Flex justify="center" align="center" h="200px">
            <Flex direction="column" align="center" gap="4">
              <Text style={{ color: '#6b7280' }}>
                Loading Google Drive files...
              </Text>
            </Flex>
          </Flex>
        ) : files.length === 0 ? (
          <Flex justify="center" align="center" h="200px">
            <Text style={{ color: '#6b7280' }}>
              No files found in Google Drive
            </Text>
          </Flex>
        ) : (
          <Flex direction="column" px="md">
            {files.map((file) => (
              <Box
                key={file.id}
                p="md"
                borderBottom="1px solid"
                borderColor="border"
                transition="all 0.2s"
                cursor={file.is_folder ? 'pointer' : 'default'}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = '#d1d5db';
                  e.currentTarget.style.backgroundColor = '#f9fafb';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = '#e5e7eb';
                  e.currentTarget.style.backgroundColor = 'transparent';
                }}>
                <Flex justify="space-between" align="start">
                  <Flex align="center" gap="md" flex="1" minWidth="0">
                    {!file.is_folder && (
                      <Checkbox
                        checked={selectedFiles.has(file.id)}
                        onChange={(e) =>
                          handleSelectFile(file.id, e.target.checked)
                        }
                        disabled={isImporting}
                      />
                    )}
                    <Box flexShrink={0}>{getFileIcon(file)}</Box>

                    <Flex direction="column" flex="1" minWidth="0">
                      <Text
                        fontWeight="heading"
                        lines={1}
                        onClick={() => handleFolderClick(file)}
                        onMouseEnter={
                          file.is_folder
                            ? (e) => {
                                e.currentTarget.style.textDecoration =
                                  'underline';
                              }
                            : undefined
                        }
                        onMouseLeave={
                          file.is_folder
                            ? (e) => {
                                e.currentTarget.style.textDecoration = 'none';
                              }
                            : undefined
                        }>
                        {file.name}
                      </Text>

                      <Flex align="center" gap="xs" color="text-secondary">
                        <Text fontSize="xs" color="text-secondary">
                          {formatDate(file.modified)}
                        </Text>
                        {!file.is_folder && file.file_size && (
                          <>
                            <Text color="text-secondary">•</Text>
                            <Text fontSize="xs" color="text-secondary">
                              {formatFileSize(file.file_size)}
                            </Text>
                          </>
                        )}
                        {file.mime_type && (
                          <>
                            <Text color="text-secondary">•</Text>
                            <Text fontSize="xs" color="text-secondary">
                              {file.mime_type.split('/')[1]?.toUpperCase() ||
                                'FILE'}
                            </Text>
                          </>
                        )}
                      </Flex>
                    </Flex>
                  </Flex>

                  <Flex align="center" gap="2" style={{ flexShrink: '0' }}>
                    {file.metadata?.web_view_link && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() =>
                          window.open(file.metadata.web_view_link, '_blank')
                        }
                        title="Open in Google Drive">
                        <ArrowSquareOut size={16} />
                      </Button>
                    )}

                    {!file.is_folder && (
                      <Button
                        variant="secondary"
                        size="sm"
                        onClick={() => handleSync(file)}
                        disabled={syncingFiles.has(file.id)}
                        title="Sync to Repository">
                        <ArrowSquareInIcon size={16} />
                        {syncingFiles.has(file.id) && (
                          <Text as="span" ml="1" fontSize="xs">
                            Syncing...
                          </Text>
                        )}
                      </Button>
                    )}
                  </Flex>
                </Flex>
              </Box>
            ))}

            {isLoading && files.length > 0 && (
              <Flex justify="center" p="4">
                <Text fontSize="sm" style={{ color: '#6b7280' }}>
                  Loading more...
                </Text>
              </Flex>
            )}
          </Flex>
        )}
      </Box>
    </Drawer>
  );
};
