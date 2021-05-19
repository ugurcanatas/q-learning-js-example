
<script>
import { Line } from "vue-chartjs";
import { mapGetters } from "vuex";
export default {
  extends: Line,
  props: {
    data: {
      type: Object,
    },
    scales: {
      type: Object,
    },
  },
  data() {
    return {
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {},
      },
    };
  },
  computed: {
    ...mapGetters([""]),
  },
  created() {
    console.log("Props", this.data);
  },
  mounted() {
    this.options.scales = this.scales;
    this.renderChart(this.data, this.options);
  },
};
</script>

<style>
</style>