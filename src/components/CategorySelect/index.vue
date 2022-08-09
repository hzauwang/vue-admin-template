<template>
  <div>
    <el-form :model="cForm" :inline="true" class="demo-form-inline">
      <el-form-item label="一级分类" prop="category1Id">
        <el-select :disabled="show" placeholder="请选择" v-model="cForm.category1Id" @change="changeC1Id">
          <el-option v-for="c1 in category1List" :label="c1.name" :value="c1.id" :key="c1.id"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="二级分类" prop="category2Id">
        <el-select :disabled="show" placeholder="请选择" v-model="cForm.category2Id" @change="changeC2Id">
          <el-option v-for="c2 in category2List" :label="c2.name" :value="c2.id" :key="c2.id"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="三级分类" prop="category3Id">
        <el-select :disabled="show" placeholder="请选择" v-model="cForm.category3Id" @change="changeC3Id">
          <el-option v-for="c3 in category3List" :label="c3.name" :value="c3.id" :key="c3.id"></el-option>
        </el-select>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
export default {
  name: 'CategorySelect',

  data () {
    return {
      category1List: [],
      category2List: [],
      category3List: [],
      cForm: {
        category1Id: '',
        category2Id: '',
        category3Id: ''
      }
    };
  },

  props: ['show'],

  mounted () {
    this.getCategory1List()
  },

  methods: {
    getCategory1List () {
      this.$API.attr.reqCategory1List().then(res => {
        if (res.code === 200) {
          this.category1List = res.data
        } else {
          alert('获取分类数据失败')
        }
      }).catch(error => {
        alert('获取分类数据失败')
      })
    },
    changeC1Id () {
      this.category2List = []
      this.category3List = []
      this.cForm.category2Id = ''
      this.cForm.category3Id = ''
      const { category1Id } = this.cForm
      this.$API.attr.reqCategory2List(category1Id).then(res => {
        if (res.code === 200) {
          this.category2List = res.data
        } else {
          alert('获取分类数据失败')
        }
      }).catch(err => {
        alert('获取分类数据失败')
      })
    },
    changeC2Id () {
      this.category3List = []
      this.cForm.category3Id = ''
      const { category2Id } = this.cForm
      this.$API.attr.reqCategory3List(category2Id).then(res => {
        if (res.code === 200) {
          this.category3List = res.data
        } else {
          alert('获取分类数据失败')
        }
      }).catch(err => {
        alert('获取分类数据失败')
      })
    },
    changeC3Id () {
      this.$emit('getCategoryId', this.cForm)
    }
  },
};
</script>

<style lang="scss" scoped>
</style>