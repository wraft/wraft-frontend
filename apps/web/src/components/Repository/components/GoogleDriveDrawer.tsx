import React, { useState, useMemo } from 'react';
import { Box, Button, Text, Flex, Drawer, Checkbox } from '@wraft/ui';
import {
  FolderIcon,
  ImageIcon,
  FileTextIcon,
  FileIcon,
  ArrowLeftIcon,
  ArrowSquareInIcon,
  SquareIcon,
  CheckSquareIcon,
  ArrowsClockwiseIcon,
  ArrowSquareOutIcon,
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
  currentFolderId: string | null;
  onRepositoryRefresh?: () => void;
}

export const GoogleDriveDrawer: React.FC<GoogleDriveDrawerProps> = ({
  isOpen,
  onClose,
  currentFolderId,
  onRepositoryRefresh: _onRepositoryRefresh,
}) => {
  const {
    files,
    isLoading,
    isLoadingMore,
    error,
    hasConnection,
    currentFolder,
    currentFolderName,
    folderStack,
    hasMoreFiles,
    fetchFiles,
    loadMoreFiles,
    syncFileToRepository,
    syncMultipleFiles,
    navigateToFolder,
    navigateBack,
  } = useGoogleDriveRepository(currentFolderId);

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

  console.log('allSelectableSelected', allSelectableSelected);

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
        // Files have been automatically added to repository store, no need to refresh
        console.log('Files synced successfully:', result.data);
      } else if (result.success > 0 && result.failed > 0) {
        toast.success(
          `Imported ${result.success} files. ${result.failed} failed.`,
        );
        // Successfully imported files have been automatically added to repository store
        console.log('Files synced successfully:', result.data);
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

      const result = await syncFileToRepository(driveFile);
      if (result.success) {
        // File has been automatically added to repository store, no need to refresh
        console.log('File synced successfully:', result.data);
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
          <Button variant="ghost" onClick={onClose}>
            ✕
          </Button>
        </Drawer.Header>

        <Box p="4" w="100%" maxW="600px">
          <Box
            p="md"
            border="1px solid"
            borderColor="yellow.300"
            borderRadius="md"
            bg="yellow.50">
            <Text fontWeight="bold" color="yellow.900">
              No Google Drive Connection
            </Text>
            <Text fontSize="sm" mt="2" color="#a16207">
              Please connect your Google Drive account in the Integrations
              section first.
            </Text>
          </Box>
        </Box>
      </Drawer>
    );
  }

  return (
    <>
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
                    <Text fontSize="xs" color="text-secondary">
                      <HomeIcon width={10} height={10} />
                    </Text>
                    {folderStack.map((folder) => (
                      <React.Fragment key={folder.id}>
                        <Text fontSize="xs" color="text-secondary">
                          /
                        </Text>
                        <Text fontSize="xs" color="text-secondary">
                          {folder.name}
                        </Text>
                      </React.Fragment>
                    ))}
                    {currentFolderName && (
                      <>
                        <Text fontSize="xs" color="text-secondary">
                          /
                        </Text>
                        <Text fontSize="xs" fontWeight="medium" color="#374151">
                          {currentFolderName}
                        </Text>
                      </>
                    )}
                  </Flex>
                )}
              </Flex>
            </Flex>

            <Flex align="center" gap="xs">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => fetchFiles(currentFolder || undefined)}
                disabled={isLoading}
                title="Refresh files">
                <ArrowsClockwiseIcon size={16} />
              </Button>
              <Button variant="ghost" onClick={onClose}>
                ✕
              </Button>
            </Flex>
          </Flex>
        </Drawer.Header>

        <Flex
          align="center"
          justify="space-between"
          mx="xl"
          borderBottom="1px solid"
          borderColor="border">
          {selectableFiles.length > 0 && (
            <>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleSelectAll}
                title={
                  allSelectableSelected ? 'Select all files' : 'Deselect all'
                }
                disabled={isLoading}>
                {allSelectableSelected ? (
                  <CheckSquareIcon size={16} />
                ) : (
                  <SquareIcon size={16} />
                )}
                <Text as="span" ml="sm">
                  {allSelectableSelected ? 'None' : 'All'}
                </Text>
              </Button>
            </>
          )}
          {files.length > 0 && (
            <Text fontSize="xs" color="gray.900">
              Showing {files.length} files
              {hasMoreFiles && ' (more available)'}
            </Text>
          )}
        </Flex>

        <Box p="md" px="xl" w="540px" h="calc(100vh - 80px)" overflowY="auto">
          {error && (
            <Box
              p="md"
              mb="md"
              border="1px solid"
              borderColor="red.300"
              borderRadius="md">
              <Text color="red.500">{error}</Text>
            </Box>
          )}

          {isImporting && (
            <Box
              p="4"
              mb="4"
              border="1px solid"
              borderColor="blue.300"
              borderRadius="md"
              bg="blue.50">
              <Flex align="center" gap="2">
                <ArrowsClockwiseIcon size={16} color="blue.500" />
                <Text color="blue.900">
                  Importing {selectedFiles.size} files to repository...
                </Text>
              </Flex>
            </Box>
          )}

          {/* Pagination Info */}

          {isLoading && files.length === 0 ? (
            <Flex justify="center" align="center" h="200px">
              <Flex direction="column" align="center" gap="4">
                <Text color="gray.900">Loading Google Drive files...</Text>
              </Flex>
            </Flex>
          ) : files.length === 0 && !error ? (
            <Flex justify="center" align="center" h="200px">
              <Text color="gray.900">No files found in Google Drive</Text>
            </Flex>
          ) : (
            <Flex direction="column">
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
                        </Flex>
                      </Flex>
                    </Flex>

                    <Flex align="center" gap="md" flexShrink="0">
                      {file.metadata?.web_view_link && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() =>
                            window.open(file.metadata.web_view_link, '_blank')
                          }
                          title="Open in Google Drive">
                          <ArrowSquareOutIcon size={16} />
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

              {/* Load More Button */}
              {hasMoreFiles && !isLoadingMore && (
                <Flex justify="center" p="4">
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={loadMoreFiles}
                    disabled={isLoading || isImporting}>
                    Load More Files
                  </Button>
                </Flex>
              )}

              {/* Loading More Indicator */}
              {isLoadingMore && (
                <Flex justify="center" p="4">
                  <Flex align="center" gap="2">
                    <ArrowsClockwiseIcon size={16} color="gray.900" />
                    <Text fontSize="sm" color="gray.900">
                      Loading more files...
                    </Text>
                  </Flex>
                </Flex>
              )}
            </Flex>
          )}
        </Box>
        <Flex flexShrink="0" px="xl" py="md" gap="sm">
          <Button variant="secondary" onClick={onClose}>
            Cancel
          </Button>
          {someSelected && (
            <Button
              onClick={handleBulkImport}
              disabled={isImporting || isLoading}
              title={`Import ${selectedFiles.size} selected files`}>
              <ArrowSquareInIcon size={16} />
              Import ({selectedFiles.size})
            </Button>
          )}
        </Flex>
      </Drawer>
    </>
  );
};
