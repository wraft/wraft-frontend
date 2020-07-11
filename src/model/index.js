import { createStore, action, thunk } from 'easy-peasy';
import { loadEntity } from '../utils/models';

import auth from './auth';
import basicEntity from './default';

const profile = {
  profile:{},
  updateProfile: action((state, payload) => {
    state.profile = payload;
  }),
};

const dishesModel = {
  items: [],
  add: action((state, payload) => {
    state.items.push(payload);
  }),
};

const dishSelection = {
  list: [],
  addDish: action((state, payload) => {
    state.list.push(payload);
  }),
};

const nutrilabelsEntity = {
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

const menusEntity = {
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

const groceriesEntity = {
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

// const sachetTypesEntity = {
//   items: [],
//   add: action((state, payload) => {
//     state.items.push(payload);
//   }),
//   set: action((state, payload) => {
//     state.items = payload;
//   }),
//   remove: action((state, id) => {
//     state.items = state.items.filter(food => food.id !== id);
//   }),
// };


const categoriesEntity = {
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

const sachetTypesModel = {
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

const images = {
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

const sachetsModel = {
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

const mealTypeModel = {
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

const combinationsModel = {
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

const orderItemModel = {
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
  clear: action((state, payload) => {
    state.items = []
  }),
};

const orderSlotModel = {
  items: [],
  add: action((state, payload) => {
    state.items.push(payload);
  }),
  set: action((state, payload) => {
    state.items = payload;
  }),

  update: action((state, payload) => {
    const { data, meal_pack, type } = payload

    var foundIndex = state.items.findIndex(x => x.id == meal_pack);
    state.items[foundIndex]  = {
      ...state.items[foundIndex],
      [type]: data
    }
  }),

  remove: action((state, id) => {
    state.items = state.items.filter(food => food.id !== id);
  }),
};

const model = {
  auth,
  profile,
  categories: categoriesEntity,
  macros: macrosModel,
  groceries: groceriesEntity,
  dishes: dishesModel,
  dishesel: dishSelection,
  nutrilabels: nutrilabelsEntity,
  sachets: sachetsModel,
  sachettypes: sachetTypesModel,
  menus: menusEntity,
  images,
  mealtypes: mealTypeModel,
  combinations: combinationsModel,
  orderItem: orderItemModel,
  orderSlot: orderSlotModel,
};

export default model;

export function initializeStore(initialState) {
  return createStore(model, initialState);
}
