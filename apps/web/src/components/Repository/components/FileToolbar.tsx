import React from 'react';
import { Flex, Button } from '@wraft/ui';
import { FolderSimplePlus, UploadSimple } from '@phosphor-icons/react';

import { BreadcrumbItem } from '../types';
import Breadcrumbs from './Breadcrumbs';

interface FileToolbarProps {
  breadcrumbs: BreadcrumbItem[];
  onBreadcrumbClick: (crumbFolderId: string) => void;
  onNewFolder: () => void;
  onUpload: () => void;
  isLoading?: boolean;
}

export const FileToolbar: React.FC<FileToolbarProps> = ({
  breadcrumbs,
  onBreadcrumbClick,
  onNewFolder,
  onUpload,
  isLoading = false,
}) => {
  return (
    <Flex justify="space-between" align="center" mb="4">
      <Breadcrumbs items={breadcrumbs} onNavigate={onBreadcrumbClick} />
      <Flex gap="sm" alignItems="center">
        <Button
          variant="ghost"
          size="sm"
          onClick={onNewFolder}
          disabled={isLoading}>
          <FolderSimplePlus weight="regular" size={16} />
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={onUpload}
          disabled={isLoading}>
          <UploadSimple weight="regular" size={16} />
        </Button>
      </Flex>
    </Flex>
  );
};
