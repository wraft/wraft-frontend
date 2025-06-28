/**
 * Unified Types for Repository Components
 * This file contains all types used across the Repository feature
 */

// ============================================================================
// CORE STORAGE TYPES
// ============================================================================

export interface StorageItem {
  id: string;
  name: string;
  display_name: string | null;
  type: 'file' | 'folder';
  size?: number;
  modified: string;
  path: string;
  mime_type?: string;
  file_extension?: string;
  is_folder: boolean;
  item_type: 'file' | 'folder';
  clickableArea?: 'name' | 'row';
  status: string;
  version: number;
  filename: {
    file_name: string;
    updated_at: string;
  };
  description: string | null;
  title: string;
  metadata: Record<string, any>;
  url: string;
  file_size: number;
  processed: boolean;
  version_name: string | null;
  storage_key: string | null;
  content_extracted: boolean;
  thumbnail_generated: boolean;
  download_count: number;
  last_accessed_at: string | null;
  inserted_at: string;
  updated_at: string;
  assets?: Array<{ url: string }>;
  repository_id?: string;
  parent_id?: string;
}

export interface StorageItemDetails {
  id: string;
  name: string;
  display_name: string | null;
  item_type: 'file' | 'folder';
  is_folder: boolean;
  size: number;
  mime_type?: string;
  file_extension?: string;
  path: string;
  materialized_path: string;
  parent_id: string | null;
  repository_id: string;
  organisation_id: string;
  creator_id: string;
  version_number: number;
  is_current_version: boolean;
  content_extracted: boolean;
  thumbnail_generated: boolean;
  download_count: number;
  last_accessed_at: string | null;
  inserted_at: string;
  updated_at: string;
  metadata: Record<string, any>;
  classification_level: string;
  depth_level: number;
  assets: Array<{ url: string }>;
}

// ============================================================================
// NAVIGATION TYPES
// ============================================================================

export interface BreadcrumbItem {
  id: string;
  name: string;
  path: string;
  materialized_path: string;
  is_folder: boolean;
}

export interface CurrentFolder {
  id: string;
  name: string;
  path: string;
  materialized_path: string;
  is_folder: boolean;
}

// ============================================================================
// REPOSITORY SETUP TYPES
// ============================================================================

export interface RepositoryData {
  id: string;
  name: string;
  status: string;
  description: string;
  inserted_at: string;
  updated_at: string;
  organisation_id: string;
  creator_id: string;
  storage_limit: number;
  current_storage_used: number;
  item_count: number;
}

export interface SetupRepositoryData {
  name?: string;
  description?: string;
}

export interface RepositorySetupStatus {
  isSetup: boolean;
  isLoading: boolean;
  error: string | null;
  repositories?: RepositoryData[];
}

// ============================================================================
// API RESPONSE TYPES
// ============================================================================

export interface ApiResponse {
  data: StorageItem[];
  meta: {
    count: number;
    timestamp: string;
    sort_by: string;
    sort_order: string;
    breadcrumbs_count: number;
  };
  breadcrumbs: BreadcrumbItem[];
  current_folder?: CurrentFolder;
}

export interface CleanedContentResponse {
  message: string;
  status: string;
  cleaned_content: string;
}

// ============================================================================
// LEGACY TYPES (for backward compatibility)
// ============================================================================

export interface Folder {
  id: string;
  name: string;
  materialized_path: string;
  depth_level: number;
  folder_order: number;
  is_deleted: boolean;
  deleted_at: string | null;
  child_folder_count: number;
  child_file_count: number;
  total_size: number;
  repository_id: string;
  parent_id: string | null;
  inserted_at: string;
  updated_at: string;
}

export interface File {
  id: string;
  name: string;
  version: number;
  file_size: number;
  is_deleted: boolean;
  deleted_at: string | null;
  repository_id: string;
  inserted_at: string;
  updated_at: string;
  mime_type: string;
  file_extension: string;
  storage_key: string;
  checksum_sha256: string | null;
  content_extracted: boolean;
  display_name: string;
  download_count: number;
  folder_id: string | null;
  last_accessed_at: string | null;
  parent_version_id: string | null;
  thumbnail_generated: boolean;
}

export interface FolderList {
  folders: Folder[];
}

export interface FileList {
  files: File[];
}

export interface FolderContents {
  folders: Folder[];
  files: File[];
}

// ============================================================================
// COMPONENT PROP TYPES
// ============================================================================

export interface FileExplorerProps {
  items: StorageItem[];
  currentPath: string;
  onItemClick: (item: StorageItem) => void;
  onUpload: () => void;
  onNewFolder: () => void;
  onRename: (item: StorageItem, newName: string) => void;
  onDelete: (item: StorageItem) => void;
  onDownload?: (item: StorageItem) => void;
  onShare?: (item: StorageItem) => void;
  currentFolderId?: string;
}

export interface FilePreviewProps {
  file: StorageItem | null;
  onClose: () => void;
  onDownload?: (file: StorageItem) => void;
  onShare?: (file: StorageItem) => void;
}

export interface FileUploadZoneProps {
  onDrop?: (
    files: globalThis.File[],
    options?: { migrateToWraft?: boolean },
  ) => void;
  showOpen?: boolean;
  onClose?: () => void;
  accept?: Record<string, string[]>;
  maxSize?: number;
  maxFiles?: number;
  multiple?: boolean;
  noChange?: boolean;
  progress?: number;
  assets?: Array<{
    id: string;
    name: string;
    file: string;
    type: string;
  }>;
  setPdfPreview?: (preview: string | null) => void;
  setIsSubmit?: (isSubmit: boolean) => void;
  setDeleteAssets?: (deleteAssets: boolean) => void;
  className?: string;
  style?: React.CSSProperties;
}

export interface NewFolderModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: { name: string }) => Promise<void>;
  currentFolder?: {
    id: string;
    name: string;
    path: string;
  } | null;
  isLoading?: boolean;
}

export interface DeleteConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => Promise<void>;
  itemName: string;
  itemType: 'folder' | 'file';
  isLoading?: boolean;
}

export interface BreadcrumbsProps {
  items: BreadcrumbItem[];
  onNavigate: (folderId: string) => void;
}

export interface StorageItemDetailsProps {
  item: StorageItemDetails | { data: StorageItemDetails } | null;
  isLoading: boolean;
  error: string | null;
  onBack: () => void;
  isExpanded?: boolean;
  onToggleExpand?: () => void;
  activeExpandedView?: 'preview' | 'data' | 'summary';
}

export interface FilePreviewDrawerProps {
  file: StorageItem | null;
  onClose: () => void;
  onDownload?: (file: StorageItem) => void;
  onShare?: (file: StorageItem) => void;
}

export interface RepositorySetupProps {
  onSetup: (data: SetupRepositoryData) => Promise<void>;
  onUpload: () => void;
  isLoading?: boolean;
}

export interface EmptyRepositoryProps {
  onNewFolder: () => void;
  onUpload: () => void;
}

export interface EmptyFileExplorerProps {
  onUpload?: () => void;
  title?: string;
  description?: string;
  buttonText?: string;
}

export interface DocumentContentViewerProps {
  fileId: string;
}

export interface ScannerTextProps {
  text: string;
  className?: string;
  scannerColor?: string;
  scannerWidth?: string;
  scanDuration?: number;
  status?: 'completed' | 'uploading' | 'pending' | 'error' | 'warning';
}

// ============================================================================
// HOOK RETURN TYPES
// ============================================================================

export interface UseStorageItemReturn {
  item: StorageItemDetails | null;
  isLoading: boolean;
  error: string | null;
  fetchItem: (itemId: string) => Promise<void>;
  clearItem: () => void;
}

export interface UseRepositoryReturn {
  items: StorageItem[];
  breadcrumbs: BreadcrumbItem[];
  currentFolder: CurrentFolder | null;
  error: Error | null;
  isLoading: boolean;
  createFolder: (name: string) => Promise<any>;
  deleteFolder: (folderId: string) => Promise<void>;
  deleteFile: (fileId: string) => Promise<void>;
  uploadFile: (
    filesList: globalThis.File[],
    options: { migrateToWraft: boolean },
  ) => Promise<void>;
  renameItem: (itemId: string, newName: string) => Promise<boolean>;
  refreshContents: () => Promise<void>;
}

export interface UseRepositorySetupReturn {
  isSetup: boolean;
  isLoading: boolean;
  error: string | null;
  repositories: RepositoryData[];
  checkSetup: () => Promise<void>;
  setupRepository: (data: SetupRepositoryData) => Promise<void>;
  resetSetup: () => void;
}

export interface UseFolderNavigationReturn {
  currentFolderId: string | null;
  navigateToFolder: (folderId: string | null) => void;
  navigateToRoot: () => void;
}

// ============================================================================
// UPLOAD TYPES
// ============================================================================

export interface UploadedFile {
  id: string;
  name: string;
  size: number;
  type: string;
  file: globalThis.File;
  preview?: string;
}

export interface UploadOptions {
  migrateToWraft: boolean;
}

// ============================================================================
// UTILITY TYPES
// ============================================================================

export type FileType = 'file' | 'folder';
export type ItemType = 'file' | 'folder';
export type ScannerStatus =
  | 'completed'
  | 'uploading'
  | 'pending'
  | 'error'
  | 'warning';

export interface FileValidationResult {
  isValid: boolean;
  error?: string;
}

export interface FileSize {
  bytes: number;
  formatted: string;
}

export interface DateRange {
  start: string;
  end: string;
}

// ============================================================================
// CONSTANTS
// ============================================================================

export const DEFAULT_FILE_ACCEPT = {
  'application/pdf': ['.pdf'],
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document': [
    '.docx',
  ],
  'application/msword': ['.doc'],
  'application/vnd.oasis.opendocument.text': ['.odt'],
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': [
    '.xlsx',
  ],
  'application/vnd.ms-excel': ['.xls'],
  'application/vnd.oasis.opendocument.spreadsheet': ['.ods'],
  'application/vnd.openxmlformats-officedocument.presentationml.presentation': [
    '.pptx',
  ],
  'application/vnd.ms-powerpoint': ['.ppt'],
  'application/vnd.oasis.opendocument.presentation': ['.odp'],
  'text/plain': ['.txt'],
  'text/rtf': ['.rtf'],
};

export const DEFAULT_MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
export const DEFAULT_MAX_FILES = 10;
export const DEBOUNCE_DELAY = 150; // ms
