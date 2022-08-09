<template>
  <div>
    <el-table :data="records" border>
      <el-table-column type="index" label="序号" width="80" align="center"></el-table-column>
      <el-table-column label="名称" prop="skuName"></el-table-column>
      <el-table-column label="描述" prop="skuDesc"></el-table-column>
      <el-table-column label="默认图片" width="110">
        <template v-slot="{row}">
          <el-image :src="row.skuDefaultImg"></el-image>
        </template>
      </el-table-column>
      <el-table-column label="重量" prop="weight" width="80"></el-table-column>
      <el-table-column label="价格" prop="price" width="80"></el-table-column>
      <el-table-column label="操作">
        <template v-slot="{row}">
          <el-button v-if="row.isSale === 0" @click="sale(row)" type="info" icon="el-icon-sort-down" size="mini"></el-button>
          <el-button v-else @click="cancel(row)" type="success" icon="el-icon-sort-up" size="mini"></el-button>
          <el-button @click="edit" type="primary" icon="el-icon-edit" size="mini"></el-button>
          <el-button @click="getSkuInfo(row)" type="info" icon="el-icon-info" size="mini"></el-button>
          <el-button type="danger" icon="el-icon-delete" size="mini"></el-button>
        </template>
      </el-table-column>
    </el-table>

    <el-pagination class="my-pagination" :total="total" :page-sizes="[3, 5, 10]" :current-page="page" :page-size="limit" @current-change="getData" @size-change="changeSize" layout="prev, pager, next, jumper, ->, sizes, total"></el-pagination>

    <el-drawer :visible.sync="drawer" :show-close="false" size="50%">
      <el-row>
        <el-col :span="5">名称</el-col>
        <el-col :span="16">{{skuInfo.skuName}}</el-col>
      </el-row>
      <el-row>
        <el-col :span="5">描述</el-col>
        <el-col :span="16">{{skuInfo.skuDesc}}</el-col>
      </el-row>
      <el-row>
        <el-col :span="5">价格</el-col>
        <el-col :span="16">{{skuInfo.price}}</el-col>
      </el-row>
      <el-row>
        <el-col :span="5">平台属性</el-col>
        <el-col :span="16">
          <el-tag v-for="attr in skuInfo.skuAttrValueList" :key="attr.id" type="success">
            {{attr.attrId}}-{{attr.valueId}}
          </el-tag>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="5">商品图片</el-col>
        <el-col :span="16">
          <el-carousel height="150px">
            <el-carousel-item v-for="item in skuInfo.skuImageList" :key="item.id">
              <el-image :src="item.imgUrl"></el-image>
            </el-carousel-item>
          </el-carousel>
        </el-col>
      </el-row>
    </el-drawer>
  </div>
</template>

<script>
export default {
  name: 'Sku',

  data () {
    return {
      page: 1,
      limit: 3,
      total: 0,
      records: [],
      skuInfo: {},
      drawer: false
    };
  },

  mounted () {
    this.getData()
  },

  methods: {
    getData (pages = 1) {
      this.page = pages
      const { page, limit } = this
      this.$API.sku.reqSkuList(page, limit).then(res => {
        if (res.code === 200) {
          this.records = res.data.records
          this.total = res.data.total
        } else {
          this.$message.error('获取数据失败')
        }
      }).catch(error => {
        this.$message.error('获取数据失败')
      })
    },
    changeSize (size) {
      this.limit = size
      this.getData()
    },
    sale (row) {
      this.$API.sku.reqSale(row.id).then(res => {
        if (res.code === 200) {
          this.$message.success('上架成功')
          this.getData()
        } else {
          this.$message.error('上架失败')
        }
      }).catch(error => {
        this.$message.error('上架失败')
      })
    },
    cancel (row) {
      this.$API.sku.reqCancel(row.id).then(res => {
        if (res.code === 200) {
          this.$message.success('下架成功')
          this.getData()
        } else {
          this.$message.error('下架失败')
        }
      }).catch(error => {
        this.$message.error('下架失败')
      })
    },
    edit () {
      this.$message('开发中')
    },
    getSkuInfo (row) {
      this.$API.sku.reqSkuById(row.id).then(res => {
        if (res.code === 200) {
          this.skuInfo = res.data
          this.drawer = true
        } else {
          this.$message.error('获取数据失败')
        }
      }).catch(error => {
        this.$message.error('获取数据失败')
      })
    }
  },
};
</script>

<style lang="scss" scoped>
.my-pagination {
  margin-top: 20px;
  text-align: center;
}
::v-deep .el-carousel__button {
  width: 10px;
  height: 10px;
  background-color: red;
  border-radius: 50%;
}
</style>
<style>
.el-row .el-col-5 {
  font-size: 18px;
  text-align: right;
}
.el-col {
  margin: 10px;
}
</style>