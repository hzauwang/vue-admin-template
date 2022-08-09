<template>
  <a :title="title">
    <el-button v-bind="$attrs" v-on="$listeners"></el-button>
  </a>
</template>

<script>
export default {
  name: 'HintButton',

  data () {
    return {

    };
  },

  props: ['title'],

  mounted () {

  },

  methods: {

  },
};
</script>

<style lang="scss" scoped>
a {
  margin: 10px;
}
</style>