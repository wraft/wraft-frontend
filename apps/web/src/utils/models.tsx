export const API_HOST =
  process.env.NEXT_PUBLIC_API_HOST || 'http://localhost:4000';
import axios, { AxiosInstance, AxiosProgressEvent } from 'axios';
import cookie from 'js-cookie';

const createAxiosInstance = (): AxiosInstance => {
  const instance = axios.create({
    baseURL: `${API_HOST}/api/v1`,
  });

  instance.interceptors.request.use(
    async (config) => {
      const token = (await cookie.get('token')) || false;
      // config.headers['X-App-Version'] = 'v.5.0';

      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }

      return config;
    },
    (error) => {
      Promise.reject(error);
    },
  );

  instance.interceptors.response.use(
    (response) => response,
    async (error) => {
      const originalRequest = error.config;
      if (error?.response?.status === 401 && !originalRequest._retry) {
        originalRequest._retry = true;
        await cookie.remove('token');

        const url = `/login?session=expired`;
        window.location.href = decodeURI(url);
      }
      return Promise.reject(error);
    },
  );

  return instance;
};

const api = createAxiosInstance();

export default api;

const handleApiError = (error: any) => {
  if (error?.response?.data) {
    return error.response.data;
  }
  return 'An unexpected error occurred. Please try again later.';
};

/**
 * Load fetchAPI
 * @param token
 */
export const fetchAPI = (path: any, query = '') =>
  new Promise((resolve, reject) => {
    api
      .get(`/${path}${query}`)
      .then((response) => {
        resolve(response.data);
      })
      .catch((err) => {
        if (err?.response?.data) {
          const res = err.response.data;
          reject(res);
        }

        reject(err);
      });
  });

export const postAPI = (
  path: string,
  body: any,
  onProgress?: (percentage: number) => void,
) =>
  new Promise((resolve, reject) => {
    const config: any = {
      onUploadProgress: (progressEvent: AxiosProgressEvent) => {
        if (onProgress) {
          const total = progressEvent.total || 1;
          const percentage = Math.round((progressEvent.loaded * 100) / total);
          onProgress(percentage);
        }
      },
    };

    if (body instanceof FormData) {
      config.headers = {
        'Content-Type': undefined,
      };
    }

    api
      .post(`/${path}`, body, config)
      .then((response: any) => resolve(response.data))
      .catch((err) => reject(handleApiError(err)));
  });

export const putAPI = (path: string, body: any = {}) =>
  new Promise((resolve, reject) => {
    api
      .put(`/${path}`, body)
      .then((response: any) => resolve(response.data))
      .catch((err) => reject(handleApiError(err)));
  });

export const patchAPI = (path: string, body: any = {}) =>
  new Promise((resolve, reject) => {
    api
      .patch(`/${path}`, body)
      .then((response: any) => resolve(response.data))
      .catch((err) => reject(handleApiError(err)));
  });

export const deleteAPI = (path: any, body?: any) =>
  new Promise((resolve, reject) => {
    const config = body ? { data: body } : {};
    api
      .delete(`/${path}`, config)
      .then((response: any) => resolve(response.data))
      .catch((err) => reject(handleApiError(err)));
  });

export const userLogin = async (body: any) =>
  new Promise((resolve, reject) => {
    axios
      .post(`${API_HOST}/api/v1/users/signin`, body)
      .then((response) => {
        resolve(response.data);
      })
      .catch((err) => {
        if (!err.response) {
          reject('Unable to process request. Please try again later');
        }
        if (err?.response?.data) {
          reject(err.response.data);
        }
        reject(err);
      });
  });

export const registerUser = (payload: any, token: string | null = null) =>
  new Promise((resolve, reject) => {
    axios
      .post(`${API_HOST}/api/v1/users/signup?token=${token}`, payload, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        resolve(response.data);
      })
      .catch((err) => {
        if (!err.response) {
          reject('Unable to process request. Please try again later');
        }
        if (err?.response?.data) {
          reject(err.response.data);
        }
        reject(err);
      });
  });

export const verifyInvite = (token: string | null = null) =>
  new Promise((resolve, reject) => {
    axios
      .get(`${API_HOST}/api/v1/organisations/verify_invite_token/${token}`)
      .then((response) => {
        resolve(response.data);
      })
      .catch((err) => {
        if (!err.response) {
          reject('Unable to process request. Please try again later');
        }
        if (err?.response?.data) {
          reject(err.response.data);
        }
        reject(err);
      });
  });
