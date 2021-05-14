<template>
  <div>
    TrainPage
    {{ getMatrix }}
    {{ getQValues }}
  </div>
</template>

<script>
import store from "../store";
import { mapGetters } from "vuex";
export default {
  data() {
    return {
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
};
</script>

<style>
</style>