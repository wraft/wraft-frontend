import { fetchAPI, postAPI } from 'utils/models';

// Browser-compatible Google Drive client service
export interface GoogleDriveTokens {
  access_token: string;
  refresh_token?: string;
  scope: string;
  token_type: string;
  expiry_date?: number;
}

export interface GoogleDriveUserInfo {
  id: string;
  email: string;
  name: string;
  picture?: string;
}

export interface DriveFile {
  id: string;
  name: string;
  mimeType: string;
  size?: string;
  createdTime: string;
  modifiedTime: string;
  parents?: string[];
  webViewLink?: string;
  webContentLink?: string;
  thumbnailLink?: string;
  owners?: Array<{
    displayName: string;
    emailAddress: string;
  }>;
}

export interface DriveFolder {
  id: string;
  name: string;
  createdTime: string;
  modifiedTime: string;
  parents?: string[];
  webViewLink?: string;
}

export interface DriveListResponse {
  files: DriveFile[];
  nextPageToken?: string;
}

/**
 * Get authorization URL from server
 */
export async function getAuthorizationUrl(): Promise<string> {
  try {
    const response = (await fetchAPI('clouds/google/auth')) as {
      redirect_url?: string;
      authUrl?: string;
    };

    return response.redirect_url || response.authUrl || '';
  } catch (error) {
    console.error('Error getting authorization URL:', error);
    throw error;
  }
}

/**
 * Exchange authorization code for tokens
 */
export async function exchangeCodeForTokens(
  code: string,
): Promise<{ tokens: GoogleDriveTokens; userInfo: GoogleDriveUserInfo }> {
  try {
    const response = (await postAPI('clouds/google/token', {
      action: 'exchange',
      code,
    })) as { tokens: GoogleDriveTokens; userInfo: GoogleDriveUserInfo };

    return response;
  } catch (error) {
    console.error('Error exchanging code for tokens:', error);
    throw error;
  }
}

/**
 * Refresh access token
 */
export async function refreshAccessToken(
  refreshToken: string,
): Promise<GoogleDriveTokens> {
  try {
    const response = (await postAPI('clouds/google/token', {
      action: 'refresh',
      refreshToken,
    })) as { tokens: GoogleDriveTokens };

    return response.tokens;
  } catch (error) {
    console.error('Error refreshing access token:', error);
    throw error;
  }
}

/**
 * Verify access token and get user info
 */
export async function verifyToken(
  accessToken: string,
): Promise<{ valid: boolean; userInfo?: GoogleDriveUserInfo }> {
  try {
    const response = (await postAPI('clouds/google/token', {
      action: 'verify',
      accessToken,
    })) as { valid: boolean; userInfo?: GoogleDriveUserInfo };

    return response;
  } catch (error) {
    console.error('Error verifying token:', error);
    return { valid: false };
  }
}

/**
 * Revoke access token
 */
export async function revokeToken(accessToken: string): Promise<boolean> {
  try {
    const response = (await postAPI('clouds/google/token', {
      action: 'revoke',
      accessToken,
    })) as { success: boolean };

    return response.success;
  } catch (error) {
    console.error('Error revoking token:', error);
    return false;
  }
}

/**
 * List files from Google Drive
 */
export async function listFiles(
  options: {
    folderId?: string;
    pageToken?: string;
    pageSize?: number;
    query?: string;
  } = {},
): Promise<DriveListResponse> {
  try {
    const queryParams = new URLSearchParams();

    if (options.folderId) queryParams.append('folder_id', options.folderId);
    if (options.pageToken) queryParams.append('page_token', options.pageToken);
    if (options.pageSize)
      queryParams.append('page_size', options.pageSize.toString());
    if (options.query) queryParams.append('q', options.query);

    const queryString = queryParams.toString();
    // const endpoint = 'clouds/google/files';
    const endpoint = queryString
      ? `clouds/google/files?${queryString}`
      : 'clouds/google/files';

    const response = (await fetchAPI(endpoint)) as DriveListResponse;
    return response;
  } catch (error) {
    console.error('Error listing files:', error);
    throw error;
  }
}

/**
 * Get a specific file from Google Drive
 */
export async function getFile(fileId: string): Promise<DriveFile> {
  try {
    const response = (await fetchAPI(
      `clouds/google/file/${fileId}`,
    )) as DriveFile;
    return response;
  } catch (error) {
    console.error('Error getting file:', error);
    throw error;
  }
}

/**
 * Search files in Google Drive
 */
export async function searchFiles(
  query: string,
  options: {
    pageToken?: string;
    pageSize?: number;
  } = {},
): Promise<DriveListResponse> {
  try {
    const queryParams = new URLSearchParams({ q: query });

    if (options.pageToken) queryParams.append('page_token', options.pageToken);
    if (options.pageSize)
      queryParams.append('page_size', options.pageSize.toString());

    const response = (await fetchAPI(
      `clouds/google/search?${queryParams.toString()}`,
    )) as DriveListResponse;
    return response;
  } catch (error) {
    console.error('Error searching files:', error);
    throw error;
  }
}

/**
 * List all PDF files from Google Drive
 */
export async function listPDFs(
  options: {
    pageToken?: string;
    pageSize?: number;
  } = {},
): Promise<DriveListResponse> {
  try {
    const queryParams = new URLSearchParams();

    if (options.pageToken) queryParams.append('page_token', options.pageToken);
    if (options.pageSize)
      queryParams.append('page_size', options.pageSize.toString());

    const queryString = queryParams.toString();
    const endpoint = queryString
      ? `clouds/google/pdfs?${queryString}`
      : 'clouds/google/pdfs';

    const response = (await fetchAPI(endpoint)) as DriveListResponse;
    return response;
  } catch (error) {
    console.error('Error listing PDFs:', error);
    throw error;
  }
}

/**
 * Download a file from Google Drive
 */
export async function downloadFile(
  fileId: string,
  fileName: string,
  mimeType: string,
): Promise<boolean> {
  try {
    const response = (await postAPI('clouds/google/download', {
      file_id: fileId,
      file_name: fileName,
      mime_type: mimeType,
    })) as { success: boolean };

    return response.success;
  } catch (error) {
    console.error('Error downloading file:', error);
    throw error;
  }
}

/**
 * Sync files to repository
 */
export async function syncFiles(
  fileIds: string[],
  outputPath: string | null,
): Promise<boolean> {
  try {
    const response: any = await postAPI('clouds/google/import', {
      file_ids: fileIds,
      output_path: outputPath,
    });

    return response;
  } catch (error) {
    console.error('Error syncing files:', error);
    throw error;
  }
}

/**
 * List folders from Google Drive
 */
export async function listFolders(
  options: {
    pageToken?: string;
    pageSize?: number;
  } = {},
): Promise<{ folders: DriveFolder[]; nextPageToken?: string }> {
  try {
    const queryParams = new URLSearchParams();

    if (options.pageToken) queryParams.append('page_token', options.pageToken);
    if (options.pageSize)
      queryParams.append('page_size', options.pageSize.toString());

    const queryString = queryParams.toString();

    const endpoint = queryString
      ? `clouds/google/folders?${queryString}`
      : 'clouds/google/folders';

    const response = (await fetchAPI(endpoint)) as {
      folders: DriveFolder[];
      nextPageToken?: string;
    };
    return response;
  } catch (error) {
    console.error('Error listing folders:', error);
    throw error;
  }
}

/**
 * Search folders in Google Drive
 */
export async function searchFolders(
  query: string,
  options: {
    pageToken?: string;
    pageSize?: number;
  } = {},
): Promise<{ folders: DriveFolder[]; nextPageToken?: string }> {
  try {
    const queryParams = new URLSearchParams({ q: query });

    if (options.pageToken) queryParams.append('page_token', options.pageToken);
    if (options.pageSize)
      queryParams.append('page_size', options.pageSize.toString());

    const response = (await fetchAPI(
      `clouds/google/folders/search?${queryParams.toString()}`,
    )) as { folders: DriveFolder[]; nextPageToken?: string };
    return response;
  } catch (error) {
    console.error('Error searching folders:', error);
    throw error;
  }
}

/**
 * Get a specific folder from Google Drive
 */
export async function getFolder(folderId: string): Promise<DriveFolder> {
  try {
    const response = (await fetchAPI(
      `clouds/google/folder/${folderId}`,
    )) as DriveFolder;
    return response;
  } catch (error) {
    console.error('Error getting folder:', error);
    throw error;
  }
}

/**
 * List files in a specific folder
 */
export async function listFolderFiles(
  folderId: string,
  options: {
    pageToken?: string;
    pageSize?: number;
  } = {},
): Promise<DriveListResponse> {
  try {
    const queryParams = new URLSearchParams();

    if (options.pageToken) queryParams.append('page_token', options.pageToken);
    if (options.pageSize)
      queryParams.append('page_size', options.pageSize.toString());

    const queryString = queryParams.toString();
    const endpoint = queryString
      ? `clouds/google/folder/${folderId}/files?${queryString}`
      : `clouds/google/folder/${folderId}/files`;

    const response = (await fetchAPI(endpoint)) as DriveListResponse;
    return response;
  } catch (error) {
    console.error('Error listing folder files:', error);
    throw error;
  }
}

export interface GoogleDriveIntegrationConfig {
  access_token: string;
  refresh_token?: string;
  user_email: string;
  user_name: string;
  expires_at?: number;
}

export const googleDriveStorage = {
  save: (_config: GoogleDriveIntegrationConfig): void => {
    // localStorage functionality removed
    console.warn(
      'Google Drive storage save operation disabled - localStorage removed',
    );
  },

  load: (): GoogleDriveIntegrationConfig | null => {
    // localStorage functionality removed
    return null;
  },

  remove: (): void => {
    // localStorage functionality removed
    console.warn(
      'Google Drive storage remove operation disabled - localStorage removed',
    );
  },

  isExpired: (config: GoogleDriveIntegrationConfig): boolean => {
    if (!config.expires_at) return false;
    return Date.now() >= config.expires_at;
  },
};
