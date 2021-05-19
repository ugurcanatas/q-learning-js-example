import store from "./store";

/**
 * Get initial store values
 */
let Q_VALUES = store.getters["getQValues"];
let MATRIX = store.getters["getMatrix"];
let DIMEN = store.getters["getMatrixDimen"];
let PATH_PRIZE = store.getters["getPathPrize"];
let ACTIONS = store.getters["getActions"];

/**
 * Get latest vuex store values when called
 */
const invokeStoreValues = () => {
  Q_VALUES = store.getters["getQValues"];
  MATRIX = store.getters["getMatrix"];
  DIMEN = store.getters["getMatrixDimen"];
  PATH_PRIZE = store.getters["getPathPrize"];
  ACTIONS = store.getters["getActions"];
};

/**
 * Pyhton argmax function JS implementation.
 * @param {Array} array
 * @returns index of max value item in an array
 */
const argMax = (array) => {
  return array.map((x, i) => [x, i]).reduce((r, a) => (a[0] > r[0] ? a : r))[1];
};

/**
 * Checks if current matrix box is terminal state (Wall or not)
 * @param {Number} row_index
 * @param {Number} col_index
 * @returns true if
 */
const isTerminalState = (row_index, col_index) => {
  //return MATRIX[row_index][col_index].prize === PATH_PRIZE ? false : true;
  if (MATRIX[row_index][col_index].prize === PATH_PRIZE) {
    return false;
  } else {
    return true;
  }
};

/**
 *
 * @param {Number} row
 * @param {Number} col
 * @param {Number} epsilon
 * @returns an action from ACTIONS array if Math.random is bigger than epsilon value.
 */
const pickNextAction = (row, col, epsilon) => {
  if (Math.random() < epsilon) {
    return argMax(Q_VALUES[row][col]);
  } else {
    return Math.floor(Math.random() * ACTIONS.length);
  }
};

const pickNextLocation = (row, col, action_index) => {
  let new_row_index = row;
  let new_col_index = col;
  if (ACTIONS[action_index] === "UP" && row > 0) {
    new_row_index -= 1;
  } else if (ACTIONS[action_index] === "RIGHT" && col < DIMEN - 1) {
    new_col_index += 1;
  } else if (ACTIONS[action_index] === "DOWN" && row < DIMEN - 1) {
    new_row_index += 1;
  } else if (ACTIONS[action_index] === "LEFT" && col > 0) {
    new_col_index -= 1;
  } else if (ACTIONS[action_index] === "UP-LEFT" && col > 0 && row > 0) {
    new_col_index -= 1;
    new_row_index -= 1;
  } else if (
    ACTIONS[action_index] === "UP-RIGHT" &&
    col < DIMEN - 1 &&
    row > 0
  ) {
    new_col_index += 1;
    new_row_index -= 1;
  } else if (
    ACTIONS[action_index] === "DOWN-LEFT" &&
    col > 0 &&
    row < DIMEN - 1
  ) {
    new_col_index -= 1;
    new_row_index += 1;
  } else if (
    ACTIONS[action_index] === "DOWN-RIGHT" &&
    col < DIMEN - 1 &&
    row < DIMEN - 1
  ) {
    new_col_index += 1;
    new_row_index += 1;
  }
  return [new_row_index, new_col_index];
};

const pickStartLocation = () => {
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
  pickNextAction,
  pickNextLocation,
  argMax,
  isTerminalState,
  pickStartLocation,
  invokeStoreValues,
};
