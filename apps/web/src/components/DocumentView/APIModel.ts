export const API_HOST =
  process.env.NEXT_PUBLIC_API_HOST || 'http://localhost:4000';
import axios, { AxiosResponse } from 'axios';

type ApiResponse<T> = Promise<T>;

type HttpMethod = 'get' | 'post' | 'put' | 'delete';

interface ApiRequestOptions<T = any> {
  method: HttpMethod;
  url: string;
  data?: T;
  guestType?: 'invite' | 'sign' | null;
  accessToken?: string | null;
  customHeaders?: Record<string, string>;
  retry?: boolean;
}

const api = axios.create({
  baseURL: `${API_HOST}/api/v1`,
  headers: {
    'Content-Type': 'application/json',
  },
});

const apiRequest = async <T = any>({
  method,
  url,
  data,
  guestType = null,
  accessToken = null,
  customHeaders = {},
}: ApiRequestOptions): Promise<T> => {
  try {
    const headers: Record<string, string> = {
      ...customHeaders,
      ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}),
    };

    const resolvedUrl = buildResolvedUrl(url, guestType);

    const response: AxiosResponse<T> = await api({
      method,
      url: resolvedUrl,
      data,
      headers,
    });

    return response.data;
  } catch (error: any) {
    if (error?.response?.data) {
      return Promise.reject(error.response.data);
    }
    throw error;
  }
};

const buildResolvedUrl = (
  url: string,
  guestType: 'invite' | 'sign' | null,
): string => {
  const normalizedUrl = url.startsWith('/') ? url : `/${url}`;
  const [path, query = ''] = normalizedUrl.split('?');
  const params = new URLSearchParams(query);

  if (!params.has('type') && guestType) {
    params.set('type', 'guest');
  }

  if (guestType === 'sign') {
    params.set('type', 'sign');
  }

  const queryString = params.toString();
  const fullPath = queryString ? `${path}?${queryString}` : path;

  return guestType ? `/guest${fullPath}` : fullPath;
};

/**
 * API service with helper methods
 */
const apiService = {
  get: <T = any>(
    url: string,
    accessToken: string | null = null,
    guestType?: 'invite' | 'sign' | null,
    headers?: Record<string, string>,
  ): ApiResponse<T> =>
    apiRequest<T>({
      method: 'get',
      url,
      accessToken,
      guestType,
      customHeaders: headers,
    }),

  post: <T = any, D = any>(
    url: string,
    data: D,
    accessToken: string | undefined = undefined,
    guestType?: 'invite' | 'sign' | null,
    headers?: Record<string, string>,
  ): ApiResponse<T> =>
    apiRequest<T>({
      method: 'post',
      url,
      data,
      accessToken,
      guestType,
      customHeaders: headers,
    }),

  put: <T = any, D = any>(
    url: string,
    data: D,
    accessToken: string | undefined | null = undefined,
    guestType?: 'invite' | 'sign' | null,
    headers?: Record<string, string>,
  ): ApiResponse<T> =>
    apiRequest<T>({
      method: 'put',
      url,
      data,
      accessToken,
      guestType,
      customHeaders: headers,
    }),

  delete: <T = any>(
    url: string,
    accessToken: string | undefined = undefined,
    guestType?: 'invite' | 'sign' | null,
    headers?: Record<string, string>,
  ): ApiResponse<T> =>
    apiRequest<T>({
      method: 'delete',
      url,
      accessToken,
      guestType,
      customHeaders: headers,
    }),
};

export default apiService;
