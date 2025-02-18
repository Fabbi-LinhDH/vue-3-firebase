<template>
  <Bar
    :chart-options="chartOptions"
    :chart-data="chartData"
    :chart-id="chartId"
    :dataset-id-key="datasetIdKey"
    :plugins="plugins"
    :css-classes="cssClasses"
    :styles="styles"
    :width="width"
    :height="height"
  />
  <button
    type="button"
    :class="type == 'DAY' ? 'btn btn-primary mr-3' : 'btn btn-info mr-3'"
    @click="type = 'DAY'"
  >
    DAY
  </button>
  <button
    type="button"
    :class="type == '4H' ? 'btn btn-primary mr-3' : 'btn btn-info mr-3'"
    @click="type = '4H'"
  >
    4H
  </button>
  <button
    type="button"
    :class="type == '1H' ? 'btn btn-primary mr-3' : 'btn btn-info mr-3'"
    @click="type = '1H'"
  >
    1H
  </button>
  <button
    type="button"
    :class="type == '15M' ? 'btn btn-primary mr-3' : 'btn btn-info mr-3'"
    @click="type = '15M'"
  >
    15M
  </button>
  <button
    type="button"
    :class="type == '5M' ? 'btn btn-primary mr-3' : 'btn btn-info mr-3'"
    @click="type = '5M'"
  >
    5m
  </button>
</template>

<script>
import { Bar } from "vue-chartjs";
import {
  Chart as ChartJS,
  Title,
  Tooltip,
  Legend,
  BarElement,
  CategoryScale,
  LinearScale,
  LineController,
  PointElement,
  LineElement,
} from "chart.js";
ChartJS.register(
  Title,
  Tooltip,
  Legend,
  BarElement,
  CategoryScale,
  LinearScale,
  LineController,
  PointElement,
  LineElement
);

export default {
  name: "show",
  components: { Bar },
  props: {
    chartId: {
      type: String,
      default: "bar-chart",
    },
    datasetIdKey: {
      type: String,
      default: "label",
    },
    width: {
      type: Number,
      default: 400,
    },
    height: {
      type: Number,
      default: 400,
    },
    cssClasses: {
      default: "",
      type: String,
    },
    styles: {
      type: Object,
      default: () => {},
    },
    plugins: {
      type: Array,
      default: () => [],
    },
    symbol: {
      default: "BTCUSDT",
      type: String,
    },
  },
  data() {
    return {
      // symbol: this.$route.params.symbol ? this.$route.params.symbol : 'BTCUSDT',
      dataFetch: null,
      dataDay: null,
      data4H: null,
      data1H: null,
      data15M: null,
      data5M: null,
      chartData: {
        labels: ["January", "February", "March"],
        datasets: [
          {
            data: [40, 20, 12],
            backgroundColor: "#f87979",
            label: "",
          },
          {
            type: "line",
            label: "test",
            data: [20, 20, 20],
          },
        ],
      },
      chartOptions: {
        responsive: true,
        scales: {
          xAxes: [
            {
              stacked: true,
            },
          ],
          yAxes: [
            {
              stacked: true,
            },
          ],
        },
      },
      type: "DAY",
    };
  },

  methods: {
    getByDay() {
      return this.axios
        .get(
          `https://api.binance.com/api/v1/klines?symbol=${this.symbol}&interval=1d&limit=60`
        )
        .then((res) => res);
    },
    getBy4H() {
      return this.axios.get(
        `https://api.binance.com/api/v1/klines?symbol=${this.symbol}&interval=4h&limit=20`
      );
    },
    getBy1H() {
      return this.axios.get(
        `https://api.binance.com/api/v1/klines?symbol=${this.symbol}&interval=1h&limit=20`
      );
    },
    getBy15M() {
      return this.axios.get(
        `https://api.binance.com/api/v1/klines?symbol=${this.symbol}&interval=15m&limit=20`
      );
    },
    getBy5M() {
      return this.axios.get(
        `https://api.binance.com/api/v1/klines?symbol=${this.symbol}&interval=5m&limit=20`
      );
    },
    async fetchData() {
      console.log(this.symbol);
      let promises = [];
      promises.push(this.getByDay());
      promises.push(this.getBy4H());
      promises.push(this.getBy1H());
      promises.push(this.getBy15M());
      promises.push(this.getBy5M());
      let [dataDay, data4H, data1H, data15M, data5M] = await Promise.all(
        promises
      );
      return { dataDay, data4H, data1H, data15M, data5M };
    },

    fetchDataChar(data, type = "DAY") {
      this.chartData.labels = data.map((ele) => {
        var date = new Date(ele[0]);
        if (type == "4H") {
          return (
            date.getDate() +
            "/" +
            (date.getMonth() + 1) +
            " " +
            date.getHours() +
            ":00"
          );
        } else if (type == "1H") {
          return (
            date.getDate() +
            "/" +
            (date.getMonth() + 1) +
            " " +
            date.getHours() +
            ":00"
          );
        } else if (type == "15M") {
          return (
            date.getDate() +
            "/" +
            (date.getMonth() + 1) +
            " " +
            date.getHours() +
            ":" +
            date.getMinutes()
          );
        } else if (type == "5M") {
          return (
            date.getDate() +
            "/" +
            (date.getMonth() + 1) +
            " " +
            date.getHours() +
            ":" +
            date.getMinutes()
          );
        }
        return date.getDate();
      });
      this.chartData.datasets = [
        {
          type: "bar",
          data: data.map((ele) => ele[5]),
          backgroundColor: "#f87979",
          label: 'Volume',
          hidden: true,
          stack: "combined",
        },
        {
          type: "line",
          label: "Price",
          data: data.map((ele) => ele[1]),
          stack: "combined",
        },
      ];
    },
  },
  watch: {
    type(val) {
      console.log(val);
      if (val == "DAY") {
        this.fetchDataChar(this.dataDay, val);
      } else if (val == "4H") {
        this.fetchDataChar(this.data4H, val);
      } else if (val == "1H") {
        this.fetchDataChar(this.data1H, val);
      } else if (val == "15M") {
        this.fetchDataChar(this.data15M, val);
      } else if (val == "5M") {
        this.fetchDataChar(this.data5M, val);
      }
    },
  },
  mounted() {
    this.dataFetch = this.fetchData().then((res) => {
      this.dataDay = res.dataDay.data;
      this.data4H = res.data4H.data;
      this.data1H = res.data1H.data;
      this.data15M = res.data15M.data;
      this.data5M = res.data5M.data;
      console.log(this.dataDay);

      this.chartData.labels = this.dataDay.map((ele) => {
        var date = new Date(ele[0]);
        return date.getDate();
      });
      this.chartData.datasets = [
        {
          type: "bar",
          data: this.dataDay.map((ele) => ele[5]),
          label: "Volume",
          hidden: true,
          stack: "combined",
        },
        {
          type: "line",
          label: "Price",
          data: this.dataDay.map((ele) => ele[1]),
          stack: "combined",
          borderColor: "#f87979"
        },
      ];
      console.log(this.chartData);
    });
  },
};
</script>

<style>
.edit-form {
  max-width: 300px;
  margin: auto;
}
</style>
