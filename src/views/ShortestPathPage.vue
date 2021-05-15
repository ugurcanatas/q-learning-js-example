<template>
  <div class="columns">
    <div class="column is-3 py-6 px-6">
      {{ getQValues }}
    </div>
    <div class="column">
      {{ getQValues }}
    </div>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
export default {
  data() {
    return {};
  },
  computed: {
    ...mapGetters(["getMatrix", "getQValues"]),
  },
  methods: {
    findShortestPath: function () {},
  },
};
</script>

<style>
</style>