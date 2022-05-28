import { createStore, applyMiddleware, combineReducers } from 'redux';
import { composeWithDevTools } from 'redux-devtools-extension';
import thunkMiddleware from 'redux-thunk';
import counter from '../reducers/counter.tsx';
import login from '../reducers/login.tsx';

export const rootReducer = combineReducers({
  counter,
  login,
});

const store = createStore(
  rootReducer,
  composeWithDevTools(applyMiddleware(thunkMiddleware)),
);

export default store;
