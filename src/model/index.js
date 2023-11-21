import { createStore, action } from 'easy-peasy';
// import { loadEntity } from '../utils/models';

import auth from './auth';
// import basicEntity from './default';

const profile = {
  profile: {},
  updateProfile: action((state, payload) => {
    state.profile = payload;
  }),
};

// const currentWorkspace = {
//   org: {},
//   set: action((state, payload) => {
//     state.org = payload;
//   }),
// };

const currentOrg = {
  name: {},
  // id: {},
  set: action((state, payload) => {
    state.name = payload;
  }),
  // setId: action((state, payload) => {
  //   state.id = payload;
  // }),
};

const images = {
  items: [],
  add: action((state, payload) => {
    state.items.push(payload);
  }),
  set: action((state, payload) => {
    state.items = payload;
  }),
  remove: action((state, id) => {
    state.items = state.items.filter((food) => food.id !== id);
  }),
};

const model = {
  auth,
  profile,
  currentOrg,
  // currentWorkspace,
  images,
};

export default model;

export function initializeStore(initialState) {
  return createStore(model, initialState);
}
