export const API_HOST =
  process.env.NEXT_PUBLIC_API_HOST || 'http://localhost:4000';
import axios, { AxiosInstance } from 'axios';
import cookie from 'js-cookie';

const createAxiosInstance = (): AxiosInstance => {
  const instance = axios.create({
    baseURL: `${API_HOST}/api/v1`,
  });

  instance.interceptors.request.use(
    async (config) => {
      const token = (await cookie.get('token')) || false;

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

/**
 * Load postAPI
 */
export const postAPI = (
  path: string,
  body: any,
  onProgress?: (percentage: number) => void,
) =>
  new Promise((resolve, reject) => {
    api
      .post(`/${path}`, body, {
        onUploadProgress: (progressEvent) => {
          if (onProgress) {
            const total = progressEvent.total || 1;
            const percentage = Math.round((progressEvent.loaded * 100) / total);
            onProgress(percentage);
          }
        },
      })
      .then((response: any) => resolve(response.data))
      .catch((err) => reject(handleApiError(err)));
  });

/**
 * Load postAPI
 */
export const putAPI = (path: string, body: any = {}) =>
  new Promise((resolve, reject) => {
    api
      .put(`/${path}`, body)
      .then((response: any) => resolve(response.data))
      .catch((err) => reject(handleApiError(err)));
  });

export const postEntityFile = (path: string, formData: any, token: string) =>
  new Promise((resolve, reject) => {
    api
      .post(path, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          token: token,
        },
      })
      .then((response: any) => resolve(response.data))
      .catch((err) => reject(handleApiError(err)));
  });

/**
 * delete API
 */
export const deleteAPI = (path: any, body?: any) =>
  new Promise((resolve, reject) => {
    const config = body ? { data: body } : {};
    api
      .delete(`/${path}`, config)
      .then((response: any) => resolve(response.data))
      .catch((err) => reject(handleApiError(err)));
  });

/**
 * delete API
 */
export const fetchUserInfo = () =>
  new Promise((resolve, reject) => {
    api
      .get(`${API_HOST}/api/v1/users/me`)
      .then((response: any) => resolve(response.data))
      .catch((err) => reject(handleApiError(err)));
  });

/**
 * Load Entity ----temp---
 * @param token
 */

export const loadEntity = (token: string, path: string, onSuccess: any) => {
  fetch(`${API_HOST}/api/v1/${path}`, {
    method: 'GET',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
  })
    .then(function (response) {
      return response.json();
    })
    .then(function (data) {
      onSuccess(data);
    });
};

/**
 * Load Entity Detail
 * @param token
 */
export const loadEntityDetail = (
  token: string,
  model: string,
  id: string,
  onSuccess: any,
) => {
  fetch(`${API_HOST}/api/v1/${model}/${id}`, {
    method: 'GET',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
  })
    .then(function (response) {
      return response.json();
    })
    .then(function (data) {
      onSuccess(data);
    });
};

/**
 * Create a Entity
 * @param data
 * @param path
 * @param token
 */

export const createEntity = async (
  data: any,
  path: string,
  token: string,
  onSuccess?: any,
  onFailed?: any,
) => {
  try {
    const response = await axios.post(`${API_HOST}/api/v1/${path}`, data, {
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    });

    if (onSuccess) {
      onSuccess(response.data);
    }
  } catch (error) {
    if (onFailed) onFailed(error);
    console.error('🐞Error', error);
  }
};

/**
 * Delete an Entity
 * @param path
 * @param token
 * @param data
 */

export const deleteEntity = async (
  path: string,
  token: string,
  onSuccess?: any,
  onFailed?: any,
  data?: any,
) => {
  try {
    const response = await axios.delete(`${API_HOST}/api/v1/${path}`, {
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      data: data,
    });

    if (onSuccess) {
      onSuccess(response.data);
    }
  } catch (error) {
    if (onFailed) onFailed(error);
    console.error('🐞Error', error);
  }
};

/**
 * Update an Entity
 * @param path
 * @param token
 */

export const updateEntity = async (
  path: string,
  data: any,
  token: string,
  onSuccess?: any,
  onFailed?: any,
) => {
  try {
    const response = await axios.put(`${API_HOST}/api/v1/${path}`, data, {
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    });

    if (onSuccess) {
      onSuccess(response.data);
    }
  } catch (error) {
    if (onFailed) onFailed(error);
    console.error('🐞Error', error);
  }
};

/**
 * Update an Entity
 * @param path
 * @param token
 */
export const createEntityFile = (
  data: any,
  token: string,
  path: string,
  onSuccess?: any,
) => {
  fetch(`${API_HOST}/api/v1/${path}`, {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      // 'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: data,
  })
    .then((response) => {
      return response.json();
    })
    .then((res) => {
      if (onSuccess) {
        onSuccess(res);
      }
    });
};

/**
 * Update an Entity
 * @param path
 * @param token
 */
export const updateEntityFile = (
  path: string,
  data: any,
  token: string,
  onSuccess?: any,
) => {
  fetch(`${API_HOST}/api/v1/${path}`, {
    method: 'PUT',
    headers: {
      Accept: 'application/json',
      // 'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: data,
  })
    .then(function (response) {
      return response.json();
    })
    .then(function (res) {
      if (onSuccess) {
        onSuccess(res);
      }
    });
};

export const registerUser = (data: any, onSuccess?: any) => {
  fetch(`${API_HOST}/api/v1/users/signup`, {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  })
    .then(function (response) {
      return response.json();
    })
    .then(function (res) {
      onSuccess(res);
    });
};
export const checkUser = (token: any, onSuccess?: any, onError?: any) => {
  fetch(`${API_HOST}/api/v1/users/me`, {
    method: 'GET',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
  })
    .then(function (response) {
      return response.json();
    })
    .then(function (data) {
      onSuccess(data);
    })
    .catch(function (error) {
      if (onError) {
        onError(error);
      }
    });
};

/**
 * Login a user
 * @param data
 * @param onSucces ref to handle
 */

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

/**
 * Login a user
 * @param data
 * @param onSucces ref to handle
 */
export const userOtpLogin = (data: any, onSuccess?: any) => {
  fetch(`${API_HOST}/api/v1/users/otp_signin`, {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  })
    .then(function (response) {
      return response.json();
    })
    .then(function (response) {
      const { token } = response;
      cookie.set('token', token);
      onSuccess(token);
    });
};

/**
 * Set User , Switch Workpace for tokens
 */

export const switchProfile = (data: any) => {
  const { access_token } = data;
  cookie.set('token', access_token);
};
