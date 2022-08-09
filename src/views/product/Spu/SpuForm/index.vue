<template>
  <el-form label-width="80px">
    <el-form-item label="SPU名称">
      <el-input v-model="spu.spuName" placeholder="SPU名称"></el-input>
    </el-form-item>
    <el-form-item label="品牌">
      <el-select v-model="spu.tmId" placeholder="请选择品牌">
        <el-option v-for="tm in tradeMarkList" :key="tm.id" :label="tm.tmName" :value="tm.id"></el-option>
      </el-select>
    </el-form-item>
    <el-form-item label="SPU描述">
      <el-input v-model="spu.description" type="textarea" placeholder="SPU描述" rows="4"></el-input>
    </el-form-item>
    <el-form-item label="SPU图片">
      <el-upload :file-list="spuImageList" action="/api/admin/product/fileUpload" list-type="picture-card" :on-preview="handlePictureCardPreview" :on-remove="handleRemove" :on-success="handleSuccess">
        <i class="el-icon-plus"></i>
      </el-upload>
      <el-dialog :visible.sync="dialogVisible">
        <img width="100%" :src="dialogImageUrl">
      </el-dialog>
    </el-form-item>
    <el-form-item label="销售属性">
      <el-select v-model="attrIdAndName" :placeholder="`还有${unSelectedSaleAttr.length}项未选择`">
        <el-option v-for="unSelectedItem in unSelectedSaleAttr" :label="unSelectedItem.name" :value="unSelectedItem.id + ':' + unSelectedItem.name" :key="unSelectedItem.id"></el-option>
      </el-select>
      <el-button type="primary" icon="el-icon-plus" :disabled="!attrIdAndName" @click="addSaleAttr">添加销售属性</el-button>
      <el-table border :data="spu.spuSaleAttrList">
        <el-table-column label="序号" width="80" align="center" type="index"></el-table-column>
        <el-table-column label="属性名" prop="saleAttrName"></el-table-column>
        <el-table-column label="属性值名称列表">
          <template v-slot="{row}">
            <el-tag :key="tag.id" v-for="(tag, tagIndex) in row.spuSaleAttrValueList" closable :disable-transitions="false" @close="row.spuSaleAttrValueList.splice(tagIndex, 1)">
              {{tag.saleAttrValueName}}
            </el-tag>
            <el-input class="input-new-tag" v-if="row.inputVisible" v-model="row.inputValue" @blur="handleInputConfirm(row)" ref="saveTagInput" size="small"></el-input>
            <el-button v-else class="button-new-tag" size="small" @click="addSaleAttrValue(row)">添加</el-button>
          </template>
        </el-table-column>
        <el-table-column label="操作">
          <template v-slot="{row, $index}">
            <HintButton @click="spu.spuSaleAttrList.splice($index, 1)" title="删除" type="danger" size="mini" icon="el-icon-delete"></HintButton>
          </template>
        </el-table-column>
      </el-table>
    </el-form-item>
    <el-form-item>
      <el-button type="primary" @click="addOrUpdateSpu">保存</el-button>
      <el-button @click="cancel">取消</el-button>
    </el-form-item>
  </el-form>
</template>

<script>
export default {
  name: 'SpuForm',

  data () {
    return {
      dialogImageUrl: '',
      dialogVisible: false,
      spu: {
        category3Id: 0,
        description: "",
        spuImageList: [],
        spuName: "",
        tmId: 0,
        spuSaleAttrList: []
      },
      tradeMarkList: [],
      spuImageList: [],
      saleAttrList: [],
      attrIdAndName: ''
    };
  },

  computed: {
    unSelectedSaleAttr () {
      return this.saleAttrList.filter(item => {
        return this.spu.spuSaleAttrList.every(selectedItem => {
          return selectedItem.saleAttrName !== item.name
        })
      })
    }
  },

  mounted () {

  },

  methods: {
    handleRemove (_file, fileList) {
      this.spuImageList = fileList
    },
    handlePictureCardPreview (file) {
      this.dialogImageUrl = file.url;
      this.dialogVisible = true;
    },
    handleSuccess (_response, _file, fileList) {
      this.spuImageList = fileList
    },
    initSpuData (spu) {
      Promise.all([
        this.$API.spu.reqSpu(spu.id),
        this.$API.spu.reqTrademarkList(),
        this.$API.spu.reqSpuImageList(spu.id),
        this.$API.spu.reqBaseSaleAttrList()
      ]).then(res => {
        if (res[0].code === 200) {
          this.spu = res[0].data
        } else {
          throw new Error('failed')
        }
        if (res[1].code === 200) {
          this.tradeMarkList = res[1].data
        } else {
          throw new Error('failed')
        }
        if (res[2].code === 200) {
          let imgArr = res[2].data
          imgArr.forEach(item => {
            item.name = item.imgName
            item.url = item.imgUrl
          })
          this.spuImageList = imgArr
        } else {
          throw new Error('failed')
        }
        if (res[3].code === 200) {
          this.saleAttrList = res[3].data
        } else {
          throw new Error('failed')
        }
      }).catch(error => {
        this.$message.error('获取数据失败')
      })
    },
    addSaleAttr () {
      const [baseSaleAttrId, saleAttrName] = this.attrIdAndName.split(':')
      this.spu.spuSaleAttrList.push({
        baseSaleAttrId, saleAttrName, spuSaleAttrValueList: []
      })
      this.attrIdAndName = ''
    },
    addSaleAttrValue (row) {
      this.$set(row, 'inputVisible', true)
      this.$set(row, 'inputValue', '')
    },
    handleInputConfirm (row) {
      if (row.inputValue.trim() === '') {
        this.$message('属性值不能为空')
        return
      }
      const istRepeat = row.spuSaleAttrValueList.every(item => {
        return item.saleAttrValueName !== row.inputValue
      })
      if (!istRepeat) {
        this.$message('属性值不能重复')
        return
      }
      row.inputVisible = false
      const { baseSaleAttrId, inputValue } = row
      row.spuSaleAttrValueList.push({
        baseSaleAttrId, saleAttrValueName: inputValue
      })
    },
    addOrUpdateSpu () {
      this.spu.spuImageList = this.spuImageList.map(item => ({
        imageName: item.name,
        imageUrl: (item.response && item.response.data) || item.url
      }))

      this.$API.spu.reqUpdateOrSaveSpuInfo(this.spu).then(res => {
        if (res.code === 200) {
          this.$message.success('保存spu成功')
          this.$emit('changeScene', {
            scene: 0,
            flag: this.spu.id ? 1 : 0
          })
          Object.assign(this._data, this.$options.data())
        } else {
          this.$message.error('保存spu失败')
        }
      }).catch(error => {
        this.$message.error('保存spu失败')
      })
    },
    addSpuData (category3Id) {
      this.spu.category3Id = category3Id
      Promise.all([
        this.$API.spu.reqTrademarkList(),
        this.$API.spu.reqBaseSaleAttrList()
      ]).then(res => {
        if (res[0].code === 200) {
          this.tradeMarkList = res[0].data
        } else {
          throw new Error('failed')
        }
        if (res[1].code === 200) {
          this.saleAttrList = res[1].data
        } else {
          throw new Error('failed')
        }
      }).catch(error => {
        this.$message.error('获取数据失败')
      })
    },
    cancel () {
      this.$emit('changeScene', { scene: 0 })
      Object.assign(this._data, this.$options.data())
    }
  },
};
</script>

<style>
.el-tag + .el-tag {
  margin-left: 10px;
}
.button-new-tag {
  margin-left: 10px;
  height: 32px;
  line-height: 30px;
  padding-top: 0;
  padding-bottom: 0;
}
.input-new-tag {
  width: 90px;
  margin-left: 10px;
  vertical-align: bottom;
}
</style>
<style lang="scss" scoped>
</style>