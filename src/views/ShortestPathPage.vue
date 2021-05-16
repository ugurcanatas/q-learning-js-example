<template>
  <div class="columns" style="height: 100vh">
    <div class="column is-3 py-6 px-6">
      <div class="field">
        <div class="box">
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
      </div>
      <div class="field">
        <b-button @click="findShortestPath" type="is-danger"
          >Find Shortest Path</b-button
        >
      </div>
    </div>
    <div class="column grid-container">
      <div class="container">
        <div
          v-if="isRobotVisible"
          class="robotItem box mx-6"
          :style="transformRobot"
        >
          Robot
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
import { getNextAction, isTerminalState, getNextLocation } from "../helpers";
export default {
  data() {
    return {
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
      console.log("Clicked", i, j);
      this.defRow = i;
      this.defCol = j;
      this.isRobotVisible = true;
      this.transformRobot = `transform:translate(${j * 100}px,${i * 100}px);`;
    },
    randomLocation: function () {
      let current_row_index = Math.floor(Math.random() * this.getMatrix.length);
      let current_col_index = Math.floor(Math.random() * this.getMatrix.length);
      while (isTerminalState(current_row_index, current_col_index)) {
        current_row_index = Math.floor(Math.random() * this.getMatrix.length);
        current_col_index = Math.floor(Math.random() * this.getMatrix.length);
        //console.log("Select StartLocation", current_row_index, current_col_index);
      }
      this.defRow = current_row_index;
      this.defCol = current_col_index;
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
      this.resetClasses();
      const d = document.getElementById(`box-${this.defRow}-${this.defCol}`);
      console.log("Element", d);
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
          let action_index = getNextAction(curr_row, curr_col, 1);
          let indexes = getNextLocation(curr_row, curr_col, action_index);
          console.log("Action Index", action_index);
          console.log("Next Location", indexes);
          curr_row = indexes[0];
          curr_col = indexes[1];
          this.transformRobot = `transform:translate(${curr_col * 100}px,${
            curr_row * 100
          }px);`;
          const d = document.getElementById(`box-${curr_row}-${curr_col}`);
          console.log("Element", d);
          d.classList.add("bgClass");
          this.shortest_path.push(indexes);
          await this.timer(1000);
        }
      }
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
}

.robotItem {
  top: 0;
  height: 100px;
  width: 100px;
  position: absolute;
  cursor: pointer;
  z-index: 99 !important;
}
</style>