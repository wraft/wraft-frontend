export const API_HOST =
  process.env.NEXT_PUBLIC_API_HOST || 'http://localhost:4000';
import axios, { AxiosResponse } from 'axios';

type ApiResponse<T> = Promise<T>;

type HttpMethod = 'get' | 'post' | 'put' | 'delete';

interface ApiRequestOptions<T = any> {
  method: HttpMethod;
  url: string;
  data?: T;
  isGuest?: boolean;
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
  isGuest = false,
  accessToken = null,
  customHeaders = {},
}: ApiRequestOptions): Promise<T> => {
  try {
    const headers: Record<string, string> = {
      ...customHeaders,
      ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}),
    };

    const resolvedUrl = buildResolvedUrl(url, isGuest);

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

const buildResolvedUrl = (url: string, isGuest: boolean): string => {
  const separator = url.includes('?') ? '&' : '?';
  if (isGuest) {
    return url.startsWith('/')
      ? `/guest${url}${separator}type=guest`
      : `/guest/${url}${separator}type=guest`;
  }
  return url.startsWith('/') ? url : `/${url}`;
};

/**
 * API service with helper methods
 */
const apiService = {
  get: <T = any>(
    url: string,
    accessToken: string | null = null,
    isGuest?: boolean,
    headers?: Record<string, string>,
  ): ApiResponse<T> =>
    apiRequest<T>({
      method: 'get',
      url,
      accessToken,
      isGuest,
      customHeaders: headers,
    }),

  post: <T = any, D = any>(
    url: string,
    data: D,
    accessToken: string | undefined = undefined,
    isGuest?: boolean,
    headers?: Record<string, string>,
  ): ApiResponse<T> =>
    apiRequest<T>({
      method: 'post',
      url,
      data,
      accessToken,
      isGuest,
      customHeaders: headers,
    }),

  put: <T = any, D = any>(
    url: string,
    data: D,
    accessToken: string | undefined | null = undefined,
    isGuest?: boolean,
    headers?: Record<string, string>,
  ): ApiResponse<T> =>
    apiRequest<T>({
      method: 'put',
      url,
      data,
      accessToken,
      isGuest,
      customHeaders: headers,
    }),

  delete: <T = any>(
    url: string,
    accessToken: string | undefined = undefined,
    isGuest?: boolean,
    headers?: Record<string, string>,
  ): ApiResponse<T> =>
    apiRequest<T>({
      method: 'delete',
      url,
      accessToken,
      isGuest,
      customHeaders: headers,
    }),
};

export default apiService;
