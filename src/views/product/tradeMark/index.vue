<template>
  <div>
    <el-button type="primary" icon="el-icon-plus" class="plus-btn" @click="showDialog">添加</el-button>

    <el-table :data="list" border>
      <el-table-column type="index" label="序号" width="80px" align="center"></el-table-column>
      <el-table-column label="品跑名称" prop="tmName"></el-table-column>
      <el-table-column label="品牌LOGO">
        <template v-slot="scope">
          <el-image :src="scope.row.logoUrl"></el-image>
        </template>
      </el-table-column>
      <el-table-column label="操作">
        <template v-slot="scope">
          <el-button @click="updateTradeMark(scope.row)" type="warning" icon="el-icon-edit" size="mini">修改</el-button>
          <el-button @click="deleteTradeMark(scope.row)" type="danger" icon="el-icon-delete" size="mini">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <el-pagination class="my-pagination" :total="total" :page-sizes="[3, 10, 20, 50]" :current-page="page" :page-size="limit" @current-change="getPageList" @size-change="changeSize" layout="prev, pager, next, jumper, ->, sizes, total"></el-pagination>

    <el-dialog :title="tmForm.id ? '修改品牌' : '添加品牌'" :visible.sync="dialogFormVisible">
      <el-form ref="tmForm" class="dialog-form" :model="tmForm" :rules="rules">

        <el-form-item prop="tmName" label="品牌名称" label-width="100px">
          <el-input v-model="tmForm.tmName" autocomplete="off"></el-input>
        </el-form-item>

        <el-form-item prop="logoUrl" label="品牌LOGO" label-width="100px">
          <el-upload class="avatar-uploader" action="/api/admin/product/fileUpload" :show-file-list="false" :on-success="handleAvatarSuccess" :before-upload="beforeAvatarUpload">
            <img v-if="tmForm.logoUrl" :src="tmForm.logoUrl" class="avatar">
            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
            <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div>
          </el-upload>
        </el-form-item>

      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="addOrUpdateTradeMark">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: 'tradeMark',

  data () {
    const validateTmName = (rule, value, callback) => {
      if (value.length < 2 || value.length > 10) {
        callback(new Error('品牌名称的长度在2-10之间'))
      } else {
        callback()
      }
    }
    return {
      page: 1,
      limit: 3,
      total: 0,
      list: [],
      dialogFormVisible: false,
      imageUrl: '',
      tmForm: {
        tmName: '',
        logoUrl: ''
      },
      rules: {
        tmName: [
          { required: true, message: '请输入品牌名称', trigger: 'blur' },
          { validator: validateTmName, trigger: 'change' }
        ],
        logoUrl: [
          { required: true, message: '请选择图片' }
        ]
      }
    };
  },

  mounted () {
    this.getPageList()
  },

  methods: {
    getPageList (pager = 1) {
      this.page = pager
      this.$API.tradeMark.reqTradeMarkList(this.page, this.limit).then(res => {
        if (res.code === 200) {
          this.total = res.data.total
          this.list = res.data.records
        } else {
          alert('获取数据失败')
        }
      }).catch(error => {
        alert('获取数据失败')
      })
    },
    changeSize (limit) {
      this.limit = limit
      this.getPageList()
    },
    showDialog () {
      this.tmForm = { tmName: '', logoUrl: '' }
      this.dialogFormVisible = true
    },
    updateTradeMark (row) {
      this.tmForm = { ...row }
      this.dialogFormVisible = true
    },
    handleAvatarSuccess (res, file) {
      this.tmForm.logoUrl = res.data
    },
    beforeAvatarUpload (file) {
      const isJPG = file.type === 'image/jpeg';
      const isLt2M = file.size / 1024 / 1024 < 2;

      if (!isJPG) {
        this.$message.error('上传头像图片只能是 JPG 格式!');
      }
      if (!isLt2M) {
        this.$message.error('上传头像图片大小不能超过 2MB!');
      }
      return isJPG && isLt2M;
    },
    addOrUpdateTradeMark () {
      this.$refs.tmForm.validate((valid) => {
        if (valid) {
          this.dialogFormVisible = false
          this.$API.tradeMark.reqAddOrUpdateTradeMark(this.tmForm).then(res => {
            if (res.code === 200) {
              this.$message.success(this.tmForm.id ? '修改成功' : '添加成功')
              this.getPageList(this.tmForm.id ? this.page : 1)
            } else {
              this.$message.error('操作失败')
            }
          }).catch(err => {
            this.$message.error('操作失败')
          })
        } else {
          return false
        }
      })
    },
    deleteTradeMark (row) {
      this.$confirm(`确定删除${row.tmName}?`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$API.tradeMark.reqDeleteTradeMark(row.id).then(res => {
          if (res.code === 200) {
            this.$message({
              type: 'success',
              message: '删除成功!'
            });
            this.getPageList(this.list.length > 1 ? this.page : this.page - 1)
          } else {
            this.$message({
              type: 'error',
              message: '删除失败'
            });
          }
        }).catch(() => {
          this.$message({
            type: 'error',
            message: '删除失败'
          });
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        });
      });
    }
  },
};
</script>

<style>
.avatar-uploader .el-upload {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}
.avatar-uploader .el-upload:hover {
  border-color: #409eff;
}
.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 178px;
  height: 178px;
  line-height: 178px;
  text-align: center;
}
.avatar {
  width: 178px;
  height: 178px;
  display: block;
}
</style>
<style lang="scss" scoped>
.plus-btn {
  margin: 10px 0;
}
.my-pagination {
  margin-top: 20px;
  text-align: center;
}
.dialog-form {
  width: 80%;
}
</style>