// Redux settings

// TODO: Add the option to take saved debts from localstorage

import { createStore } from "redux";
import update from "immutability-helper";

const InitState = {
  refresh: true,
  selectedJob: null,
};

const mainReducer = (state = InitState, action) => {
  if (action.type === "REFRESH") {
    const currState = state.refresh;
    const newState = update(state, { refresh: { $set: !currState } });
    console.log(newState);
    return newState;
  }

  if (action.type === "SET_JOB") {
    const newState = update(state, { selectedJob: { $set: action.job } });
    return newState;
  }

  return state;
};

const store = createStore(mainReducer);

export default store;
