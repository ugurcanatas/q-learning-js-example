<template>
  <div
    @click="toggle"
    :style="`transform: translateX(${transform}px); background-color: ${item.color};`"
    class="singleGridItem box"
  >
    {{ item.type }}
  </div>
</template>

<script>
export default {
  props: {
    transform: {
      type: Number,
      required: false,
    },
    item: {
      type: Object,
      required: false,
    },
    indexes: {
      type: Array,
      required: false,
    },
  },
  computed: {
    compItem: {
      get: function () {
        return this.item;
      },
      set: function (v) {
        this.item = v;
      },
    },
  },
  data() {
    return {
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
    };
  },
  methods: {
    toggle: function () {
      this.$emit("toggle", this.indexes);
      //this.compItem(this.pathObject);
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
</style>