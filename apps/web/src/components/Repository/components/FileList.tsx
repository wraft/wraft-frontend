import React from 'react';

import { StorageItem } from '../types';
import { RepositoryTable } from './FileExplorerTable';
import { EmptyRepository } from './EmptyRepository';

interface FileListProps {
  items: StorageItem[];
  onItemClick: (item: StorageItem) => void;
  onDelete: (item: StorageItem) => void;
  onRename: (item: StorageItem) => void;
  onNewFolder: () => void;
  onUpload: () => void;
}

export const FileList: React.FC<FileListProps> = ({
  items,
  onItemClick,
  onDelete,
  onRename,
  onNewFolder,
  onUpload,
}) => {
  if (!items.length) {
    return <EmptyRepository onNewFolder={onNewFolder} onUpload={onUpload} />;
  }

  return (
    <RepositoryTable
      items={items}
      onItemClick={onItemClick}
      onDelete={onDelete}
      onRename={onRename}
      onNewFolder={onNewFolder}
    />
  );
};
