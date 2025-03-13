/**
 * Security utility functions for the application
 */

/**
 * Sanitizes an ID to prevent path traversal and injection attacks
 * @param id The ID to sanitize
 * @returns The sanitized ID or null if invalid
 */
export const sanitizeId = (id: string | undefined): string | null => {
  if (!id) return null;

  // Remove any characters that aren't alphanumeric, hyphens, or underscores
  const sanitized = id.replace(/[^a-zA-Z0-9-_]/g, '');

  // If the sanitized ID is empty or different from the original, it was potentially malicious
  if (!sanitized || sanitized !== id) {
    console.warn('Potentially malicious ID detected and sanitized', {
      original: id,
      sanitized,
    });
  }

  return sanitized || null;
};

/**
 * Validates that a response object has the expected structure
 * @param response The response object to validate
 * @param requiredFields Array of field names that must exist in the response
 * @returns Boolean indicating if the response is valid
 */
export const validateResponse = (
  response: unknown,
  requiredFields: string[],
): boolean => {
  if (!response || typeof response !== 'object') {
    return false;
  }

  // Check that all required fields exist
  return requiredFields.every(
    (field) =>
      Object.prototype.hasOwnProperty.call(response, field) &&
      response[field as keyof typeof response] !== undefined,
  );
};

/**
 * Sanitizes user input to prevent XSS attacks
 * @param input The user input to sanitize
 * @returns The sanitized input
 */
export const sanitizeUserInput = (input: string): string => {
  if (!input) return '';

  // Replace potentially dangerous characters with their HTML entities
  return input
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
};

/**
 * Validates that a string is a safe filename
 * @param filename The filename to validate
 * @returns Boolean indicating if the filename is safe
 */
export const isValidFilename = (filename: string): boolean => {
  if (!filename) return false;

  // Check for path traversal attempts
  if (
    filename.includes('..') ||
    filename.includes('/') ||
    filename.includes('\\')
  ) {
    return false;
  }

  // Only allow alphanumeric characters, hyphens, underscores, and periods
  const safePattern = /^[a-zA-Z0-9-_.]+$/;
  return safePattern.test(filename);
};
