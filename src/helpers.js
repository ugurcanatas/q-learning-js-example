import store from "./store";
const actions = ["UP", "RIGHT", "DOWN", "LEFT"];

let Q_VALUES = store.getters["getQValues"];
let MATRIX = store.getters["getMatrix"];
let DIMEN = store.getters["getMatrixDimen"];
let PATH_PRIZE = store.getters["getPathPrize"];

const invokeStoreValues = () => {
  Q_VALUES = store.getters["getQValues"];
  MATRIX = store.getters["getMatrix"];
  DIMEN = store.getters["getMatrixDimen"];
  PATH_PRIZE = store.getters["getPathPrize"];
};

console.log("Getters", store.getters);
console.log("Store Values", MATRIX);

store.subscribe((v) => {
  console.log("Mutation", v);
});

const argMax = (array) => {
  return array.map((x, i) => [x, i]).reduce((r, a) => (a[0] > r[0] ? a : r))[1];
};

const isTerminalState = (row_index, col_index) => {
  if (MATRIX[row_index][col_index].prize === PATH_PRIZE) {
    return false;
  } else {
    return true;
  }
};

const getNextAction = (row, col, epsilon) => {
  if (Math.random() < epsilon) {
    return argMax(Q_VALUES[row][col]);
  } else {
    return Math.floor(Math.random() * 4);
  }
};

const getNextLocation = (row, col, action_index) => {
  let new_row_index = row;
  let new_col_index = col;
  if (actions[action_index] === "UP" && row > 0) {
    new_row_index -= 1;
  } else if (actions[action_index] === "RIGHT" && col < DIMEN - 1) {
    new_col_index += 1;
  } else if (actions[action_index] === "DOWN" && row < DIMEN - 1) {
    new_row_index += 1;
  } else if (actions[action_index] === "LEFT" && col > 0) {
    new_col_index -= 1;
  }
  return [new_row_index, new_col_index];
};

const getStartLocation = () => {
  //pick start row & col index
  let current_row = Math.floor(Math.random() * DIMEN);
  let current_col = Math.floor(Math.random() * DIMEN);
  //Pick a location until we find a correct one
  while (isTerminalState(current_row, current_col)) {
    current_row = Math.floor(Math.random() * DIMEN);
    current_col = Math.floor(Math.random() * DIMEN);
  }
  return [current_row, current_col];
};

export {
  getNextAction,
  getNextLocation,
  argMax,
  isTerminalState,
  getStartLocation,
  invokeStoreValues,
};
