<template>
  <div>
    <!-- 面包屑导航区域 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>分类管理</el-breadcrumb-item>
      <el-breadcrumb-item>分类列表</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 卡片视图区域 -->
    <el-card>
      <!-- 搜索与添加区域 -->
      <el-row :gutter="20">
        <el-col :span="7">
          <el-input
            v-model="queryInfo.query"
            placeholder="请输入内容"
            clearable
            @clear="getRoleList"
          >
            <el-button
              slot="append"
              icon="el-icon-search"
              @click="findCategoryByCategoryName(queryInfo)"
            />
          </el-input>
        </el-col>
        <el-col :span="4">
          <el-button
            type="primary"
            @click="addDialogVisible = true"
          >添加分类</el-button>
        </el-col>
      </el-row>

      <!-- 分类列表区域 -->
      <el-table :data="categoryList" border stripe>
        <el-table-column label="序号" type="index" />
        <el-table-column label="分类id" prop="id" />
        <el-table-column label="分类名称" prop="categoryName" />
        <el-table-column label="创建时间" prop="createTime" />
        <el-table-column label="修改时间" prop="updateTime" />
        <el-table-column label="操作" width="250px">
          <template slot-scope="{ row }">
            <!-- 按钮提示 -->
            <el-tooltip
              effect="dark"
              content="修改分类"
              placement="top"
              :enterable="false"
            >
              <!-- 修改按钮 -->
              <el-button
                type="primary"
                icon="el-icon-edit"
                size="mini"
                @click="showEditDialog(row.id)"
              >修改</el-button>
            </el-tooltip>
            <el-tooltip
              effect="dark"
              content="删除分类"
              placement="top"
              :enterable="false"
            >
              <!-- 删除按钮 -->
              <el-button
                type="danger"
                icon="el-icon-delete"
                size="mini"
                @click="removeCategoryById(row.id)"
              >删除</el-button>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>

      <!-- 分页区域 -->
      <el-pagination
        :current-page="queryInfo.index"
        :page-sizes="[1, 2, 5, 10]"
        :page-size="queryInfo.size"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
      />
    </el-card>

    <!-- 添加分类的对话框 -->
    <el-dialog
      title="添加分类"
      :visible.sync="addDialogVisible"
      width="50%"
      @close="addDialogClose"
    >
      <!-- 内容主体区域 -->
      <el-form
        ref="addFormRef"
        :model="addForm"
        :rules="addFormRules"
        label-width="80px"
      >
        <el-form-item label="分类id" prop="id">
          <el-input v-model="addForm.id" />
        </el-form-item>
        <el-form-item label="分类名称" prop="categoryName">
          <el-input v-model="addForm.categoryName" />
        </el-form-item>
      </el-form>
      <!-- 底部区域 -->
      <span slot="footer" class="dialog-footer">
        <el-button @click="addDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addCategory">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 修改分类对话框 -->
    <el-dialog
      title="修改分类"
      :visible.sync="editDialogVisivle"
      width="50%"
      @close="editDialogClosed"
    >
      <el-form
        ref="editFormRef"
        :model="editForm"
        :rules="editFormRules"
        label-width="80px"
      >
        <el-form-item label="分类id" prop="id">
          <el-input v-model="editForm.id" disabled />
        </el-form-item>
        <el-form-item label="分类名称" prop="categoryName">
          <el-input v-model="editForm.categoryName" />
        </el-form-item></el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editDialogVisivle = false">取 消</el-button>
        <el-button type="primary" @click="editCategoryInfo">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data() {
    //  分类id验证规则
    var checkCategory = (rule, value, cb) => {
      //  验证的正则表达式
      const regCategory = /^[0-9]+$/
      if (regCategory.test(value)) {
        //    合法的分类id
        return cb()
      }

      cb(new Error('分类id只能是数字'))
    }

    return {
      //  获取分类列表的参数对象
      queryInfo: {
        query: '',
        //  当前的页数
        index: 1,
        //  当前每页显示多少条数据
        size: 5
      },
      //    接受返回的分类列表结果
      categoryList: [],
      total: 0,
      // 控制添加分类对话框的显示与隐藏
      addDialogVisible: false,
      //    添加分类的表单数据
      addForm: {
        id: '',
        categoryName: ''
      },
      //    添加表单的验证规则对象
      addFormRules: {
        id: [
          { required: true, message: '请输入分类id', trigger: 'blur' },
          { validator: checkCategory, trigger: 'blur' }
        ],
        categoryName: [
          { required: true, message: '请输入分类名称', trigger: 'blur' },
          {
            min: 1,
            max: 16,
            message: '长度在 1 到 16 个字符',
            trigger: 'blur'
          }
        ]
      },
      //    控制修改对话框的显示与隐藏
      editDialogVisivle: false,
      //    查询到的分类信息保存对象
      editForm: {
        id: '',
        categoryName: ''
      },
      //    修改表单的验证规则对象
      editFormRules: {
        id: [
          { required: true, message: '请输入分类id', trigger: 'blur' }
        ],
        categoryName: [
          { required: true, message: '请输入分类名称', trigger: 'blur' },
          {
            min: 1,
            max: 20,
            message: '长度在 1 到 20 个字符',
            trigger: 'blur'
          }
        ]
      }
    }
  },
  created() {
    this.pagingQuery()
  },
  methods: {
    async getRoleList() {
      const { data: res } = await this.$http.get('/category/findAllCategory')
      if (res.statue !== 200) {
        return this.$message.error('获取分类列表失败')
      }
      this.categoryList = res.data.categoryList
      this.total = res.data.categoryList.length
    },
    async pagingQuery() {
      const { data: res } = await this.$http.get(
        `/category/pagingQuery?categoryName=${this.queryInfo.query}&index=${this.queryInfo.index}&size=${this.queryInfo.size}`
      )
      console.log(res)
      if (res.statue !== 200) {
        return this.$message.error('获取分类列表失败')
      }
      this.categoryList = res.data.categoryIPage.records
      this.total = res.data.categoryIPage.total
    },
    //  监听 pagesize 改变的事件
    handleSizeChange(newSize) {
      this.queryInfo.size = newSize
      this.pagingQuery()
    },
    //  监听 页码值 改变的事件
    handleCurrentChange(newPage) {
      this.queryInfo.index = newPage
      this.pagingQuery()
    },
    //  根据角色名称模糊查询
    async findCategoryByCategoryName(queryInfo) {
      const { data: res } = await this.$http.get(
        `/category/findCategoryByCategoryName?categoryName=${queryInfo.query}`
      )
      console.log(res)
      if (res.statue !== 200) {
        return this.$message.error('不存在该分类')
      }
      this.categoryList = res.data.categoryList
      this.total = res.data.categoryList.length
    },
    //  监听添加分类对话框的关闭事件
    addDialogClose() {
      this.$refs.addFormRef.resetFields()
    },
    //  点击按钮，添加新分类
    addCategory() {
      this.$refs.addFormRef.validate(async(valid) => {
        if (!valid) return
        //    可以发起添加分类的网络请求
        const { data: res } = await this.$http.post(
          '/category/addCategory',
          this.addForm
        )
        if (res.statue !== 200) {
          return this.$message.error('分类id已存在，添加分类失败')
        }
        this.$message.success('添加分类成功')
        //  隐藏添加分类的对话框
        this.addDialogVisible = false
        //  重新获取分类数据
        this.pagingQuery()
      })
    },
    //  展示编辑分类的对话框
    async showEditDialog(id) {
      const { data: res } = await this.$http.get('/category/getById?id=' + id)
      this.editForm = res.data.category
      this.editDialogVisivle = true
    },
    //  监听修改分类对话框的关闭事件
    editDialogClosed() {
      this.$refs.editFormRef.resetFields()
    },
    //  修改分类信息并提交
    editCategoryInfo() {
      this.$refs.editFormRef.validate(async(valid) => {
        if (!valid) return
        //  发起修改分类信息的网络请求
        const { data: res } = await this.$http.post(
          '/category/updateCategoryById',
          this.editForm
        )
        if (res.statue !== 200) {
          return this.$message.error('修改分类失败')
        }
        this.$message.success('修改分类成功')
        //  隐藏修改分类的对话框
        this.editDialogVisivle = false
        //  重新获取分类数据
        this.pagingQuery()
      })
    },
    //    根据 id 删除对应的分类
    async removeCategoryById(id) {
      //    弹框询问用户是否删除数据
      const confirmResult = await this.$confirm(
        '此操作将永久删除该分类, 是否继续?',
        '提示',
        {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }
      ).catch((err) => err)

      //  如果用户确认删除，则返回值为字符串 confirm
      //   如果用户确认删除，则返回值为字符串 cancel
      //  console.log(confirmResult)
      if (confirmResult !== 'confirm') {
        return this.$message.info('已取消删除')
      }
      const { data: res } = await this.$http.delete(
        '/category/removeCategoryById?id=' + id
      )
      if (res.statue !== 200) {
        return this.$message.error('删除分类失败')
      }
      this.$message.success('删除分类成功')
      this.pagingQuery()
    }
  }
}
</script>

<style lang="less" scoped>
</style>
