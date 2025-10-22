import React, { useState, useCallback } from 'react';
import {
  Box,
  Flex,
  Text,
  Button,
  DropdownMenu,
  Checkbox,
  Table,
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
import type { Row } from '@tanstack/react-table';

import { IconFrame } from 'common/Atoms';

import { StorageItem } from '../types';

export const RepositoryTable: React.FC<{
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
  const [editingItem, setEditingItem] = useState<StorageItem | null>(null);
  const [editValue, setEditValue] = useState('');

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

  const handleInlineRename = useCallback(
    async (item: StorageItem) => {
      try {
        // For inline rename, we need to trigger the rename modal
        // First set the item to rename, then open the modal
        onRename(item);
        setEditingItem(null);
        setEditValue('');
      } catch (error) {
        toast.error('Failed to rename item');
      }
    },
    [onRename],
  );

  const columns = [
    {
      id: 'select',
      size: 5,
      header: () => (
        <Checkbox
          checked={selectedItems.size === items.length}
          indeterminate={
            selectedItems.size > 0 && selectedItems.size < items.length
          }
          onChange={(e) => handleSelectAll(e.target.checked)}
        />
      ),
      cell: ({ row }: { row: Row<StorageItem> }) => (
        <Checkbox
          checked={selectedItems.has(row.original.id)}
          onChange={(e) => handleSelectItem(row.original.id, e.target.checked)}
        />
      ),
    },
    {
      id: 'name',
      header: (
        <Text fontSize="sm2" color="text-secondary">
          Name
        </Text>
      ),
      cell: ({ row }: { row: Row<StorageItem> }) => {
        const item = row.original;
        return (
          <Flex alignItems="center" gap="xs">
            {item.is_folder ? (
              <FolderIcon size={16} color="var(--theme-ui-colors-gray-900)" />
            ) : (
              <IconFrame color="gray.900">
                <FileTextIcon size={16} />
              </IconFrame>
            )}
            <Text fontSize="sm">
              {editingItem?.id === item.id ? (
                <input
                  type="text"
                  value={editValue}
                  onChange={(e) => setEditValue(e.target.value)}
                  onBlur={() => handleInlineRename(item)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      handleInlineRename(item);
                    } else if (e.key === 'Escape') {
                      setEditingItem(null);
                      setEditValue('');
                    }
                  }}
                  // autoFocus
                />
              ) : (
                <button
                  type="button"
                  style={{
                    cursor: item.is_folder ? 'pointer' : 'default',
                    background: 'none',
                    border: 'none',
                    padding: 0,
                    font: 'inherit',
                    color: 'inherit',
                    textAlign: 'left',
                    width: '100%',
                  }}
                  onClick={() => handleFileClick(item)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      handleFileClick(item);
                    }
                  }}
                  tabIndex={item.is_folder ? 0 : -1}
                  aria-label={
                    item.is_folder
                      ? `Open folder ${item.display_name || item.name}`
                      : `View file ${item.display_name || item.name}`
                  }>
                  {item.display_name || item.name}
                </button>
              )}
            </Text>
          </Flex>
        );
      },
    },
    {
      id: 'size',
      // header: 'Size',
      header: (
        <Text fontSize="sm2" color="text-secondary">
          Size
        </Text>
      ),

      cell: ({ row }: { row: Row<StorageItem> }) => (
        <Text fontSize="sm">
          {row.original.is_folder
            ? '-'
            : formatFileSize(row.original.size || 0)}
        </Text>
      ),
    },
    {
      id: 'modified',
      header: 'Modified',
      cell: ({ row }: { row: Row<StorageItem> }) => (
        <Text fontSize="sm">
          {new Date(row.original.updated_at).toLocaleDateString()}
        </Text>
      ),
    },
    {
      id: 'actions',
      header: '',
      cell: ({ row }: { row: Row<StorageItem> }) => {
        const item = row.original;
        return (
          <Flex gap="xs" justifyContent="flex-end">
            {!item.is_folder && onDownload && (
              <Button
                variant="ghost"
                size="xs"
                onClick={() => onDownload(item)}>
                <DownloadIcon size={16} />
              </Button>
            )}
            {!item.is_folder && onShare && (
              <Button variant="ghost" size="xs" onClick={() => onShare(item)}>
                <ShareIcon size={16} />
              </Button>
            )}
            <DropdownMenu.Provider>
              <DropdownMenu.Trigger>
                <Button variant="ghost" size="xs">
                  <DotsThreeVerticalIcon size={16} />
                </Button>
              </DropdownMenu.Trigger>
              <DropdownMenu>
                <DropdownMenu.Item onClick={() => onRename(item)}>
                  <PencilSimpleIcon size={16} />
                  <Text>Rename</Text>
                </DropdownMenu.Item>
                <DropdownMenu.Item
                  onClick={() => onDelete(item)}
                  className="text-red-500">
                  <TrashIcon size={16} />
                  <Text>Delete</Text>
                </DropdownMenu.Item>
              </DropdownMenu>
            </DropdownMenu.Provider>
          </Flex>
        );
      },
    },
  ];

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
              p="4"
              bg="gray.100"
              borderRadius="md"
              mb="4"
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

      <Table
        columns={columns}
        data={items}
        isLoading={isLoading}
        skeletonRows={5}
        emptyMessage="No files or folders found"
      />
    </Box>
  );
};

const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(1))} ${sizes[i]}`;
};
