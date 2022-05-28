import { action } from 'easy-peasy';
const catModel = {
  items: [],
  add: action((state, payload) => {
    state.items.push(payload);
  }),
  remove: action((state, id) => {
    state.items = state.foods.filter((food) => food.id !== id);
  }),
  set: action((state, payload) => {
    state.items = payload;
  }),
};

export default catModel;
