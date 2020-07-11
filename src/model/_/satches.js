import { action } from 'easy-peasy';
const macrosModel = {
  items: [],
  add: action((state, payload) => {
    state.items.push(payload);
  }),
  set: action((state, payload) => {
    state.items = payload;
  }),
  remove: action((state, id) => {
    state.items = state.items.filter(food => food.id !== id);
  }),
};

export default macrosModel;
