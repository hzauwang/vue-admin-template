<template>
  <el-form>
    <el-form-item label="SPU名称">{{spuName}}</el-form-item>
    <el-form-item label="SKU名称">
      <el-input placeholder="SKU名称" v-model="skuInfo.skuName"></el-input>
    </el-form-item>
    <el-form-item label="价格(元)">
      <el-input type="number" placeholder="价格(元)" v-model="skuInfo.price"></el-input>
    </el-form-item>
    <el-form-item label="重量(千克)">
      <el-input placeholder="重量(千克)" v-model="skuInfo.weight"></el-input>
    </el-form-item>
    <el-form-item label="规格描述">
      <el-input type="textarea" placeholder="规格描述" v-model="skuInfo.skuDesc"></el-input>
    </el-form-item>
    <el-form-item label="平台属性">
      <el-form :inline="true">
        <el-form-item v-for="attr in attrInfoList" :label="attr.attrName" :key="attr.id">
          <el-select v-model="attr.attrIdAndAttrValueId" placeholder="请选择">
            <el-option v-for="attrValue in attr.attrValueList" :key="attrValue.id " :label="attrValue.valueName" :value="`${attr.id}:${attrValue.id}`"></el-option>
          </el-select>
        </el-form-item>
      </el-form>
    </el-form-item>
    <el-form-item label="销售属性">
      <el-form :inline="true">
        <el-form-item v-for="saleAttr in spuSaleAttrList" :label="saleAttr.saleAttrName" :key="saleAttr.id">
          <el-select v-model="saleAttr.attrIdAndValueId" placeholder="请选择">
            <el-option v-for="saleAttrValue in saleAttr.spuSaleAttrValueList" :label="saleAttrValue.saleAttrValueName" :value="`${saleAttr.id}:${saleAttrValue.id}`" :key="saleAttrValue.id"></el-option>
          </el-select>
        </el-form-item>
      </el-form>
    </el-form-item>
    <el-form-item label="图片列表">
      <el-table :data="spuImageList" @selection-change="handleSelectionChange" border>
        <el-table-column type="selection" width="80"></el-table-column>
        <el-table-column label="图片" width="100">
          <template v-slot="{row}">
            <el-image :src="row.imgUrl"></el-image>
          </template>
        </el-table-column>
        <el-table-column label="名称" prop="imgName"></el-table-column>
        <el-table-column label="操作">
          <template v-slot="{row, $index}">
            <el-button type="primary" v-if="row.isDefault === 0" @click="changeDefault(row)">设为默认</el-button>
            <el-tag v-else>默认</el-tag>
          </template>
        </el-table-column>
      </el-table>
    </el-form-item>
    <el-form-item>
      <el-button type="primary" @click="save">保存</el-button>
      <el-button @click="cancel">取消</el-button>
    </el-form-item>
  </el-form>
</template>

<script>
export default {
  name: 'SkuForm',

  data () {
    return {
      spuImageList: [],
      spuSaleAttrList: [],
      attrInfoList: [],
      skuInfo: {
        category3Id: 0,
        spuId: 0,
        tmId: 0,
        skuName: "",
        price: 0,
        weight: '',
        skuDesc: "",
        skuImageList: [],
        skuDefaultImg: "",
        skuSaleAttrValueList: [],
        skuAttrValueList: []
      },
      spuName: '',
      imageList: []
    };
  },

  mounted () {

  },

  methods: {
    getData ({ category1Id, category2Id, category3Id, id, tmId, spuName }) {
      this.skuInfo.category3Id = category3Id
      this.skuInfo.spuId = id
      this.skuInfo.tmId = tmId
      this.spuName = spuName
      Promise.all([
        this.$API.spu.reqSpuImageList(id),
        this.$API.spu.reqSpuSaleAttrList(id),
        this.$API.spu.reqAttrInfoList({ category1Id, category2Id, category3Id })
      ]).then(res => {
        if (res[0].code === 200) {
          this.spuImageList = res[0].data.map(item => ({
            ...item,
            isDefault: 0
          }))
        } else {
          throw new Error('failed')
        }
        if (res[1].code === 200) {
          this.spuSaleAttrList = res[1].data
        } else {
          throw new Error('failed')
        }
        if (res[2].code === 200) {
          this.attrInfoList = res[2].data
        } else {
          throw new Error('failed')
        }
      }).catch(error => {
        this.$message.error('获取数据失败')
      })
    },
    handleSelectionChange (data) {
      this.imageList = data
    },
    changeDefault (row) {
      this.spuImageList.forEach(item => {
        item.isDefault = 0
      })
      row.isDefault = 1
      this.skuInfo.skuDefaultImg = row.imgUrl
    },
    cancel () {
      this.$emit('changeScene', {
        scene: 0
      })
      Object.assign(this._data, this.$options.data())
    },
    save () {
      const { attrInfoList, skuInfo, spuSaleAttrList, imageList } = this
      skuInfo.skuAttrValueList = attrInfoList.reduce((prev, item) => {
        if (item.attrIdAndAttrValueId) {
          const [attrId, valueId] = item.attrIdAndAttrValueId.split(':')
          prev.push({ attrId, valueId })
        }
        return prev
      }, [])
      skuInfo.skuSaleAttrValueList = spuSaleAttrList.reduce((prev, item) => {
        if (item.attrIdAndValueId) {
          const [saleAttrId, saleAttrValueId] = item.attrIdAndValueId.split(':')
          prev.push({ saleAttrId, saleAttrValueId })
        }
        return prev
      }, [])
      skuInfo.skuImageList = imageList.map(item => ({
        imgName: item.imgName,
        imgUrl: item.imgUrl,
        isDefault: item.isDefault,
        spuImgId: item.id
      }))
      this.$API.spu.reqAddSku(skuInfo).then(res => {
        if (res.code === 200) {
          this.$message.success('保存成功')
          this.$emit('changeScene', {
            scene: 0
          })
        } else {
          this.$message.error('保存失败')
        }
      }).catch(error => {
        this.$message.error('保存失败')
      })
    }
  },
};
</script>

<style lang="scss" scoped>
</style>