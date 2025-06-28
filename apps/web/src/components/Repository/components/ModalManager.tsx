import React from 'react';
import { Modal, Drawer, Box, Button } from '@wraft/ui';

import ConfirmDelete from 'common/ConfirmDelete';
import { FileDropZone } from 'common/FileDropZone';

import { StorageItemDetails } from '../types';
import { NewFolderModal } from './NewFolderModal';
import { RenameModal } from './RenameModal';
import { StorageItemDetails as StorageItemDetailsComponent } from './StorageItemDetails';
import { RepositorySetup } from './RepositorySetup';

interface ModalManagerProps {
  // Modal states
  isNewFolderModalOpen: boolean;
  isUploadModalOpen: boolean;
  isDeleteModalOpen: boolean;
  isRenameModalOpen: boolean;
  isItemDetailsOpen: boolean;
  isRepositorySetupModalOpen: boolean;

  // Selected items
  selectedItemDetails: StorageItemDetails | null;
  currentFolder: any;

  // Handlers
  onNewFolderSubmit: (data: { name: string }) => Promise<void>;
  onUploadSubmit: (
    fileList: File[],
    options: { migrateToWraft: boolean },
  ) => Promise<void>;
  onRenameSubmit: (newName: string) => Promise<void>;
  onDeleteConfirm: () => Promise<void>;
  onUploadModalClose: () => void;
  onSetupRepository: (data: {
    name: string;
    description?: string;
  }) => Promise<void>;
  onCloseRepositorySetup: () => void;
  onCloseNewFolderModal: () => void;
  onCloseDeleteModal: () => void;
  onCloseRenameModal: () => void;
  onCloseItemDetails: () => void;

  // Loading states
  isLoading?: boolean;
}

export const ModalManager: React.FC<ModalManagerProps> = ({
  isNewFolderModalOpen,
  isUploadModalOpen,
  isDeleteModalOpen,
  isRenameModalOpen,
  isItemDetailsOpen,
  isRepositorySetupModalOpen,
  selectedItemDetails,
  onNewFolderSubmit,
  onUploadSubmit,
  onRenameSubmit,
  onDeleteConfirm,
  onUploadModalClose,
  onSetupRepository,
  onCloseRepositorySetup,
  onCloseNewFolderModal,
  onCloseDeleteModal,
  onCloseRenameModal,
  onCloseItemDetails,
  isLoading = false,
}) => {
  return (
    <>
      <NewFolderModal
        isOpen={isNewFolderModalOpen}
        onClose={onCloseNewFolderModal}
        onSubmit={onNewFolderSubmit}
      />

      {isDeleteModalOpen && selectedItemDetails && (
        <Modal
          ariaLabel="Delete Item"
          open={isDeleteModalOpen}
          onClose={onCloseDeleteModal}>
          <ConfirmDelete
            title="Delete Item"
            text={`Are you sure you want to delete '${selectedItemDetails.name}'?`}
            setOpen={onCloseDeleteModal}
            onConfirmDelete={onDeleteConfirm}
          />
        </Modal>
      )}

      <RenameModal
        isOpen={isRenameModalOpen}
        onClose={onCloseRenameModal}
        onConfirm={onRenameSubmit}
        currentName={selectedItemDetails?.name || ''}
        itemType={
          selectedItemDetails?.item_type === 'folder' ? 'folder' : 'file'
        }
      />

      {/* Upload Drawer */}
      <Drawer
        open={isUploadModalOpen}
        placement="right"
        withBackdrop={true}
        hideOnInteractOutside={true}>
        <Drawer.Header>
          <Drawer.Title>Upload Files</Drawer.Title>
          <Button
            variant="ghost"
            onClick={onUploadModalClose}
            style={{ padding: '8px' }}>
            ✕
          </Button>
        </Drawer.Header>
        <Box p="4" w="100%" maxW="500px">
          <FileDropZone
            showOpen={isUploadModalOpen}
            onDrop={onUploadSubmit}
            onClose={onUploadModalClose}
            isLoading={isLoading}
            accept={{
              'application/pdf': ['.pdf'],
              'application/vnd.openxmlformats-officedocument.wordprocessingml.document':
                ['.docx'],
              'application/msword': ['.doc'],
              'application/vnd.oasis.opendocument.text': ['.odt'],
              'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet':
                ['.xlsx'],
              'application/vnd.ms-excel': ['.xls'],
              'application/vnd.oasis.opendocument.spreadsheet': ['.ods'],
              'application/vnd.openxmlformats-officedocument.presentationml.presentation':
                ['.pptx'],
              'application/vnd.ms-powerpoint': ['.ppt'],
              'application/vnd.oasis.opendocument.presentation': ['.odp'],
              'text/plain': ['.txt'],
              'text/rtf': ['.rtf'],
            }}
            maxSize={10 * 1024 * 1024} // 10MB
            maxFiles={10}
            multiple={true}
            onExtract={(_fileList) => {
              // Extract functionality
            }}
            onSkip={(_fileList) => {
              // Skip functionality
            }}
            onCheckMark={() => {
              // This will be handled by the parent
              return false;
            }}
          />
        </Box>
      </Drawer>

      {/* Item Details Drawer */}
      <Drawer
        open={isItemDetailsOpen}
        placement="right"
        withBackdrop={true}
        hideOnInteractOutside={true}>
        <Drawer.Header>
          <Drawer.Title>
            {selectedItemDetails?.name || 'Item Details'}
          </Drawer.Title>
        </Drawer.Header>
        <Box p="4">
          <StorageItemDetailsComponent
            item={selectedItemDetails}
            isLoading={false}
            error={null}
            onBack={onCloseItemDetails}
          />
        </Box>
      </Drawer>

      {/* Repository Setup Modal */}
      <Modal
        ariaLabel="Setup Repository"
        open={isRepositorySetupModalOpen}
        onClose={onCloseRepositorySetup}>
        <RepositorySetup
          onSetup={onSetupRepository}
          onUpload={onUploadModalClose}
          isLoading={isLoading}
        />
      </Modal>
    </>
  );
};
