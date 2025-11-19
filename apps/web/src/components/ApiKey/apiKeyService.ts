import {
  ApiKeyFormData,
  ApiKeyResponse,
  ApiKeyListResponse,
  ApiKeyUpdateData,
} from 'schemas/apiKey';
import { fetchAPI, postAPI, putAPI, patchAPI, deleteAPI } from 'utils/models';

/**
 * API Key Service - Handles all API key-related API operations
 */
export const apiKeyService = {
  /**
   * Get all API keys with pagination
   */
  list: async (page: number = 1): Promise<ApiKeyListResponse> => {
    const query = `?page=${page}`;
    return fetchAPI(`api_keys${query}`) as Promise<ApiKeyListResponse>;
  },

  /**
   * Get a single API key by ID
   */
  get: async (id: string): Promise<ApiKeyResponse> => {
    return fetchAPI(`api_keys/${id}`) as Promise<ApiKeyResponse>;
  },

  /**
   * Create a new API key
   */
  create: async (data: ApiKeyFormData): Promise<ApiKeyResponse> => {
    const payload: any = {
      name: data.name.trim(),
      rate_limit: data.rate_limit,
    };

    if (data.user_id) {
      payload.user_id = data.user_id;
    }

    if (data.expires_at) {
      payload.expires_at = data.expires_at;
    }

    if (data.ip_whitelist && data.ip_whitelist.length > 0) {
      payload.ip_whitelist = data.ip_whitelist;
    }

    if (data.metadata && Object.keys(data.metadata).length > 0) {
      payload.metadata = data.metadata;
    }

    return postAPI('api_keys', payload) as Promise<ApiKeyResponse>;
  },

  /**
   * Update an existing API key
   */
  update: async (
    id: string,
    data: ApiKeyUpdateData,
  ): Promise<ApiKeyResponse> => {
    const payload: any = {};

    if (data.name !== undefined) {
      payload.name = data.name.trim();
    }

    if (data.rate_limit !== undefined) {
      payload.rate_limit = data.rate_limit;
    }

    if (data.is_active !== undefined) {
      payload.is_active = data.is_active;
    }

    if (data.expires_at !== undefined) {
      payload.expires_at = data.expires_at || null;
    }

    if (data.ip_whitelist !== undefined) {
      payload.ip_whitelist = data.ip_whitelist;
    }

    if (data.metadata !== undefined) {
      payload.metadata = data.metadata;
    }

    return putAPI(`api_keys/${id}`, payload) as Promise<ApiKeyResponse>;
  },

  /**
   * Toggle API key active status
   */
  toggle: async (id: string): Promise<ApiKeyResponse> => {
    return patchAPI(`api_keys/${id}/toggle`) as Promise<ApiKeyResponse>;
  },

  /**
   * Delete an API key
   */
  delete: async (id: string): Promise<void> => {
    return deleteAPI(`api_keys/${id}`) as Promise<void>;
  },
};

/**
 * Format API key for display (only shows prefix)
 */
export const formatApiKey = (keyPrefix: string): string => {
  return `wraft_${keyPrefix}_••••••••••••••••••••••••••••`;
};

/**
 * Format usage count for display
 */
export const formatUsageCount = (count: number): string => {
  if (count >= 1000000) {
    return `${(count / 1000000).toFixed(1)}M`;
  }
  if (count >= 1000) {
    return `${(count / 1000).toFixed(1)}K`;
  }
  return count.toString();
};

/**
 * Get status badge variant based on API key status
 */
export const getStatusVariant = (
  isActive: boolean,
  expiresAt: string | null,
): 'success' | 'warning' | 'danger' => {
  if (!isActive) {
    return 'danger';
  }

  if (expiresAt) {
    const expiryDate = new Date(expiresAt);
    const now = new Date();
    const daysUntilExpiry = Math.ceil(
      (expiryDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24),
    );

    if (daysUntilExpiry < 0) {
      return 'danger';
    }

    if (daysUntilExpiry <= 7) {
      return 'warning';
    }
  }

  return 'success';
};

/**
 * Get status text based on API key status
 */
export const getStatusText = (
  isActive: boolean,
  expiresAt: string | null,
): string => {
  if (!isActive) {
    return 'Inactive';
  }

  if (expiresAt) {
    const expiryDate = new Date(expiresAt);
    const now = new Date();

    if (expiryDate < now) {
      return 'Expired';
    }
  }

  return 'Active';
};
