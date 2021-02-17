// Redux settings

import { createStore } from "redux";
import update from "immutability-helper";

const InitState = {
  selectedId: null,
};

const mainReducer = (state = InitState, action) => {
  if (action.type === "SET_JOB") {
    const newState = update(state, { selectedId: { $set: action.id } });
    return newState;
  }

  return state;
};

const store = createStore(mainReducer);

export default store;
