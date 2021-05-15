<template>
  <div class="columns">
    <div class="column is-3 py-6 px-6">
      <div class="field">
        <span>Episode: {{ episodeText }}</span>
      </div>
      <div style="height: 2px; background-color: black" class="my-4"></div>
      <b-field label="Loop Count">
        <b-numberinput v-model="loopCount" step="100" min="500" max="2000">
        </b-numberinput>
      </b-field>
      <b-field label="Loop Delay (ms)">
        <b-slider
          type="is-info"
          v-model="loopTimerValue"
          :step="100"
          :max="2000"
          :min="1"
        ></b-slider>
      </b-field>
      <b-field label="γ value">
        <b-numberinput
          v-model="epsilonModel"
          step="0.1"
          max="0.9"
          min="0.7"
          aria-minus-label="Decrement by 5"
          aria-plus-label="Increment by 5"
        >
        </b-numberinput>
      </b-field>
      <div class="field">
        <b-button
          class="mb-3"
          @click="startWorker"
          :loading="isTrainingStarted"
          type="is-link"
          >Start Training</b-button
        >
        <b-button
          @click="stopWorker"
          :disabled="!isTrainingStarted"
          type="is-danger"
          >Stop Training</b-button
        >
      </div>
      <div class="field">
        <b-button @click="resetQMatrix" type="is-danger"
          >Reset Q Matrix</b-button
        >
      </div>
      <div class="field">
        <router-link to="/"
          ><b-button type="is-success">Matrix Page</b-button></router-link
        >
      </div>
      <div class="field">
        <router-link to="/shotest-path"
          ><b-button type="is-success"
            >Shortest Path Page</b-button
          ></router-link
        >
      </div>
    </div>
    <div class="column">
      <div class="gridRow px-6" v-for="(item, i) in getMatrix" :key.sync="i">
        <div
          :style="`transform: translateX(${j * 100}px); background-color: ${
            mItem.color
          };`"
          class="singleGridItem box no-radius"
          v-for="(mItem, j) in item"
          :key.sync="j"
        >
          <span class="tag is-light">{{ mItem.prize }}</span>
          <span class="tag is-warning">{{ mItem.type }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import store from "../store";
import { mapGetters } from "vuex";
export default {
  data() {
    return {
      episodeText: 0,
      loopTimerValue: 1000,
      isTrainingStarted: false,
      epsilonModel: 0.9,
      loopCount: 1000,
      Q_VALUES: [],
      actions: ["UP", "RIGHT", "DOWN", "LEFT"],
    };
  },
  computed: {
    //get last state
    ...mapGetters(["getMatrix", "getQValues"]),
  },
  created() {
    //create new Q_VALUES array
    this.createQMatrix();

    //console.log("Is Terminal Start", this.isTerminalState(0, 1));
    console.log("Get Matrix", this.getMatrix);
  },
  methods: {
    createQMatrix: function () {
      const DIMEN = this.getMatrix.length;
      for (let i = 0; i < DIMEN; i++) {
        this.Q_VALUES[i] = new Array(DIMEN);
        for (let j = 0; j < DIMEN; j++) {
          this.Q_VALUES[i][j] = new Array(this.actions.length);
          for (let k = 0; k < this.actions.length; k++) {
            this.Q_VALUES[i][j][k] = 0;
          }
        }
      }
      store.dispatch("actionUpdateQ", this.Q_VALUES);
    },
    //Find index of max value item in an array
    argMax: function (array) {
      return array
        .map((x, i) => [x, i])
        .reduce((r, a) => (a[0] > r[0] ? a : r))[1];
    },
    //Check if state is terminal or not.
    //This means that if you hit the wall then it's terminal state
    isTerminalState: function (row_index, col_index) {
      if (this.getMatrix[row_index][col_index].prize === -1) {
        return false;
      } else {
        return true;
      }
    },
    getStartLocation: function () {
      //pick start row & col index
      let current_row = Math.floor(Math.random() * this.getMatrix.length);
      let current_col = Math.floor(Math.random() * this.getMatrix.length);
      //Pick a location until we find a correct one
      while (this.isTerminalState(current_row, current_col)) {
        current_row = Math.floor(Math.random() * this.getMatrix.length);
        current_col = Math.floor(Math.random() * this.getMatrix.length);
      }
      return [current_row, current_col];
    },
    //Robot picks a new action
    getNextAction: function (row_index, col_index, epsilon) {
      if (Math.random() < epsilon) {
        return this.argMax(this.Q_VALUES[row_index][col_index]);
      } else {
        return Math.floor(Math.random() * 4);
      }
    },
    //Select which way robot is goin to go
    getNextLocation: function (row_index, col_index, action_index) {
      let new_row_index = row_index;
      let new_col_index = col_index;

      if (this.actions[action_index] === "UP" && row_index > 0) {
        new_row_index -= 1;
      } else if (
        this.actions[action_index] === "RIGHT" &&
        col_index < this.getMatrix.length - 1
      ) {
        new_col_index += 1;
      } else if (
        this.actions[action_index] === "DOWN" &&
        row_index < this.getMatrix.length - 1
      ) {
        new_row_index += 1;
      } else if (this.actions[action_index] === "LEFT" && col_index > 0) {
        new_col_index -= 1;
      }
      return [new_row_index, new_col_index];
    },
    stopWorker: function () {
      this.isTrainingStarted = false;
    },
    startWorker: function () {
      this.isTrainingStarted = true;
      //console.log(this.loopTimerValue);
      //setTimeout(this.startTraining(), 10);
      this.startTraining();
    },
    timer: function (ms) {
      return new Promise((res) => setTimeout(res, ms));
    },
    startTraining: async function () {
      const discountFactor = 0.9;
      const learningRate = 0.9;

      for (let i = 0; i < this.loopCount; i++) {
        if (!this.isTrainingStarted) {
          break;
        }
        let [rowIndex, colIndex] = this.getStartLocation();

        while (!this.isTerminalState(rowIndex, colIndex)) {
          let actionIndex = this.getNextAction(
            rowIndex,
            colIndex,
            this.epsilonModel
          );
          let oldRow = rowIndex;
          let oldCol = colIndex;
          let nextLocation = this.getNextLocation(
            rowIndex,
            colIndex,
            actionIndex
          );
          rowIndex = nextLocation[0];
          colIndex = nextLocation[1];

          let reward = this.getMatrix[rowIndex][colIndex].prize;
          let oldQValue = this.Q_VALUES[oldRow][oldCol][actionIndex];
          /**
           * Q Learning Formula
           * https://wikimedia.org/api/rest_v1/media/math/render/svg/678cb558a9d59c33ef4810c9618baf34a9577686
           */
          let tempDiff =
            reward +
            discountFactor * Math.max(...this.Q_VALUES[rowIndex][colIndex]) -
            oldQValue;
          let newQValue = learningRate * tempDiff + oldQValue;
          this.Q_VALUES[oldRow][oldCol][actionIndex] = newQValue;
          await this.timer(this.loopTimerValue);
          //console.log("New Q Value", newQValue);
        }
        //console.log("Episode: ", i);
        this.episodeText = i;
      }
      console.log("Training Done !", this.Q_VALUES);
      this.isTrainingStarted = false;
      store.dispatch("actionUpdateQ", this.Q_VALUES);
    },
    resetQMatrix: function () {
      this.createQMatrix();
    },
  },
};
</script>

<style>
.no-radius {
  border-radius: 0px !important;
}
</style>