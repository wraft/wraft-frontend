/**
 * Load Content Types List
 * @param id
 */

// import { env } from '../components/vars';
// const mx = 'http://localhost:4000' 'https://dieture.x.aurut.com'
// const API_HOST = process.env.API_HOST || 'http://localhost:4000' // 'https://api.o.dieture.com';
// const API_HOST = process.env.API_HOST || 'http://localhost:4000'
const API_HOST = process.env.API_HOST || 'http://localhost:4000' // 'https://api.o.dieture.com';
import cookie from 'js-cookie';
/**
 * Load Entity
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
    .then(function(response) {
      return response.json();
    })
    .then(function(data) {
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
    .then(function(response) {
      return response.json();
    })
    .then(function(data) {
      onSuccess(data);
    });
};

/**
 * Create a Entity
 * @param data
 * @param path
 * @param token
 */
export const createEntity = (
  data: any,
  path: string,
  token: string,
  onSuccess?: any,
) => {
  fetch(`${API_HOST}/api/v1/${path}`, {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  })
    .then(function(response) {
      return response.json();
    })
    .then(function(data) {
      if (onSuccess) {
        console.log(`Created a model ${path} with Pass`, data);
        onSuccess(data);
      } else {
        console.log(`Created a model ${path}`, data);
      }
    });
};

/**
 * Delete an Entity
 * @param path
 * @param token
 */
export const deleteEntity = (path: string, token: string) => {
  fetch(`${API_HOST}/api/v1/${path}`, {
    method: 'DELETE',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
  })
    .then(function(response) {
      return response.json();
    })
    .then(function(data) {
      console.log(`Created a model ${path}`, data);
    });
};

/**
 * Update an Entity
 * @param path
 * @param token
 */
export const updateEntity = (
  path: string,
  data: any,
  token: string,
  onSuccess?: any,
) => {
  fetch(`${API_HOST}/api/v1/${path}`, {
    method: 'PUT',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  })
    .then(function(response) {
      return response.json();
    })
    .then(function(data) {
      onSuccess(data);
    });
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
    .then(function(response) {
      return response.json();
    })
    .then(function(data) {
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
    .then(function(response) {
      return response.json();
    })
    .then(function(data) {
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
    .then(function(response) {
      return response.json();
    })
    .then(function(data) {
      onSuccess(data);
    });
};
export const checkUser = (token: any, onSuccess?: any) => {
  fetch(`${API_HOST}/api/v1/users/me`, {
    method: 'GET',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
  })
    .then(function(response) {
      return response.json();
    })
    .then(function(data) {
      onSuccess(data);
      // setUser(data);
      // onProfileLoad(data);
    });
};

/**
 * Login a user
 * @param data
 * @param onSucces ref to handle
 */
export const userLogin = (data: any, onSuccess?: any) => {
  fetch(`${API_HOST}/api/v1/users/signin`, {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  })
    .then(function(response) {
      return response.json();
    })
    .then(function(data) {
      const { token } = data;
      cookie.set('token', token);
      onSuccess(token);
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
    .then(function(response) {
      return response.json();
    })
    .then(function(data) {
      const { token } = data;
      cookie.set('token', token);
      onSuccess(token);
    });
};
