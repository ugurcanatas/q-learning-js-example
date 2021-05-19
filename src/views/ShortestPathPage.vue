<template>
  <div class="columns" style="height: 100vh">
    <div class="column is-3 py-6 px-6">
      <div class="field">
        <p class="mb-4">Current Start Point</p>
        <b-tag type="is-primary is-light" size="is-large" class="mb-4"
          >(row,col):({{ defRow }},{{ defCol }})</b-tag
        >
        <div class="field">
          <b-button @click="randomLocation" type="is-primary"
            >Pick Random</b-button
          >
        </div>
      </div>
      <div class="field">
        <b-button
          class="mx-1"
          :loading="isRunning"
          @click="findShortestPath"
          type="is-danger"
          >Find Shortest Path</b-button
        >
        <b-button
          :disabled="!isRunning"
          type="is-danger mx-1"
          icon-right="stop"
          @click="isRunning = false"
        />
      </div>
      <div style="height: 2px; background-color: black" class="my-4"></div>
      <p class="mb-4">Options</p>
      <div class="field">
        <b-field label="Playback Delay (ms)">
          <b-numberinput
            v-model="playbackDelay"
            :step="100"
            :min="0"
            :max="2000"
          >
          </b-numberinput>
        </b-field>
      </div>
    </div>
    <div class="column grid-container">
      <div class="container">
        <div
          v-if="isRobotVisible"
          class="robotItem box mx-6"
          :style="transformRobot"
        >
          <b-image
            :src="require('../assets/robot.svg')"
            webp-fallback=".svg"
            ratio="16by9"
          ></b-image>
        </div>
        <div class="gridRow px-6" v-for="(item, i) in getMatrix" :key.sync="i">
          <div
            :style="`transform: translateX(${j * 100}px); background-color: ${
              mItem.color
            };`"
            class="singleGridItem box no-radius"
            :id="`box-${i}-${j}`"
            v-for="(mItem, j) in item"
            :key.sync="j"
            @click="selectStartPoint(i, j)"
          >
            <span class="tag is-light">{{ mItem.prize }}</span>
            <span class="tag is-warning">{{ mItem.type }}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import { pickNextAction, isTerminalState, pickNextLocation } from "../helpers";
export default {
  data() {
    return {
      playbackDelay: 1000,
      isRunning: false,
      isRobotVisible: false,
      transformRobot: "transform: translate(0,0);",
      defRow: 0,
      defCol: 0,
      rerender: true,
      matrixData: [],
      shortest_path: [],
      shortest_path_matrix: [],
      startObject: {
        color: "#ed266c",
        type: "START",
        prize: 0,
        id: 4,
      },
    };
  },
  computed: {
    ...mapGetters(["getMatrix", "getQValues", "getMatrixDimen"]),
  },
  created() {},
  methods: {
    selectStartPoint: function (i, j) {
      this.resetClasses();
      console.log("Clicked", i, j);
      this.defRow = i;
      this.defCol = j;
      this.isRobotVisible = true;
      this.transformRobot = `transform:translate(${j * 100}px,${i * 100}px);`;
    },
    randomLocation: function () {
      this.resetClasses();
      let current_row_index = Math.floor(Math.random() * this.getMatrix.length);
      let current_col_index = Math.floor(Math.random() * this.getMatrix.length);
      while (isTerminalState(current_row_index, current_col_index)) {
        current_row_index = Math.floor(Math.random() * this.getMatrix.length);
        current_col_index = Math.floor(Math.random() * this.getMatrix.length);
        //console.log("Select StartLocation", current_row_index, current_col_index);
      }
      this.defRow = current_row_index;
      this.defCol = current_col_index;
      this.isRobotVisible = true;
      this.transformRobot = `transform:translate(${current_col_index * 100}px,${
        current_row_index * 100
      }px);`;
    },
    timer: function (ms) {
      return new Promise((res) => setTimeout(res, ms));
    },
    resetClasses: function () {
      for (let i = 0; i < this.getMatrix.length; i++) {
        for (let j = 0; j < this.getMatrix.length; j++) {
          const d = document.getElementById(`box-${i}-${j}`);
          if (d.classList.contains("bgClass")) {
            d.classList.remove("bgClass");
          }
        }
      }
    },
    findShortestPath: async function () {
      console.log("Clicked");
      this.isRunning = true;
      this.resetClasses();
      const d = document.getElementById(`box-${this.defRow}-${this.defCol}`);
      d.classList.add("bgClass");
      //Y,X şeklinde olmalı
      if (isTerminalState(this.defRow, this.defCol)) {
        return [];
      } else {
        let curr_row = this.defRow;
        let curr_col = this.defCol;
        this.shortest_path.splice(0);
        this.shortest_path.push([curr_row, curr_col]);
        while (!isTerminalState(curr_row, curr_col)) {
          if (!this.isRunning) {
            break;
          }
          let action_index = pickNextAction(curr_row, curr_col, 1);
          let indexes = pickNextLocation(curr_row, curr_col, action_index);
          // console.log("Action Index", action_index);
          // console.log("Next Location", indexes);
          curr_row = indexes[0];
          curr_col = indexes[1];
          this.transformRobot = `transform:translate(${curr_col * 100}px,${
            curr_row * 100
          }px);`;
          const d = document.getElementById(`box-${curr_row}-${curr_col}`);
          d.classList.add("bgClass");
          this.shortest_path.push(indexes);
          await this.timer(this.playbackDelay);
        }
      }
      this.isRunning = false;
    },
  },
};
</script>

<style>
.grid-container {
  overflow-x: scroll;
  height: 100%;
}

.bgClass {
  background-color: rgb(163, 163, 255) !important;
  transition: 0.2s ease-in-out;
}

.robotItem {
  padding: 0 !important;
  transition: 0.2s ease-in-out;
  top: 0;
  height: 100px;
  width: 100px;
  position: absolute;
  cursor: pointer;
  z-index: 99 !important;
}

.robotItem img {
  height: 100px;
  width: 100px;
}
</style>