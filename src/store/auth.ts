import { action, Action, thunk, Thunk, computed, Computed } from 'easy-peasy';
import decode from 'jwt-decode';
import cookie from 'js-cookie';
import axios from 'axios';

import { TokenPayload } from '../utils/types';
import { APIv2 } from '../utils/consts';
import { getAxiosConfig } from '../utils';

export interface Auth {
  domain?: string;
  email: string;
  isAdmin: boolean;
  isAuthenticated: Computed<Auth, boolean>;
  add: Action<Auth, TokenPayload>;
  logout: Action<Auth>;
  login: Thunk<Auth, { email: string; password: string }>;
  renew: Thunk<Auth>;
  token?: string;
}

export const auth: Auth = {
  domain: '',
  email: '',
  isAdmin: false,
  isAuthenticated: computed((s) => !!s.email),
  add: action((state, payload) => {
    state.domain = payload.domain;
    state.email = payload.sub;
    state.isAdmin = payload.admin;
  }),
  logout: action((state) => {
    cookie.remove('token');
    state.domain = '';
    state.email = '';
    state.isAdmin = false;
  }),
  login: thunk(async (actions, payload) => {
    const res = await axios.post(APIv2.AuthLogin, payload);
    const { token } = res.data;
    cookie.set('token', token, { expires: 7 });
    const tokenPayload: TokenPayload = decode(token);
    actions.add(tokenPayload);
  }),
  renew: thunk(async (actions) => {
    const res = await axios.post(APIv2.AuthRenew, null, getAxiosConfig());
    const { token } = res.data;
    cookie.set('token', token, { expires: 7 });
    const tokenPayload: TokenPayload = decode(token);
    actions.add(tokenPayload);
  }),
};
