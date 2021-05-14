import Vue from "vue";
import Vuex from "vuex";

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    matrix: [],
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
  },
  getters: {
    getMatrix(state) {
      return state.matrix;
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
      //state.matrix[i][j] = state.pathObject;
      Vue.set(state.matrix[i], j, state.pathObject);
    },
  },
  actions: {
    actionToPath({ commit }, data) {
      commit("toPath", data);
    },
  },
  modules: {},
});
