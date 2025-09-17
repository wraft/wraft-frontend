import {
  WebhookFormData,
  WebhookResponse,
  WebhookListResponse,
  WebhookLog,
  WebhookStats,
  WebhookEvent,
} from 'schemas/webhook';
import { fetchAPI, postAPI, putAPI, patchAPI, deleteAPI } from 'utils/models';

const transformWebhookData = (data: WebhookFormData) => {
  const headersObject: Record<string, string> = {};
  if (data.headers) {
    data.headers.forEach((header) => {
      if (header.key && header.value) {
        headersObject[header.key] = header.value;
      }
    });
  }

  return {
    name: data.name.trim(),
    url: data.url.trim(),
    events: data.events,
    secret: data.secret || undefined,
    is_active: data.is_active,
    headers: headersObject,
    retry_count: data.retry_count,
    timeout_seconds: data.timeout_seconds,
  };
};

const transformWebhookResponse = (
  webhook: WebhookResponse,
): WebhookFormData => {
  const headersArray = Object.entries(webhook.headers || {}).map(
    ([key, value]) => ({
      key,
      value,
    }),
  );

  return {
    name: webhook.name,
    url: webhook.url,
    events: webhook.events,
    secret: '',
    is_active: webhook.is_active,
    headers: headersArray,
    retry_count: webhook.retry_count,
    timeout_seconds: webhook.timeout_seconds,
  };
};

export const webhookApi = {
  getEvents: (): Promise<{ events: WebhookEvent[] }> =>
    fetchAPI('webhooks/events') as Promise<{ events: WebhookEvent[] }>,

  create: (data: WebhookFormData): Promise<WebhookResponse> => {
    return postAPI(
      'webhooks',
      transformWebhookData(data),
    ) as Promise<WebhookResponse>;
  },

  list: (
    page: number = 1,
    pageSize: number = 20,
  ): Promise<WebhookListResponse> => {
    const query = `?page=${page}&page_size=${pageSize}&sort=inserted_at_desc`;
    return fetchAPI(`webhooks${query}`) as Promise<WebhookListResponse>;
  },

  get: (id: string): Promise<WebhookResponse> =>
    fetchAPI(`webhooks/${id}`) as Promise<WebhookResponse>,

  update: (id: string, data: WebhookFormData): Promise<WebhookResponse> => {
    return putAPI(
      `webhooks/${id}`,
      transformWebhookData(data),
    ) as Promise<WebhookResponse>;
  },

  delete: (id: string): Promise<void> =>
    deleteAPI(`webhooks/${id}`) as Promise<void>,

  toggle: (id: string): Promise<WebhookResponse> =>
    patchAPI(`webhooks/${id}/toggle`) as Promise<WebhookResponse>,

  test: (
    id: string,
    payload?: any,
  ): Promise<{
    success: boolean;
    message: string;
  }> =>
    postAPI(`webhooks/${id}/test`, payload || {}) as Promise<{
      success: boolean;
      message: string;
    }>,

  getLogs: (
    id: string,
    page: number = 1,
    pageSize: number = 20,
    status?: 'success' | 'failed' | 'pending',
  ): Promise<{
    logs: WebhookLog[];
    total_pages: number;
    total_entries: number;
    page_number: number;
  }> => {
    let query = `?page=${page}&page_size=${pageSize}&sort=triggered_at_desc`;
    if (status) {
      query += `&status=${status}`;
    }
    return fetchAPI(`webhooks/${id}/logs${query}`) as Promise<{
      logs: WebhookLog[];
      total_pages: number;
      total_entries: number;
      page_number: number;
    }>;
  },

  getStats: (id: string): Promise<WebhookStats> =>
    fetchAPI(`webhooks/${id}/stats`) as Promise<WebhookStats>,
};

export const getStatusColor = (status: string): string => {
  switch (status) {
    case 'success':
      return 'green';
    case 'failed':
      return 'red';
    case 'pending':
      return 'yellow';
    default:
      return 'gray';
  }
};

export const formatResponseTime = (milliseconds: number): string => {
  if (milliseconds < 1000) {
    return `${milliseconds}ms`;
  }
  return `${(milliseconds / 1000).toFixed(2)}s`;
};

export const getSuccessRate = (
  successCount: number,
  totalCount: number,
): number => {
  if (totalCount === 0) return 0;
  return Math.round((successCount / totalCount) * 100);
};

export { transformWebhookData, transformWebhookResponse };
