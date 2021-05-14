<template>
  <div>
    <div class="columns">
      <div class="column is-2 pl-6">
        <div class="fixed-form">
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
            <b-field label="Simple">
              <b-select v-model="boxTypeModel" placeholder="Select a name">
                <option
                  v-for="option in selectType"
                  :value="option.id"
                  :key="option.id"
                >
                  {{ option.type }}
                </option>
              </b-select>
            </b-field>
          </div>
          <b-button type="is-primary">Primary</b-button>
        </div>
      </div>
      <div class="column">
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
            >
              <span class="tag is-light">{{ mItem.prize }}</span>
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
import SingleGrid from "../components/SingleGrid";
export default {
  components: {
    /*eslint-disable*/
    SingleGrid,
  },
  data() {
    return {
      selectType: [
        { type: "PATH", id: 1 },
        { type: "WALL", id: 2 },
        { type: "DESTINATION", id: 3 },
      ],
      boxTypeModel: 1,
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
    for (let i = 0; i < this.gridRowCol; i++) {
      this.matrixModel[i] = new Array(this.gridRowCol);
      for (let j = 0; j < this.gridRowCol; j++) {
        this.matrixModel[i][j] = this.wallObject;
      }
    }
    store.commit("update", this.matrixModel);
    store.subscribe(this.subscribtion);
    this.renderGrid = true;
  },
  watch: {
    getMatrix: function (v) {
      console.log("V Update", v);
    },
    gridRowCol: function (v) {
      store.commit("createMatrix", v);
    },
  },
  methods: {
    subscribtion: function (mutation) {
      const { type, payload } = mutation;
      console.log("Mutation", mutation);
      if (type === "toPath") {
        this.renderGrid = true;
        //this.matrixModel = payload; //?????????
        console.log("MATRIX MODEL:", this.matrixModel);
      }
    },
    gridItemClicked: function (i, j) {
      //store.commit("toPath", { i, j });
      this.renderGrid = false;
      store.dispatch("actionToPath", { i, j });
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