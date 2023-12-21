export const API_HOST =
  process.env.NEXT_PUBLIC_API_HOST || 'http://localhost:4000';
import cookie from 'js-cookie';
import axios from 'axios';

//Base URL config
const httpClient = axios.create({
  baseURL: `${API_HOST}/api/v1`, // ---temp hard code ---
});

// Request interceptor for API calls
httpClient.interceptors.request.use(
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

httpClient.interceptors.response.use(
  (response) => response,
  async function (error) {
    const originalRequest = error.config;
    // eslint-disable-next-line no-underscore-dangle
    if (error.response.status === 401 && !originalRequest._retry) {
      // eslint-disable-next-line no-underscore-dangle
      originalRequest._retry = true;
      await cookie.remove('token');
      window.location.pathname = '/login';
    }
    return Promise.reject(error);
  },
);

/**
 * Load fetchAPI
 * @param token
 */
export const fetchAPI = (path: any, query = '') =>
  new Promise((resolve, reject) => {
    httpClient
      .get(`/${path}${query}`)
      .then((response) => {
        resolve(response.data);
      })
      .catch((err) => {
        const res = err.response.data;
        if (err.response.status === 400) {
          resolve(res);
        }

        reject(err);
      });
  });

/**
 * delete API
 */
export const deleteAPI = (path: any) =>
  new Promise((resolve, reject) => {
    httpClient
      .delete(`/${path}`)
      .then((response) => {
        resolve(response.data);
      })
      .catch((err) => {
        const res = err.response.data;
        if (err.response.status === 400) {
          resolve(res);
        }

        reject(err);
      });
  });

/**
 * Load Entity ----temp---
 * @param token
 */

export const loadEntity = (token: string, path: string, onSuccess: any) => {
  console.log('API_HOST', API_HOST);

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
  console.log('🥷', API_HOST, data);

  try {
    const response = await axios.post(`${API_HOST}/api/v1/${path}`, data, {
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    });

    console.log(response);

    if (onSuccess) {
      console.log(`Created a model ${path} with Pass`, response.data);
      onSuccess(response.data);
    } else {
      console.log(`Created a model ${path}`, response.data);
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
) => {
  try {
    const response = await axios.delete(`${API_HOST}/api/v1/${path}`, {
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    });

    console.log(response);

    if (onSuccess) {
      console.log(`Deleted model ${path} with Pass`, response.data);
      onSuccess(response.data);
    } else {
      console.log(`Deleted model ${path}`, response.data);
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

    console.log(response);

    if (onSuccess) {
      console.log(`Updated model ${path} with Pass`, response.data);
      onSuccess(response.data);
    } else {
      console.log(`Updated model ${path}`, response.data);
    }
  } catch (error) {
    if (onFailed) onFailed(error);
    console.error('🐞Error', error);
  }
};

// interface IapiWrapper {
//   host: string;
//   path: string;
//   token: string;
//   data: any;
//   onSuccess?: any;
//   type: string;
// }

// const apiWrapper = (props:IapiWrapper ) => {
//   console.log('props', props);
//   // fetch(`${host}/api/v1/${path}`, {
//   //   method: 'PUT',
//   //   headers: {
//   //     Accept: 'application/json',
//   //     // 'Content-Type': 'application/json',
//   //     Authorization: `Bearer ${token}`,
//   //   },
//   //   body: data,
//   // })
//   //   .then(function(response) {
//   //     return response.json();
//   //   })
//   //   .then(function(data) {
//   //     console.log(`Created a model ${path}`, data);
//   //     if (onSuccess) {
//   //       onSuccess(data);
//   //     }
//   //   });
// }

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
    .then(function (response) {
      return response.json();
    })
    .then(function (data) {
      console.log(`Created a asset ${path}`, data);
      if (onSuccess) {
        onSuccess(data);
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
    .then(function (data) {
      console.log(`Created a model ${path}`, data);
      if (onSuccess) {
        onSuccess(data);
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
    .then(function (data) {
      onSuccess(data);
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
export const userLogin = (data: any, onSuccess?: any, onError?: any) => {
  fetch(`${API_HOST}/api/v1/users/signin`, {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  })
    .then(function (response) {
      if (!response.ok) {
        throw new Error();
      }
      return response.json();
    })
    .then(function (data) {
      const { access_token } = data;
      cookie.set('token', access_token);
      onSuccess(access_token);
    })
    .catch(function (error) {
      // console.error('Error:', error);
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
    .then(function (data) {
      const { token } = data;
      cookie.set('token', token);
      onSuccess(token);
    });
};

/**
 * Set User , Switch Workpace for tokens
 */

export const switchProfile = (data: any) => {
  // fetch(`${API_HOST}/api/v1/users/signin`, {
  //   method: 'POST',
  //   headers: {
  //     Accept: 'application/json',
  //     'Content-Type': 'application/json',
  //   },
  //   body: JSON.stringify(data),
  // })
  //   .then(function (response) {
  //     if (!response.ok) {
  //       throw new Error();
  //     }
  //     return response.json();
  //   })
  //   .then(function (data) {
  const { access_token } = data;
  cookie.set('token', access_token);
  // onSuccess(access_token);
  // })
  // .catch(function (error) {
  //   // console.error('Error:', error);
  //   if (onError) {
  //     onError(error);
  //   }
  // });
};
