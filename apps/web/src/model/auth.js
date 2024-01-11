import { action, thunk } from 'easy-peasy';

import axios from 'axios';
import cookie from 'js-cookie';

import { config } from '../components/vars';

const auth = {
  user: null,
  token: null,
  loading: false,
  grantAccess: action((state, payload) => {
    const token = payload.token;
    delete payload.token;

    /** Set localStorage */
    //   localStorage.setItem('uCandidate', JSON.stringify(payload));
    //   localStorage.setItem('uToken', token);

    /** Set global user info */
    state.user = payload;
    state.token = token;
  }),
  login: thunk(
    async (actions, payload) =>
      await axios
        .post(
          config.app.api_url + '/login',
          JSON.stringify({
            email: payload.email.value,
            password: payload.password.value,
          }),
          {
            headers: {
              'Content-Type': 'application/json',
            },
          },
        )
        .then((response) => actions.grantAccess(response.data))
        .catch((error) => {
          console.log(error);
          console.error('Ah ocurrido un error, intente de nuevo.');
        }),
  ),
  logout: action((state) => {
    state.user = null;
    state.token = null;
    cookie.remove('token');
  }),
  refreshToken: action((state) => {
    if (state.token) {
      console.log('Will refresh...');
    }
  }),
  addToken: action((state, payload) => {
    state.token = payload;
  }),
};

export default auth;
