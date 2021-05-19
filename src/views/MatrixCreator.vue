<template>
  <div>
    <div class="columns" style="height: 100vh">
      <div style="background-color: #fafafa" class="column is-3 py-6 px-6">
        <div class="column">
          <h1 class="is-size-3 mb-4">Options</h1>
          <div class="field">
            <b-field label="Scale">
              <b-select @input="scaleDiv" placeholder="Select a scale">
                <option
                  v-for="item in scales"
                  :value="item.value"
                  :key="item.text"
                  selected="50px"
                >
                  {{ item.text }}
                </option>
              </b-select>
            </b-field>
          </div>
          <div class="field">
            <b-field label="File">
              <b-select @input="selectFile" placeholder="Select a file">
                <option v-for="item in files" :value="item.json" :key="item.id">
                  {{ item.filename }}
                </option>
              </b-select>
            </b-field>
          </div>
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
                :step="10"
              ></b-numberinput>
            </div>
          </div>
          <div class="field">
            <label class="label">Path Prize Value</label>
            <div class="control">
              <b-numberinput
                v-model="pathPrizeModel"
                type="is-info"
                :step="10"
              ></b-numberinput>
            </div>
          </div>
          <div class="field">
            <label class="label">Destination Prize Value</label>
            <div class="control">
              <b-numberinput
                v-model="destPrizeModel"
                type="is-success"
                :step="10"
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
          <div style="height: 2px; background-color: black" class="my-4"></div>
          <div class="field">
            <p class="is-size-5">Hovered Element</p>
          </div>
          <div class="field">
            <b-tag class="tag-wall" type="is-info" size="is-large"
              >Type: WALL, Prize: {{ getWallPrize }}</b-tag
            >
          </div>
          <div class="field">
            <b-tag class="tag-path" size="is-large"
              >Type: PATH, Prize: {{ getPathPrize }}</b-tag
            >
          </div>
          <div class="field">
            <b-tag class="tag-reward" type="is-info" size="is-large"
              >Type: REWARD, Prize: {{ getRewardPrize }}</b-tag
            >
          </div>
        </div>
      </div>
      <div class="column py-6 grid-container">
        <div v-if="!renderGrid">EMPTY</div>
        <div v-else class="container" id="container-grid">
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
              @click="gridItemClicked(i, j)"
              @dblclick="setPrize(i, j)"
            >
              <!-- <span class="tag is-light">{{ mItem.prize }}</span>
              <span class="tag is-warning">{{ mItem.type }}</span> -->
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
      boxDimen: 50,
      hoveredElement: {},
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
      files: [
        {
          id: 1,
          filename: "Matrix 1",
          json: require("../assets/matrix1.json"),
        },
      ],
      wallPrizeModel: -100,
      pathPrizeModel: -1,
      destPrizeModel: 100,
      gridRowCol: 5,
      matrixModel: [],
      renderGrid: false,
    };
  },
  computed: {
    ...mapGetters([
      "getMatrix",
      "getWallPrize",
      "getPathPrize",
      "getRewardPrize",
    ]),
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
        wallPrize: Number(this.wallPrizeModel),
        pathPrize: Number(this.pathPrizeModel),
        rewardPrize: Number(this.destPrizeModel),
      });
      store.dispatch("actionCreateMatrix", Number(this.gridRowCol));
    },
    selectFile: function (json) {
      console.log("File", json);
      store.dispatch("actionCreateFromJSON", json);
    },
    scaleDiv: function (v) {
      this.boxDimen = v;
    },
  },
};
</script>

<style>
.singleGridItem {
  position: absolute;
  cursor: pointer;
  padding: 0 !important;
}

.fixed-form {
  position: fixed;
}

.grid-container {
  overflow-x: scroll;
  height: 100%;
}

.no-radius {
  border-radius: 0px !important;
  border: 1px solid whitesmoke;
}

.tag-wall {
  background-color: rgb(28, 28, 28) !important ;
}

.tag-path {
  background-color: rgb(224, 224, 224) !important;
}

.tag-reward {
  background-color: rgb(23, 147, 255) !important;
}
</style>