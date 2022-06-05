import { Action, createStore, createTypedHooks, action } from 'easy-peasy';
import { auth, Auth } from './auth';

export interface StoreModel {
  auth: Auth;
  reset: Action<StoreModel>;
}

let initState: any = {};

export const store: StoreModel = {
  auth,
  // links,
  // loading,
  // settings,
  reset: action(() => initState),
};

const typedHooks = createTypedHooks<StoreModel>();

export const useStoreActions = typedHooks.useStoreActions;
export const useStoreDispatch = typedHooks.useStoreDispatch;
export const useStoreState = typedHooks.useStoreState;

export const initializeStore = (initialState?: StoreModel) => {
  initState = initialState;
  return createStore(store, { initialState });
};

// const typedHooks = createTypedHooks<Store>();
// export const useStoreState = typedHooks.useStoreState;
// export const useStoreActions = typedHooks.useStoreActions;

export default store;
