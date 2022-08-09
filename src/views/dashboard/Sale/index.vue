<template>
  <div>
    <el-card>
      <div slot="header" class="clearfix">
        <el-tabs v-model="activeName" class="tab">
          <el-tab-pane label="销售额" name="1"></el-tab-pane>
          <el-tab-pane label="访问量" name="2"></el-tab-pane>
        </el-tabs>
        <div class="right">
          <span>今日</span>
          <span>本周</span>
          <span>本月</span>
          <span>本年</span>
          <el-date-picker class="my-data-pinker" size="mini" type="daterange" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期">
          </el-date-picker>
        </div>
      </div>
      <div>
        <el-row :gutter="10">
          <el-col :span="16">
            <div class="charts" ref="charts"></div>
          </el-col>
          <el-col :span="8">
            <h3>门店销售额排名</h3>
          </el-col>
        </el-row>
      </div>
    </el-card>
  </div>
</template>

<script>
import * as echarts from 'echarts'
export default {
  name: 'Sale',

  data () {
    return {
      activeName: '1'
    };
  },

  mounted () {
    let myChart = echarts.init(this.$refs.charts)
    myChart.setOption({
      title: {
        text: '销售额趋势'
      },
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          type: 'shadow'
        }
      },
      grid: {
        left: '3%',
        right: '4%',
        bottom: '3%',
        containLabel: true
      },
      xAxis: [
        {
          type: 'category',
          data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
          axisTick: {
            alignWithLabel: true
          }
        }
      ],
      yAxis: [
        {
          type: 'value'
        }
      ],
      series: [
        {
          name: 'Direct',
          type: 'bar',
          barWidth: '60%',
          data: [10, 52, 200, 334, 390, 330, 220]
        }
      ]
    })
  },

  methods: {

  },
};
</script>

<style lang="scss" scoped>
.clearfix {
  position: relative;
  display: flex;
  justify-content: space-between;
}
::v-deep .el-card__header {
  border-bottom: none;
}
.tab {
  width: 100%;
}
.right {
  position: absolute;
  right: 0;

  span {
    margin: 0 10px;
  }
}
.my-data-pinker {
  width: 200px;
}
.charts {
  width: 100%;
  height: 300px;
}
</style>