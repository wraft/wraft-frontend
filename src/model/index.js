import { createStore, action, thunk } from 'easy-peasy';
import { loadEntity } from '../utils/models';

import auth from './auth';
import basicEntity from './default';

const profile = {
  profile: {},
  updateProfile: action((state, payload) => {
    state.profile = payload;
  }),
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
  images,
};

export default model;

export function initializeStore(initialState) {
  return createStore(model, initialState);
}
