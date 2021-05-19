<template>
  <div class="columns" style="height: 100vh">
    <div class="column is-3 py-6 px-6">
      <div class="field">
        <p class="is-size-4 pb-2">Preview</p>
        <b-tag type="is-info" size="is-medium"
          >Episode: {{ episodeText }}</b-tag
        >
      </div>
      <div style="height: 2px; background-color: black" class="my-4"></div>
      <p class="is-size-4 pb-2">Options</p>
      <div class="field">
        <b-field label="Scale">
          <b-select @input="scaleDiv" placeholder="Select a scale">
            <option v-for="item in scales" :value="item.value" :key="item.text">
              {{ item.text }}
            </option>
          </b-select>
        </b-field>
      </div>
      <b-field label="Episode Count">
        <b-numberinput v-model="loopCount" :step="100" :min="500" :max="100000">
        </b-numberinput>
      </b-field>
      <b-field label="Loop Delay (ms)">
        <b-slider
          type="is-info"
          v-model="loopTimerValue"
          :step="1"
          :max="2000"
          :min="0"
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
        <router-link to="/shortest-path"
          ><b-button type="is-success"
            >Shortest Path Page</b-button
          ></router-link
        >
      </div>
      <div class="field">
        <router-link
          :to="{
            name: 'ChartReward',
            params: { data: chartDataAvg, scales: scalesAvg },
          }"
          ><b-button type="is-success"
            >Reward/Episode chart</b-button
          ></router-link
        >
      </div>
      <div class="field">
        <router-link
          :to="{
            name: 'ChartReward',
            params: { data: chartDataActions, scales: scalesActions },
          }"
          ><b-button type="is-success"
            >Actions/Episode chart</b-button
          ></router-link
        >
      </div>
    </div>
    <div class="column grid-container">
      <div class="container">
        <div
          class="gridRow px-6"
          v-for="(item, i) in getMatrix"
          :key.sync="i"
          :style="`height: ${boxDimen}px;`"
        >
          <div
            :style="`transform: translateX(${
              j * boxDimen
            }px); background-color: ${
              mItem.color
            }; height: ${boxDimen}px; width: ${boxDimen}px;`"
            class="singleGridItem box no-radius"
            v-for="(mItem, j) in item"
            :key.sync="j"
          ></div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import ChartReward from "./ChartReward";
import store from "../store";
import { mapGetters } from "vuex";
/*eslint-disable */
import {
  pickNextAction,
  pickNextLocation,
  pickStartLocation,
  invokeStoreValues,
  isTerminalState,
  //argMax,
} from "../helpers";
export default {
  components: {
    ChartReward,
  },
  data() {
    return {
      scales: [
        {
          text: "25px",
          value: 25,
        },
        {
          text: "50px",
          value: 50,
        },
        {
          text: "100px",
          value: 100,
        },
      ],
      boxDimen: 50,
      episodeText: 0,
      loopTimerValue: 0,
      isTrainingStarted: false,
      epsilonModel: 0.9,
      loopCount: 1000,
      Q_VALUES: [],
      scalesAvg: {
        yAxes: [
          {
            scaleLabel: {
              display: true,
              labelString: "Avarage Reward",
              fontSize: 24,
            },
          },
        ],
        xAxes: [
          {
            scaleLabel: {
              display: true,
              labelString: "Episodes #",
              fontSize: 24,
            },
          },
        ],
      },
      scalesActions: {
        yAxes: [
          {
            scaleLabel: {
              display: true,
              labelString: "Avarage Actions Taken",
              fontSize: 24,
            },
          },
        ],
        xAxes: [
          {
            scaleLabel: {
              display: true,
              labelString: "Episodes #",
              fontSize: 24,
            },
          },
        ],
      },
      chartDataAvg: {
        labels: [],
        datasets: [
          {
            label: "Graph, Average Reward / Episode",
            borderColor: "rgba(43, 68, 179,1)",
            backgroundColor: "rgba(0,0,0,0)",
            pointBackgroundColor: "rgba(0,0,0,0)",
            data: [],
            tension: 0.5,
            borderWidth: 2,
            pointRadius: 0,
          },
        ],
      },
      chartDataActions: {
        labels: [],
        datasets: [
          {
            label: "Average of Actions in one episode",
            borderColor: "rgba(43, 68, 179,1)",
            backgroundColor: "rgba(0,0,0,0)",
            pointBackgroundColor: "rgba(0,0,0,0)",
            data: [],
            tension: 0.5,
            borderWidth: 2,
            pointRadius: 0,
          },
          {
            label: "Total actions in one episode",
            borderColor: "rgba(43, 68, 179,1)",
            backgroundColor: "rgba(0,0,0,0)",
            pointBackgroundColor: "rgba(0,0,0,0)",
            data: [],
            tension: 0.5,
            borderWidth: 2,
            pointRadius: 0,
          },
        ],
      },
    };
  },
  computed: {
    //get last state
    ...mapGetters(["getMatrix", "getQValues", "getActions"]),
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
          this.Q_VALUES[i][j] = new Array(this.getActions.length);
          for (let k = 0; k < this.getActions.length; k++) {
            this.Q_VALUES[i][j][k] = 0;
          }
        }
      }
      store.dispatch("actionUpdateQ", this.Q_VALUES);
    },
    stopWorker: function () {
      this.isTrainingStarted = false;
    },
    startWorker: function () {
      this.isTrainingStarted = true;
      //this.startTraining();
      let self = this;
      setTimeout(() => self.startTraining(), 100);
    },
    timer: function (ms) {
      return new Promise((res) => setTimeout(res, ms));
    },
    avg: function (array) {
      return array.reduce((a, b) => a + b, 0) / array.length;
    },
    sum: function (array) {
      return array.reduce((a, b) => a + b, 0);
    },
    /*eslint-disable */
    startTraining: async function () {
      //Invoke latest vuex store values for training.
      invokeStoreValues();
      const discountFactor = 0.9;
      const learningRate = 0.9;
      let cumulative = 0;
      let rewardsArr = [];
      let actionsArr = [];
      let totalActionsArr = [];

      for (let i = 0; i < this.loopCount; i++) {
        if (!this.isTrainingStarted) {
          break;
        }
        let [rowIndex, colIndex] = pickStartLocation();
        totalActionsArr = [];

        while (!isTerminalState(rowIndex, colIndex)) {
          let actionIndex = pickNextAction(
            rowIndex,
            colIndex,
            this.epsilonModel
          );
          actionsArr.push(actionIndex);
          totalActionsArr.push(actionIndex);
          let oldRow = rowIndex;
          let oldCol = colIndex;
          let nextLocation = pickNextLocation(rowIndex, colIndex, actionIndex);
          rowIndex = nextLocation[0];
          colIndex = nextLocation[1];

          let reward = this.getMatrix[rowIndex][colIndex].prize;
          rewardsArr.push(reward);
          let oldQValue = this.Q_VALUES[oldRow][oldCol][actionIndex];
          /**
           * Q Learning Formula
           * https://wikimedia.org/api/rest_v1/media/math/render/svg/678cb558a9d59c33ef4810c9618baf34a9577686
           */
          let temporalDifference =
            reward +
            discountFactor * Math.max(...this.Q_VALUES[rowIndex][colIndex]) -
            oldQValue;
          let newQValue = learningRate * temporalDifference + oldQValue;
          // let newQValue =
          //   reward +
          //   discountFactor * Math.max(...this.Q_VALUES[rowIndex][colIndex]);
          this.Q_VALUES[oldRow][oldCol][actionIndex] = newQValue;
          //await this.timer(this.loopTimerValue);
        }
        //cumulative = cumulative + newQValue;
        let rewardAvg = this.avg(rewardsArr);
        let actionsAvg = this.avg(actionsArr);
        this.chartDataAvg.labels[i] = i;
        this.chartDataAvg.datasets[0].data.push(rewardAvg);
        this.chartDataActions.labels[i] = i;
        this.chartDataActions.datasets[0].data.push(actionsAvg);
        this.chartDataActions.datasets[1].data.push(totalActionsArr.length);
        //this.chartDataAvg.datasets[1].data.push(cumulative);
        this.episodeText = i;
      }
      console.log("Training Done !", this.Q_VALUES);
      this.isTrainingStarted = false;
      store.dispatch("actionUpdateQ", this.Q_VALUES);
      console.log("Graph Data", this.chartDataAvg);
    },
    resetQMatrix: function () {
      this.createQMatrix();
    },
    scaleDiv: function (v) {
      this.boxDimen = v;
    },
  },
};
</script>

<style>
.no-radius {
  border-radius: 0px !important;
}
.grid-container {
  overflow-x: scroll;
  height: 100%;
}
</style>