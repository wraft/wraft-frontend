import axios, { AxiosResponse } from 'axios';

import { envConfig } from 'utils/env';

export const API_HOST = envConfig.API_HOST;

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
});

const apiRequest = async <T = any>({
  method,
  url,
  data,
  accessToken = null,
  customHeaders = {},
}: ApiRequestOptions): Promise<T> => {
  try {
    const headers: Record<string, string> = {
      ...customHeaders,
      ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}),
    };

    const response: AxiosResponse<T> = await api({
      method,
      url,
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

/**
 * API service with helper methods
 */
const apiService = {
  get: <T = any>(
    url: string,
    accessToken: string | null = null,
    headers?: Record<string, string>,
  ): ApiResponse<T> =>
    apiRequest<T>({
      method: 'get',
      url,
      accessToken,
      customHeaders: headers,
    }),

  post: <T = any, D = any>(
    url: string,
    data: D,
    accessToken: string | undefined = undefined,
    headers?: Record<string, string>,
  ): ApiResponse<T> =>
    apiRequest<T>({
      method: 'post',
      url,
      data,
      accessToken,
      customHeaders: headers,
    }),

  put: <T = any, D = any>(
    url: string,
    data: D,
    accessToken: string | undefined | null = undefined,
    headers?: Record<string, string>,
  ): ApiResponse<T> =>
    apiRequest<T>({
      method: 'put',
      url,
      data,
      accessToken,
      customHeaders: headers,
    }),

  delete: <T = any>(
    url: string,
    accessToken: string | undefined = undefined,
    headers?: Record<string, string>,
  ): ApiResponse<T> =>
    apiRequest<T>({
      method: 'delete',
      url,
      accessToken,
      customHeaders: headers,
    }),
};

export default apiService;
