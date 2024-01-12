export interface Profile {
  profile?: any;
  workspace?: Organisation;
  organizations?: OrganisationList;
  //   domain?: string;
  //   email: string;
  //   isAdmin: boolean;
  //   isAuthenticated: Computed<Profile, boolean>;
  //   add: Action<Profile, TokenPayload>;
  //   logout: Action<Profile>;
  //   login: Thunk<Profile, { email: string; password: string }>;
  //   renew: Thunk<Profile>;
  //   token?: string;
}

/** Organizations List */
export interface OrganisationList {
  organisations: Organisation[];
}

/** Organizations Item */
export interface Organisation {
  name: string;
  logo: string;
  id: string;
}

export const profile: Profile = {
  //   domain: '',
  //   email: '',
  //   isAdmin: false,
  //   isAuthenticated: computed((s) => !!s.email),
  //   add: action((state, payload) => {
  //     state.domain = payload.domain;
  //     state.email = payload.sub;
  //     state.isAdmin = payload.admin;
  //   }),
  //   logout: action((state) => {
  //     cookie.remove('token');
  //     state.domain = '';
  //     state.email = '';
  //     state.isAdmin = false;
  //   }),
  //   login: thunk(async (actions, payload) => {
  //     const res = await axios.post(APIv2.AuthLogin, payload);
  //     const { token } = res.data;
  //     cookie.set('token', token, { expires: 7 });
  //     const tokenPayload: TokenPayload = decode(token);
  //     actions.add(tokenPayload);
  //   }),
  //   renew: thunk(async (actions) => {
  //     const res = await axios.post(APIv2.AuthRenew, null, getAxiosConfig());
  //     const { token } = res.data;
  //     cookie.set('token', token, { expires: 7 });
  //     const tokenPayload: TokenPayload = decode(token);
  //     actions.add(tokenPayload);
  //   }),
};
