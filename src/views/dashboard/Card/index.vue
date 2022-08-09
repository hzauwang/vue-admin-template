<template>
  <div>
    <el-row :gutter="10">
      <el-col :span="6">
        <el-card>
          <Detail title="总销售额" content="￥126560">
            <template v-slot:charts>
              <span>周同比&nbsp;&nbsp;56.67%<i class="el-icon-arrow-up"></i></span>
              <span>&nbsp;&nbsp;日同比&nbsp;&nbsp;19.96%<i class="el-icon-arrow-down"></i></span>
            </template>
            <template v-slot:footer>
              <span>日销售额 ￥12345</span>
            </template>
          </Detail>
        </el-card>
      </el-col>
      <el-col :span="6">
        <el-card>
          <Detail title="访问量" content="88460">
            <template v-slot:charts>
              <LineChart></LineChart>
            </template>
            <template v-slot:footer>
              <span>日访问量 12345</span>
            </template>
          </Detail>
        </el-card>
      </el-col>
      <el-col :span="6">
        <el-card>
          <Detail title="支付笔数" content="88460">
            <template v-slot:charts>
              <BarChart></BarChart>
            </template>
            <template v-slot:footer>
              <span>转换率 12%</span>
            </template>
          </Detail>
        </el-card>
      </el-col>
      <el-col :span="6">
        <el-card>
          <Detail title="运营活动效果" content="78%">
            <template v-slot:charts>
              <ProgressChart></ProgressChart>
            </template>
            <template v-slot:footer>
              <span>周同比&nbsp;&nbsp;12%<i class="el-icon-arrow-up"></i></span>
              <span>&nbsp;&nbsp;日同比&nbsp;&nbsp;11%<i class="el-icon-arrow-down"></i></span>
            </template>
          </Detail>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import Detail from './Detail/index.vue';
import LineChart from './lineChart/index.vue'
import BarChart from './BarChart/index.vue';
import ProgressChart from './ProgressChart/index.vue';
export default {
  name: "Card",
  data () {
    return {};
  },
  mounted () {
  },
  methods: {},
  components: { Detail, LineChart, BarChart, ProgressChart }
};
</script>

<style lang="scss" scoped>
</style>