<template>
  <div class="spu-wrapper">
    <el-card>
      <CategorySelect @getCategoryId="getCategoryId" :show="scene !== 0"></CategorySelect>
    </el-card>
    <el-card>
      <div v-show="scene === 0">
        <el-button :disabled="!categoryId.category3Id" @click="addSpu" type="primary" icon="el-icon-plus">添加SPU</el-button>
        <el-table :data="spuList">
          <el-table-column label="序号" type="index" align="center" width="80"></el-table-column>
          <el-table-column label="SPU名称" prop="spuName"></el-table-column>
          <el-table-column label="SPU描述" prop="description"></el-table-column>
          <el-table-column label="操作">
            <template v-slot="{row}">
              <HintButton @click="addSku(row)" title="添加sku" type="success" icon="el-icon-plus" size="mini"></HintButton>
              <HintButton @click="updateSpu(row)" title="修改spu" type="warning" icon="el-icon-edit" size="mini"></HintButton>
              <HintButton @click="showSkuList(row)" title="查看当前spu全部sku列表" type="info" icon="el-icon-info" size="mini"></HintButton>
              <el-popconfirm title="这是一段内容确定删除吗？" @onConfirm="deleteSpu(row)">
                <HintButton slot="reference" title="删除spu" type="danger" icon="el-icon-delete" size="mini"></HintButton>
              </el-popconfirm>
            </template>
          </el-table-column>
        </el-table>
        <el-pagination class="my-pagination" :total="total" :current-page="page" :page-size="limit" :page-sizes="[3, 5, 10]" @current-change="getSpuList" @size-change="changeSize" layout="prev, pager, next, jumper, ->, sizes, total"></el-pagination>
      </div>
      <SpuForm v-show="scene === 1" @changeScene="changeSpuScene" ref="spu"></SpuForm>
      <SkuForm v-show="scene === 2" @changeScene="changeSkuScene" ref="sku"></SkuForm>
    </el-card>
    <el-dialog :before-close="closeDialog" :title="`${spu.spuName}的sku列表`" :visible.sync="dialogTableVisible">
      <el-table v-loading="skuTableLoading" :data="skuList" border>
        <el-table-column prop="skuName" label="名称"></el-table-column>
        <el-table-column prop="price" label="价格"></el-table-column>
        <el-table-column prop="weight" label="重量"></el-table-column>
        <el-table-column label="默认图片" width="120">
          <template v-slot="{row}">
            <el-image :src="row.skuDefaultImg"></el-image>
          </template>
        </el-table-column>
      </el-table>
    </el-dialog>
  </div>
</template>

<script>
import SpuForm from "./SpuForm/index.vue";
import SkuForm from "./SkuForm/index.vue";
export default {
  name: "Spu",
  data () {
    return {
      categoryId: {},
      page: 1,
      limit: 3,
      spuList: [],
      total: 0,
      scene: 0,
      dialogTableVisible: false,
      spu: {},
      skuList: [],
      skuTableLoading: false
    };
  },
  mounted () {
  },
  methods: {
    getCategoryId ({ category1Id, category2Id, category3Id }) {
      this.categoryId = { category1Id, category2Id, category3Id };
      this.getSpuList();
    },
    getSpuList (page = 1) {
      this.page = page;
      this.$API.spu.reqSpuList(this.page, this.limit, this.categoryId.category3Id).then(res => {
        if (res.code === 200) {
          this.spuList = res.data.records;
          this.total = res.data.total;
        }
        else {
          this.$message.error("获取SPU数据失败");
        }
      }).catch(error => {
        this.$message.error("获取SPU数据失败");
      });
    },
    changeSize (size) {
      this.limit = size;
      this.getSpuList();
    },
    addSpu () {
      this.scene = 1
      this.$refs.spu.addSpuData(this.categoryId.category3Id)
    },
    updateSpu (row) {
      this.scene = 1
      this.$refs.spu.initSpuData(row)
    },
    changeSpuScene ({ scene, flag }) {
      this.scene = scene
      if (flag === 0) {
        this.getSpuList()
      } else if (flag === 1) {
        this.getSpuList(this.page)
      }
    },
    changeSkuScene ({ scene, flag }) {
      this.scene = scene
    },
    deleteSpu (row) {
      this.$API.spu.reqDeleteSpu(row.id).then(res => {
        if (res.code === 200) {
          this.$message.success('删除成功')
          this.getSpuList(this.spuList.length > 1 ? this.page : this.page - 1)
        } else {
          this.$message.error('删除失败')
        }
      }).catch(error => {
        this.$message.error('删除失败')
      })
    },
    addSku (row) {
      this.scene = 2
      this.$refs.sku.getData({ ...this.categoryId, ...row })
    },
    showSkuList (row) {
      this.skuTableLoading = true
      this.dialogTableVisible = true
      this.spu = row
      this.$API.spu.reqSkuList(row.id).then(res => {
        if (res.code === 200) {
          this.skuTableLoading = false
          this.skuList = res.data
        } else {
          this.skuTableLoading = false
          this.$message.error('获取数据失败')
        }
      }).catch(error => {
        this.skuTableLoading = false
        this.$message.error('获取数据失败')
      })
    },
    closeDialog (done) {
      this.skuList = []
      done()
    }
  },
  components: { SpuForm, SkuForm }
};
</script>

<style lang="scss" scoped>
.spu-wrapper > :not(:nth-child(1)) {
  margin-top: 20px;
}
.my-pagination {
  margin-top: 20px;
  text-align: center;
}
</style>