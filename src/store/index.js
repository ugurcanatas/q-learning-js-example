import Vue from "vue";
import Vuex from "vuex";

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    matrix: [],
    Q_VALUES: [],
    pathObject: {
      color: "#7ef2ac",
      type: "PATH",
      prize: -1,
      id: 1,
    },
    wallObject: {
      color: "#1f2252",
      type: "WALL",
      prize: -100,
      id: 2,
    },
    rewardObject: {
      color: "#1793ff",
      type: "REWARD",
      prize: 100,
      id: 3,
    },
  },
  getters: {
    getMatrix(state) {
      return state.matrix;
    },
    getQValues(state) {
      return state.Q_VALUES;
    },
  },
  mutations: {
    createMatrix(state, row_col) {
      state.matrix = [];
      for (let i = 0; i < row_col; i++) {
        state.matrix[i] = new Array(row_col);
        for (let j = 0; j < row_col; j++) {
          state.matrix[i][j] = state.wallObject;
        }
      }
      console.log("Create Called", state.matrix);
    },
    update(state, v) {
      console.log("Update called");
      state.matrix = v;
    },
    toPath(state, v) {
      console.log("To Path called");
      const { i, j } = v;
      state.matrix[i][j] = state.pathObject;
    },
    toWall(state, v) {
      const { i, j } = v;
      state.matrix[i][j] = state.wallObject;
    },
    updateQValues(state, v) {
      state.Q_VALUES = v;
    },
    toReward(state, v) {
      const { i, j } = v;
      state.matrix[i][j] = state.rewardObject;
    },
    mutatePrizeValues(state, data) {
      const { wallPrize, pathPrize, rewardPrize } = data;
      state.wallObject.prize = wallPrize;
      state.pathObject.prize = pathPrize;
      state.rewardObject.prize = rewardPrize;
    },
  },
  actions: {
    actionToPath({ commit }, data) {
      commit("toPath", data);
    },
    actionToWall({ commit }, data) {
      commit("toWall", data);
    },
    actionUpdateQ({ commit }, data) {
      commit("updateQValues", data);
    },
    actionToReward({ commit }, data) {
      commit("toReward", data);
    },
    actionSetSetPrizes({ commit }, data) {
      commit("mutatePrizeValues", data);
    },
    actionCreateMatrix({ commit }, data) {
      commit("createMatrix", data);
    },
  },
  modules: {},
});
