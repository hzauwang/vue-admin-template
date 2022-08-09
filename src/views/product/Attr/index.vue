<template>
  <div class="attr-wrapper">
    <el-card>
      <CategorySelect @getCategoryId="getCategoryId" :show="!isShowTable"></CategorySelect>
    </el-card>
    <el-card>
      <div v-show="isShowTable">
        <el-button type="primary" :disabled="!categoryId.category3Id" @click="addAttr" icon="el-icon-plus">添加属性</el-button>
        <el-table :data="attrInfoList" border>
          <el-table-column label="序号" type="index" width="80" align="center"></el-table-column>
          <el-table-column label="属性名称" prop="attrName" width="150"></el-table-column>
          <el-table-column label="属性值列表">
            <template v-slot="scope">
              <el-tag class="attr-tag" type="success" v-for="attrValue in scope.row.attrValueList" :key="attrValue.id">{{attrValue.valueName}}</el-tag>
            </template>
          </el-table-column>
          <el-table-column label="操作" width="250">
            <template v-slot="scope">
              <el-button type="warning" icon="el-icon-edit" size="mini" @click="updateAttr(scope.row)">修改</el-button>
              <el-button type="danger" icon="el-icon-delete" size="mini">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <div v-show="!isShowTable">
        <el-form :inline="true" ref="" :model="attrInfo">
          <el-form-item label="属性名">
            <el-input placeholder="请输入属性名" v-model="attrInfo.attrName"></el-input>
          </el-form-item>
        </el-form>
        <el-button type="primary" icon="el-icon-plus" @click="addAttrValue" :disabled="!attrInfo.attrName">添加属性值</el-button>
        <el-button @click="isShowTable = true">取消</el-button>
        <el-table :data="attrInfo.attrValueList" class="change-attr-table" border>
          <el-table-column label="序号" type="index" align="center" width="80"></el-table-column>
          <el-table-column label="属性值名称">
            <template v-slot="scope">
              <el-input v-if="scope.row.flag" :ref="scope.$index" v-model="scope.row.valueName" @blur="inputAttr(scope.row)" @keyup.native.enter="inputAttr(scope.row)" size="mini" placeholder="请输入属性值名称"></el-input>
              <span class="attr-name-span" v-else @click="spanAttr(scope)">{{scope.row.valueName}}</span>
            </template>
          </el-table-column>
          <el-table-column label="操作">
            <template v-slot="scope">
              <el-popconfirm @onConfirm="deleteAttrValue(scope.$index)" :title="`确定删除${scope.row.valueName}吗`">
                <el-button slot="reference" type="danger" icon="el-icon-delete" size="mini"></el-button>
              </el-popconfirm>
            </template>
          </el-table-column>
        </el-table>
        <el-button type="primary" @click="addOrUpdateAttr" :disabled="attrInfo.attrValueList.length < 1">保存</el-button>
        <el-button @click="isShowTable = true">取消</el-button>
      </div>
    </el-card>
  </div>
</template>

<script>
import cloneDeep from 'lodash/cloneDeep'
export default {
  name: 'Attr',

  data () {
    return {
      attrInfoList: [],
      isShowTable: true,
      categoryId: {},
      attrInfo: {
        attrName: "",
        attrValueList: [],
        categoryId: 0,
        categoryLevel: 3
      }
    };
  },

  mounted () {

  },

  methods: {
    getCategoryId ({ category1Id, category2Id, category3Id }) {
      this.categoryId = { category1Id, category2Id, category3Id }
      this.getAttrList()
    },
    getAttrList () {
      this.$API.attr.reqAttrInfoList(this.categoryId).then(res => {
        if (res.code === 200) {
          this.attrInfoList = res.data
        } else {
          alert('获取平台属性失败')
        }
      }).catch(error => {
        alert('获取平台属性失败')
      })
    },
    addAttrValue () {
      this.attrInfo.attrValueList.push({
        attrId: this.attrInfo.id,
        valueName: '',
        flag: true
      })
      this.$nextTick(() => {
        this.$refs[this.attrInfo.attrValueList.length - 1].focus()
      })
    },
    addAttr () {
      this.isShowTable = false
      this.attrInfo = {
        attrName: "",
        attrValueList: [],
        categoryId: this.categoryId.category3Id,
        categoryLevel: 3
      }
    },
    updateAttr (row) {
      this.isShowTable = false
      this.attrInfo = cloneDeep(row)
      this.attrInfo.attrValueList.forEach(item => {
        this.$set(item, 'flag', false)
      })
    },
    inputAttr (row) {
      if (row.valueName.trim() === '') {
        this.$message('请输入正确的属性值')
        return
      }
      let isRepeat = this.attrInfo.attrValueList.some(item => {
        if (row !== item) {
          return row.valueName === item.valueName
        }
      })
      if (isRepeat) {
        this.$message('属性值重复')
        return
      }
      row.flag = false
    },
    spanAttr (scope) {
      scope.row.flag = true
      this.$nextTick(() => {
        this.$refs[scope.$index].focus()
      })
    },
    deleteAttrValue (index) {
      this.attrInfo.attrValueList.splice(index, 1)
    },
    addOrUpdateAttr () {
      this.attrInfo.attrValueList = this.attrInfo.attrValueList.filter(item => {
        delete item.flag
        return item.valueName !== ''
      })
      this.$API.attr.reqAddOrUpdateAttr(this.attrInfo).then(res => {
        if (res.code === 200) {
          this.$message.success('提交成功')
          this.getAttrList()
          this.isShowTable = true
        } else {
          this.$message.error('提交失败')
          this.isShowTable = true
        }
      }).catch(error => {
        this.$message.error('提交失败')
        this.isShowTable = true
      })
    }
  },
};
</script>

<style lang="scss" scoped>
.attr-wrapper > :not(:nth-child(1)) {
  margin-top: 20px;
}
.attr-tag {
  margin: 0 10px;
}
.change-attr-table {
  margin: 20px 0;
}
.attr-name-span {
  display: inline-block;
  min-width: 100px;
  min-height: 23px;
}
</style>