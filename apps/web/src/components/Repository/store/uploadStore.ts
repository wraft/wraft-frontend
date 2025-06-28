import { create } from 'zustand';
import { devtools, subscribeWithSelector } from 'zustand/middleware';
import { immer } from 'zustand/middleware/immer';

import { UploadedFile, UploadOptions, FileValidationResult } from '../types';

interface UploadState {
  // Upload state
  uploadedFiles: UploadedFile[];
  uploadOptions: UploadOptions;
  uploadProgress: Record<string, number>;

  // Configuration
  fileAccept: Record<string, string[]>;
  maxFileSize: number;
  maxFiles: number;
}

interface UploadActions {
  // Upload management
  setUploadedFiles: (files: UploadedFile[]) => void;
  addUploadedFile: (file: UploadedFile) => void;
  removeUploadedFile: (fileId: string) => void;
  clearUploadedFiles: () => void;
  setUploadOptions: (options: UploadOptions) => void;
  setUploadProgress: (fileId: string, progress: number) => void;
  clearUploadProgress: () => void;

  // Configuration
  setFileAccept: (accept: Record<string, string[]>) => void;
  setMaxFileSize: (size: number) => void;
  setMaxFiles: (count: number) => void;

  // Utility actions
  reset: () => void;
  validateFile: (file: File) => FileValidationResult;
  formatFileSize: (bytes: number) => string;
}

type UploadStore = UploadState & UploadActions;

const DEFAULT_FILE_ACCEPT = {
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

const DEFAULT_MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
const DEFAULT_MAX_FILES = 10;

const initialState: UploadState = {
  // Upload state
  uploadedFiles: [],
  uploadOptions: { migrateToWraft: false },
  uploadProgress: {},

  // Configuration
  fileAccept: DEFAULT_FILE_ACCEPT,
  maxFileSize: DEFAULT_MAX_FILE_SIZE,
  maxFiles: DEFAULT_MAX_FILES,
};

export const useUploadStore = create<UploadStore>()(
  devtools(
    subscribeWithSelector(
      immer((set, get) => ({
        ...initialState,

        // Upload management
        setUploadedFiles: (files) =>
          set((state) => {
            state.uploadedFiles = files;
          }),

        addUploadedFile: (file) =>
          set((state) => {
            state.uploadedFiles.push(file);
          }),

        removeUploadedFile: (fileId) =>
          set((state) => {
            state.uploadedFiles = state.uploadedFiles.filter(
              (file) => file.id !== fileId,
            );
          }),

        clearUploadedFiles: () =>
          set((state) => {
            state.uploadedFiles = [];
          }),

        setUploadOptions: (options) =>
          set((state) => {
            state.uploadOptions = options;
          }),

        setUploadProgress: (fileId, progress) =>
          set((state) => {
            state.uploadProgress[fileId] = progress;
          }),

        clearUploadProgress: () =>
          set((state) => {
            state.uploadProgress = {};
          }),

        // Configuration
        setFileAccept: (accept) =>
          set((state) => {
            state.fileAccept = accept;
          }),

        setMaxFileSize: (size) =>
          set((state) => {
            state.maxFileSize = size;
          }),

        setMaxFiles: (count) =>
          set((state) => {
            state.maxFiles = count;
          }),

        // Utility actions
        reset: () => set(initialState),

        validateFile: (file) => {
          const { fileAccept, maxFileSize, maxFiles, uploadedFiles } = get();

          // Check file size
          if (file.size > maxFileSize) {
            return {
              isValid: false,
              error: `File size exceeds maximum allowed size of ${get().formatFileSize(
                maxFileSize,
              )}`,
            };
          }

          // Check file count
          if (uploadedFiles.length >= maxFiles) {
            return {
              isValid: false,
              error: `Maximum number of files (${maxFiles}) reached`,
            };
          }

          // Check file type
          const isValidType = Object.entries(fileAccept).some(
            ([mimeType, extensions]) => {
              if (file.type === mimeType) return true;
              return extensions.some((ext) =>
                file.name.toLowerCase().endsWith(ext),
              );
            },
          );

          if (!isValidType) {
            return {
              isValid: false,
              error: 'File type not supported',
            };
          }

          return { isValid: true };
        },

        formatFileSize: (bytes) => {
          if (bytes === 0) return '0 Bytes';
          const k = 1024;
          const sizes = ['Bytes', 'KB', 'MB', 'GB'];
          const i = Math.floor(Math.log(bytes) / Math.log(k));
          return (
            parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
          );
        },
      })),
    ),
    {
      name: 'upload-store',
    },
  ),
);

// Selectors
export const useUploadedFiles = () =>
  useUploadStore((state) => state.uploadedFiles);

export const useUploadOptions = () =>
  useUploadStore((state) => state.uploadOptions);

export const useUploadProgress = () =>
  useUploadStore((state) => state.uploadProgress);

export const useFileAccept = () => useUploadStore((state) => state.fileAccept);

export const useMaxFileSize = () =>
  useUploadStore((state) => state.maxFileSize);

export const useMaxFiles = () => useUploadStore((state) => state.maxFiles);
