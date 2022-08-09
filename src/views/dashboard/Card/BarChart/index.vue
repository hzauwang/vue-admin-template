<template>
  <div class="charts" ref="charts">

  </div>
</template>

<script>
import * as echarts from 'echarts'
export default {
  name: 'BarChart',

  data () {
    return {

    };
  },

  mounted () {
    let lineCharts = echarts.init(this.$refs.charts)
    lineCharts.setOption({
      xAxis: {
        show: false,
        type: 'category'
      },
      yAxis: {
        show: false
      },
      series: [
        {
          type: 'bar',
          data: [3, 2, 3, 4, 2, 4, 1, 2]
        }
      ],
      grid: {
        left: 0,
        top: 0,
        right: 0,
        bottom: 0
      }
    })
  },

  methods: {

  },
};
</script>

<style lang="scss" scoped>
.charts {
  width: 100%;
  height: 50px;
}
</style>