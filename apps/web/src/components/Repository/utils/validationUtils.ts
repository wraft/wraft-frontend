/**
 * Validation utility functions for Repository components
 */

import { FileValidationResult } from '../types';

/**
 * Validate file type based on accepted MIME types
 * @param file - File to validate
 * @param accept - Object with MIME types as keys and extensions as values
 * @returns Validation result
 */
export const validateFileType = (
  file: File,
  accept: Record<string, string[]>,
): FileValidationResult => {
  // Check MIME type first
  const isValidMimeType = Object.keys(accept).includes(file.type);

  if (isValidMimeType) {
    return { isValid: true };
  }

  // Check file extension as fallback
  const fileExtension = `.${file.name.split('.').pop()?.toLowerCase()}`;
  const isValidExtension = Object.values(accept).some((extensions) =>
    extensions.includes(fileExtension),
  );

  if (isValidExtension) {
    return { isValid: true };
  }

  return {
    isValid: false,
    error: `File type not supported. Allowed types: ${Object.values(accept)
      .flat()
      .join(', ')}`,
  };
};

/**
 * Validate file size
 * @param file - File to validate
 * @param maxSize - Maximum file size in bytes
 * @returns Validation result
 */
export const validateFileSize = (
  file: File,
  maxSize: number,
): FileValidationResult => {
  if (file.size <= maxSize) {
    return { isValid: true };
  }

  const maxSizeMB = (maxSize / (1024 * 1024)).toFixed(1);
  return {
    isValid: false,
    error: `File size exceeds maximum allowed size of ${maxSizeMB} MB`,
  };
};

/**
 * Validate folder name
 * @param name - Folder name to validate
 * @returns Validation result
 */
export const validateFolderName = (name: string): FileValidationResult => {
  if (!name.trim()) {
    return {
      isValid: false,
      error: 'Folder name cannot be empty',
    };
  }

  if (name.length > 255) {
    return {
      isValid: false,
      error: 'Folder name cannot exceed 255 characters',
    };
  }

  // Check for invalid characters
  const invalidChars = /[<>:"/\\|?*]/;
  if (invalidChars.test(name)) {
    return {
      isValid: false,
      error: 'Folder name contains invalid characters',
    };
  }

  // Check for reserved names
  const reservedNames = [
    'CON',
    'PRN',
    'AUX',
    'NUL',
    'COM1',
    'COM2',
    'COM3',
    'COM4',
    'COM5',
    'COM6',
    'COM7',
    'COM8',
    'COM9',
    'LPT1',
    'LPT2',
    'LPT3',
    'LPT4',
    'LPT5',
    'LPT6',
    'LPT7',
    'LPT8',
    'LPT9',
  ];
  if (reservedNames.includes(name.toUpperCase())) {
    return {
      isValid: false,
      error: 'Folder name is reserved',
    };
  }

  return { isValid: true };
};

/**
 * Validate file name
 * @param name - File name to validate
 * @returns Validation result
 */
export const validateFileName = (name: string): FileValidationResult => {
  if (!name.trim()) {
    return {
      isValid: false,
      error: 'File name cannot be empty',
    };
  }

  if (name.length > 255) {
    return {
      isValid: false,
      error: 'File name cannot exceed 255 characters',
    };
  }

  // Check for invalid characters
  const invalidChars = /[<>:"/\\|?*]/;
  if (invalidChars.test(name)) {
    return {
      isValid: false,
      error: 'File name contains invalid characters',
    };
  }

  return { isValid: true };
};
