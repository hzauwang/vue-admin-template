<template>
  <div>
    <svg style="width:800px;height:800px;">
      <!-- x1 y1 第一个点的坐标 x2 y2 第二个点的坐标 -->
      <line x1="100" y1="100" x2="200" y2="200" stroke="red" stroke-width="5"></line>
      <!-- 绘制折线 points参数为所有点的坐标 默认是填充的 使用fill-opacity="0"取消填充 -->
      <polyline points="300 300, 50 100, 120 400, 20 20" fill-opacity="0" stroke="red"></polyline>
      <!-- 绘制矩形 -->
      <rect x="400" y="400" width="100" height="100" fill="pink"></rect>
      <!-- 绘制圆形 -->
      <circle cx="370" cy="95" r="50" style="stroke: cyan;fill: none;"></circle>
      <!-- 绘制椭圆 -->
      <ellipse cx="500" cy="500" rx="100" ry="50"></ellipse>
      <!-- 绘制多边形 -->
      <polygon points="600 100, 700 300, 750 100" stroke="red"></polygon>
      <!-- 绘制任意图形 M 移动到初始位置 L 画线 Z 将结束和开始点闭合 -->
      <path d="M 10 10 L 20 400 L 30 120 L 40 66 Z"></path>
    </svg>
  </div>
</template>

<script>
export default {
  name: 'Canvas',

  data () {
    return {

    };
  },

  mounted () {
    this.init()
  },

  methods: {
    init () {

    }
  },
};
</script>

<style lang="scss" scoped>
</style>