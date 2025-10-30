import React, { useState, useCallback } from 'react';
import {
  Box,
  Flex,
  Text,
  Button,
  DropdownMenu,
  Checkbox,
  Grid,
} from '@wraft/ui';
import {
  FileTextIcon,
  FolderIcon,
  PencilSimpleIcon,
  TrashIcon,
  DownloadIcon,
  ShareIcon,
  DotsThreeVerticalIcon,
} from '@phosphor-icons/react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-hot-toast';

import { StorageItem } from '../types';

export const ListView: React.FC<{
  items: StorageItem[];
  onItemClick: (item: StorageItem) => void;
  onNewFolder: () => void;
  onRename: (item: StorageItem) => void;
  onDelete: (item: StorageItem) => void;
  onDownload?: (item: StorageItem) => void;
  onShare?: (item: StorageItem) => void;
  isLoading?: boolean;
}> = ({
  items,
  onItemClick,
  onRename,
  onDelete,
  onDownload,
  onShare,
  isLoading = false,
}) => {
  const [selectedItems, setSelectedItems] = useState<Set<string>>(new Set());

  const handleFileClick = useCallback(
    (item: StorageItem) => {
      onItemClick(item);
    },
    [onItemClick],
  );

  const handleBulkDownload = useCallback(async () => {
    if (!onDownload) return;

    try {
      const selectedItemsArray = Array.from(selectedItems);
      for (const itemId of selectedItemsArray) {
        const item = items.find((i) => i.id === itemId);
        if (item) {
          await onDownload(item);
        }
      }
      toast.success('Download started');
    } catch (error) {
      toast.error('Failed to download items');
    }
  }, [selectedItems, items, onDownload]);

  const handleBulkDelete = useCallback(async () => {
    try {
      const selectedItemsArray = Array.from(selectedItems);
      for (const itemId of selectedItemsArray) {
        const item = items.find((i) => i.id === itemId);
        if (item) {
          await onDelete(item);
        }
      }
      setSelectedItems(new Set());
      toast.success('Items deleted successfully');
    } catch (error) {
      toast.error('Failed to delete items');
    }
  }, [selectedItems, items, onDelete]);

  const handleSelectAll = useCallback(
    (checked: boolean) => {
      if (checked) {
        setSelectedItems(new Set(items.map((item) => item.id)));
      } else {
        setSelectedItems(new Set());
      }
    },
    [items],
  );

  const handleSelectItem = useCallback(
    (itemId: string, checked: boolean) => {
      const newSelected = new Set(selectedItems);
      if (checked) {
        newSelected.add(itemId);
      } else {
        newSelected.delete(itemId);
      }
      setSelectedItems(newSelected);
    },
    [selectedItems],
  );

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return `${parseFloat((bytes / Math.pow(k, i)).toFixed(1))} ${sizes[i]}`;
  };

  if (isLoading) {
    return (
      <Box>
        {/* Header skeleton */}
        <Flex
          alignItems="center"
          gap="md"
          p="md"
          borderBottom="1px solid"
          borderColor="border"
          bg="gray.50">
          <Box w="20px" h="20px" bg="gray.200" borderRadius="sm" />
          <Box w="80px" h="16px" bg="gray.200" borderRadius="sm" />
        </Flex>

        {/* Grid skeleton */}
        <Box
          display="grid"
          gridTemplateColumns={{
            base: 'repeat(2, 1fr)',
            sm: 'repeat(3, 1fr)',
            md: 'repeat(4, 1fr)',
            lg: 'repeat(5, 1fr)',
            xl: 'repeat(6, 1fr)',
          }}
          gap="md"
          p="md">
          {[...Array(12)].map((_, index) => (
            <Box
              key={index}
              p="md"
              bg="white"
              borderRadius="lg"
              border="1px solid"
              borderColor="border"
              minHeight="180px">
              <Flex direction="column" alignItems="center" gap="md" pt="lg">
                <Box w="48px" h="48px" bg="gray.200" borderRadius="lg" />
                <Box w="80%" h="16px" bg="gray.200" borderRadius="sm" />
                <Box w="60%" h="12px" bg="gray.200" borderRadius="sm" />
                <Box w="50%" h="12px" bg="gray.200" borderRadius="sm" />
              </Flex>
            </Box>
          ))}
        </Box>
      </Box>
    );
  }

  return (
    <Box>
      <AnimatePresence>
        {selectedItems.size > 0 && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.2 }}>
            <Flex
              p="md"
              bg="gray.100"
              borderRadius="md"
              mb="md"
              alignItems="center"
              justifyContent="space-between">
              <Text fontSize="sm">
                {selectedItems.size} item{selectedItems.size !== 1 ? 's' : ''}{' '}
                selected
              </Text>
              <Flex gap="sm">
                {onDownload && (
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={handleBulkDownload}>
                    <DownloadIcon size={16} />
                    <Text>Download</Text>
                  </Button>
                )}
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={handleBulkDelete}>
                  <TrashIcon size={16} />
                  <Text>Delete</Text>
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setSelectedItems(new Set())}>
                  <Text>Clear</Text>
                </Button>
              </Flex>
            </Flex>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Header with select all */}
      <Flex
        alignItems="center"
        gap="md"
        p="md"
        borderBottom="1px solid"
        borderColor="border"
        bg="gray.50">
        <Checkbox
          checked={selectedItems.size === items.length}
          indeterminate={
            selectedItems.size > 0 && selectedItems.size < items.length
          }
          onChange={(e) => handleSelectAll(e.target.checked)}
        />
        <Text fontSize="sm" fontWeight="medium" color="text-secondary">
          Select All
        </Text>
      </Flex>

      {/* Grid layout */}
      <Grid templateColumns="repeat(5, 1fr)" gap="md" p="md">
        {items.map((item) => (
          <Box
            position="relative"
            p="md"
            key={item.id}
            bg="background-primary"
            borderRadius="lg"
            border="1px solid"
            borderColor="border"
            style={{
              transition: 'all 0.2s ease',
              cursor: item.is_folder ? 'pointer' : 'default',
            }}
            onClick={() => handleFileClick(item)}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor =
                'var(--theme-ui-colors-green-700)';
              e.currentTarget.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.1)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor =
                'var(--theme-ui-colors-border)';
              e.currentTarget.style.boxShadow = 'none';
            }}>
            {/* Selection checkbox */}
            <Box position="absolute" top="8px" left="8px" zIndex={2}>
              <Checkbox
                checked={selectedItems.has(item.id)}
                onChange={(e) => {
                  e.stopPropagation();
                  handleSelectItem(item.id, e.target.checked);
                }}
                onClick={(e) => e.stopPropagation()}
              />
            </Box>

            {/* Actions menu */}
            <Box position="absolute" top="8px" right="8px" zIndex={2}>
              <DropdownMenu.Provider>
                <DropdownMenu.Trigger>
                  <Button
                    variant="ghost"
                    size="xs"
                    onClick={(e) => e.stopPropagation()}>
                    <DotsThreeVerticalIcon size={16} />
                  </Button>
                </DropdownMenu.Trigger>
                <DropdownMenu>
                  <DropdownMenu.Item onClick={() => onRename(item)}>
                    <PencilSimpleIcon size={16} />
                    <Text>Rename</Text>
                  </DropdownMenu.Item>
                  {!item.is_folder && onDownload && (
                    <DropdownMenu.Item onClick={() => onDownload(item)}>
                      <DownloadIcon size={16} />
                      <Text>Download</Text>
                    </DropdownMenu.Item>
                  )}
                  {!item.is_folder && onShare && (
                    <DropdownMenu.Item onClick={() => onShare(item)}>
                      <ShareIcon size={16} />
                      <Text>Share</Text>
                    </DropdownMenu.Item>
                  )}
                  <DropdownMenu.Item
                    onClick={() => onDelete(item)}
                    className="text-red-500">
                    <TrashIcon size={16} />
                    <Text>Delete</Text>
                  </DropdownMenu.Item>
                </DropdownMenu>
              </DropdownMenu.Provider>
            </Box>

            {/* File/Folder content */}
            <Flex direction="column" alignItems="center" gap="md" pt="lg">
              {/* Icon */}
              <Box>
                {item.is_folder ? (
                  <FolderIcon
                    size={48}
                    color="var(--theme-ui-colors-primary-500)"
                  />
                ) : (
                  <Box
                    p="md"
                    bg="gray.100"
                    borderRadius="lg"
                    display="flex"
                    alignItems="center"
                    justifyContent="center">
                    <FileTextIcon
                      size={32}
                      color="var(--theme-ui-colors-gray-600)"
                    />
                  </Box>
                )}
              </Box>

              {/* File name */}
              <Text
                fontSize="sm"
                fontWeight="medium"
                color="text-primary"
                textAlign="center"
                style={{
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  display: '-webkit-box',
                  WebkitLineClamp: 2,
                  WebkitBoxOrient: 'vertical',
                  lineHeight: '1.2',
                  maxHeight: '2.4em',
                }}
                title={item.display_name || item.name}>
                {item.display_name || item.name}
              </Text>

              {/* File info */}
              <Flex direction="column" alignItems="center" gap="xs">
                {!item.is_folder && (
                  <Text fontSize="xs" color="text-secondary">
                    {formatFileSize(item.size || 0)}
                  </Text>
                )}
                <Text fontSize="xs" color="text-secondary">
                  {new Date(item.updated_at).toLocaleDateString()}
                </Text>
              </Flex>
            </Flex>
          </Box>
        ))}
      </Grid>

      {items.length === 0 && !isLoading && (
        <Flex
          justify="center"
          align="center"
          h="200px"
          direction="column"
          gap="md">
          <Text color="text-secondary" fontSize="lg">
            No files or folders found
          </Text>
        </Flex>
      )}
    </Box>
  );
};
