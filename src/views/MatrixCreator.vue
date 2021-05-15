<template>
  <div>
    <div class="columns">
      <div style="background-color: #fafafa" class="column is-3 py-6 px-6">
        <div class="column">
          <h1>Tools</h1>
          <div class="field">
            <label class="label">Grid Row/Col</label>
            <div class="control">
              <input
                class="input"
                v-model="gridRowCol"
                type="text"
                placeholder="Text input"
              />
            </div>
          </div>
          <div class="field">
            <label class="label">Wall Prize Value</label>
            <div class="control">
              <b-numberinput
                v-model="wallPrizeModel"
                type="is-warning"
                step="10"
              ></b-numberinput>
            </div>
          </div>
          <div class="field">
            <label class="label">Path Prize Value</label>
            <div class="control">
              <b-numberinput
                v-model="pathPrizeModel"
                type="is-info"
                step="10"
              ></b-numberinput>
            </div>
          </div>
          <div class="field">
            <label class="label">Destination Prize Value</label>
            <div class="control">
              <b-numberinput
                v-model="destPrizeModel"
                type="is-success"
                step="10"
              ></b-numberinput>
            </div>
          </div>
          <div class="field">
            <b-button @click="createFromOptions" type="is-link"
              >Create From Options</b-button
            >
          </div>
          <div class="field">
            <router-link to="/train-page"
              ><b-button type="is-success">Train Page</b-button></router-link
            >
          </div>
        </div>
      </div>
      <div class="column py-6">
        <div v-if="!renderGrid">EMPTY</div>
        <div v-else class="container grid-container">
          <div
            class="gridRow px-6 mb-4"
            v-for="(item, i) in getMatrix"
            :key.sync="i"
          >
            <div
              :style="`transform: translateX(${
                j * 100 + 12 * j
              }px); background-color: ${mItem.color};`"
              class="singleGridItem box"
              v-for="(mItem, j) in item"
              :key.sync="j"
              @click="gridItemClicked(i, j)"
              @dblclick="setPrize(i, j)"
            >
              <span class="tag is-light">{{ mItem.prize }}</span>
              <span class="tag is-warning">{{ mItem.type }}</span>
            </div>
          </div>
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
      wallPrizeModel: -100,
      pathPrizeModel: -1,
      destPrizeModel: 100,
      gridRowCol: 5,
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
      matrixModel: [],
      renderGrid: false,
    };
  },
  computed: {
    ...mapGetters(["getMatrix"]),
  },
  created() {
    store.commit("createMatrix", this.gridRowCol);
    //store.commit("update", this.matrixModel);
    store.subscribe(this.subscribtion);
    this.renderGrid = true;
  },
  watch: {
    getMatrix: function (v) {
      console.log("V Update", v);
    },
    // gridRowCol: function (v) {
    //   store.commit("createMatrix", v);
    // },
  },
  methods: {
    subscribtion: function (mutation) {
      const { type } = mutation;
      console.log("Mutation", mutation);
      if (type === "toPath" || type === "toWall" || type === "toReward") {
        this.renderGrid = true; //???????
        console.log("MATRIX MODEL:", this.matrixModel);
      }
    },
    //click
    gridItemClicked: function (i, j) {
      console.log(this.getMatrix[i][j]);
      const { id } = this.getMatrix[i][j];
      this.renderGrid = false;
      if (id === 2) {
        store.dispatch("actionToPath", { i, j });
      } else {
        store.dispatch("actionToWall", { i, j });
      }
    },
    //dbl click
    setPrize: function (i, j) {
      this.renderGrid = false;
      store.dispatch("actionToReward", { i, j });
    },
    createFromOptions: function () {
      store.dispatch("actionSetSetPrizes", {
        wallPrize: this.wallPrizeModel,
        pathPrize: this.pathPrizeModel,
        rewardPrize: this.destPrizeModel,
      });
      store.dispatch("actionCreateMatrix", this.gridRowCol);
    },
  },
};
</script>

<style>
.singleGridItem {
  height: 100px;
  width: 100px;
  position: absolute;
  cursor: pointer;
}

.gridRow {
  height: 100px;
}

.fixed-form {
  position: fixed;
}

.grid-container {
  overflow-x: scroll;
}
</style>