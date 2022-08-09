<template>
  <div>
    <div class="card-header">
      <span>{{title}}</span>
      <i class="el-icon-info"></i>
    </div>
    <div class="card-content">{{content}}</div>
    <div class="card-charts">
      <slot name="charts"></slot>
    </div>
    <div class="card-footer">
      <slot name="footer"></slot>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Detail',

  data () {
    return {

    };
  },

  props: ['title', 'content'],

  mounted () {

  },

  methods: {

  },
};
</script>

<style scoped>
.card-header {
  display: flex;
  justify-content: space-between;
  color: #919090;
}
.card-content {
  font-size: 30px;
  padding: 10px 0;
}
.card-charts {
  height: 50px;
}
.card-footer {
  border-bottom: 1px solid #eee;
}
</style>