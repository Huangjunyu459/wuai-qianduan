<template>
  <div>
    <!-- 面包屑导航区域 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>评论管理</el-breadcrumb-item>
      <el-breadcrumb-item>已审核评论</el-breadcrumb-item>
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
            @clear="getCommentList"
          >
            <el-button
              slot="append"
              icon="el-icon-search"
              @click="findCommentByContentExamine(queryInfo)"
            />
          </el-input>
        </el-col>
        <el-col :span="4">
          <el-button
            type="primary"
            @click="addDialogVisible = true"
          >添加评论</el-button>
        </el-col>
      </el-row>

      <!-- 评论列表区域 -->
      <el-table :data="commentList" border stripe>
        <el-table-column label="序号" type="index" />
        <el-table-column label="评论的id" prop="id" />
        <el-table-column label="文章的id" prop="articleId" />
        <el-table-column label="评论的用户id" prop="userId" />
        <el-table-column label="评论内容" prop="content" />
        <el-table-column label="操作" width="250px">
          <template slot-scope="{ row }">
            <!-- 按钮提示 -->
            <el-tooltip
              effect="dark"
              content="修改评论"
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
              content="删除评论"
              placement="top"
              :enterable="false"
            >
              <!-- 删除按钮 -->
              <el-button
                type="danger"
                icon="el-icon-delete"
                size="mini"
                @click="removeCommentById(row.id)"
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

    <!-- 添加评论的对话框 -->
    <el-dialog
      title="添加评论"
      :visible.sync="addDialogVisible"
      width="50%"
      @close="addDialogClose"
    >
      <!-- 内容主体区域 -->
      <el-form
        ref="addFormRef"
        :model="addForm"
        :rules="addFormRules"
        label-width="120px"
      >
        <el-form-item label="文章id" prop="articleId">
          <el-input v-model="addForm.articleId" />
        </el-form-item>
        <el-form-item label="评论的用户id" prop="userId">
          <el-input v-model="addForm.userId" />
        </el-form-item>
        <el-form-item label="评论内容" prop="content">
          <el-input v-model="addForm.content" />
        </el-form-item>
      </el-form>
      <!-- 底部区域 -->
      <span slot="footer" class="dialog-footer">
        <el-button @click="addDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addComment">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 修改评论对话框 -->
    <el-dialog
      title="修改评论"
      :visible.sync="editDialogVisivle"
      width="50%"
      @close="editDialogClosed"
    >
      <el-form
        ref="editFormRef"
        :model="editForm"
        :rules="editFormRules"
        label-width="120px"
      >
        <el-form-item label="文章id" prop="articleId">
          <el-input v-model="editForm.articleId" />
        </el-form-item>
        <el-form-item label="评论的用户id" prop="userId">
          <el-input v-model="editForm.userId" />
        </el-form-item>
        <el-form-item label="评论内容" prop="content">
          <el-input v-model="editForm.content" />
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editDialogVisivle = false">取 消</el-button>
        <el-button type="primary" @click="editCommentInfo">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data() {
    //  数字验证规则
    var checckNum = (rule, value, cb) => {
      //  验证的正则表达式
      const regNum = /^[0-9]+$/
      if (regNum.test(value)) {
        //    合法的评论id
        return cb()
      }

      cb(new Error('只能是数字'))
    }

    return {
      //  获取评论列表的参数对象
      queryInfo: {
        query: '',
        //  当前的页数
        index: 1,
        //  当前每页显示多少条数据
        size: 5
      },
      //    接受返回的评论列表结果
      commentList: [],
      total: 0,
      // 控制添加评论对话框的显示与隐藏
      addDialogVisible: false,
      //    添加评论的表单数据
      addForm: {
        articleId: '',
        userId: '',
        content: ''
      },
      //    添加表单的验证规则对象
      addFormRules: {
        articleId: [
          { required: true, message: '请输入文章id', trigger: 'blur' },
          { validator: checckNum, trigger: 'blur' },
          {
            min: 1,
            max: 19,
            message: '长度在 1 到 19 个字符',
            trigger: 'blur'
          }
        ],
        userId: [
          { required: true, message: '请输入用户id', trigger: 'blur' },
          { validator: checckNum, trigger: 'blur' },
          {
            min: 1,
            max: 19,
            message: '长度在 1 到 19 个字符',
            trigger: 'blur'
          }
        ],
        content: [
          { required: true, message: '请输入评论内容', trigger: 'blur' },
          {
            min: 1,
            max: 300,
            message: '长度在 1 到 300 个字符',
            trigger: 'blur'
          }
        ]
      },
      //    控制修改对话框的显示与隐藏
      editDialogVisivle: false,
      //    查询到的评论信息保存对象
      editForm: {
        articleId: '',
        userId: '',
        content: ''
      },
      //    修改表单的验证规则对象
      editFormRules: {
        articleId: [
          { required: true, message: '请输入文章id', trigger: 'blur' },
          { validator: checckNum, trigger: 'blur' },
          {
            min: 1,
            max: 19,
            message: '长度在 1 到 19 个字符',
            trigger: 'blur'
          }
        ],
        userId: [
          { required: true, message: '请输入用户id', trigger: 'blur' },
          { validator: checckNum, trigger: 'blur' },
          {
            min: 1,
            max: 19,
            message: '长度在 1 到 19 个字符',
            trigger: 'blur'
          }
        ],
        content: [
          { required: true, message: '请输入评论内容', trigger: 'blur' },
          {
            min: 1,
            max: 300,
            message: '长度在 1 到 300 个字符',
            trigger: 'blur'
          }
        ]
      }
    }
  },
  created() {
    this.getCommentList()
  },
  methods: {
    async getCommentList() {
      const { data: res } = await this.$http.get(
        '/comment/findAllCommentExamine'
      )
      if (res.statue !== 200) {
        return this.$message.error('获取评论列表失败')
      }
      this.commentList = res.data.commentList
      this.total = res.data.commentList.length
    },
    async pagingQueryExamine() {
      const { data: res } = await this.$http.get(
        `/comment/pagingQueryExamine?content=${this.queryInfo.query}&index=${this.queryInfo.index}&size=${this.queryInfo.size}`
      )
      if (res.statue !== 200) {
        return this.$message.error('获取评论列表失败')
      }
      this.commentList = res.data.commentIPage.records
      this.total = res.data.commentIPage.total
    },
    //  监听 pagesize 改变的事件
    handleSizeChange(newSize) {
      this.queryInfo.size = newSize
      this.pagingQueryExamine()
    },
    //  监听 页码值 改变的事件
    handleCurrentChange(newPage) {
      this.queryInfo.index = newPage
      this.pagingQueryExamine()
    },
    //  根据评论名称模糊查询
    async findCommentByContentExamine(queryInfo) {
      const { data: res } = await this.$http.get(
        `/comment/findCommentByContentExamine?content=${queryInfo.query}`
      )
      console.log(res)
      if (res.statue !== 200) {
        return this.$message.error('不存在该评论')
      }
      this.commentList = res.data.commentList
      this.total = res.data.commentList.length
    },
    //  监听添加评论对话框的关闭事件
    addDialogClose() {
      this.$refs.addFormRef.resetFields()
    },
    //  点击按钮，添加新评论
    addComment() {
      this.$refs.addFormRef.validate(async(valid) => {
        if (!valid) return
        //    可以发起添加评论的网络请求
        const { data: res } = await this.$http.post(
          '/comment/addComment',
          this.addForm
        )
        if (res.statue !== 200) {
          return this.$message.error('添加评论失败')
        }
        this.$message.success('添加评论成功')
        //  隐藏添加评论的对话框
        this.addDialogVisible = false
        //  重新获取评论数据
        this.pagingQueryExamine()
      })
    },
    //  展示编辑评论的对话框
    async showEditDialog(id) {
      const { data: res } = await this.$http.get('/comment/getById?id=' + id)
      console.log(id)
      this.editForm = res.data.comment
      this.editDialogVisivle = true
    },
    //  监听修改评论对话框的关闭事件
    editDialogClosed() {
      this.$refs.editFormRef.resetFields()
    },
    //  修改评论信息并提交
    editCommentInfo() {
      this.$refs.editFormRef.validate(async(valid) => {
        if (!valid) return
        //  发起修改评论信息的网络请求
        const { data: res } = await this.$http.post(
          '/comment/updateCommentById',
          this.editForm
        )
        if (res.statue !== 200) {
          return this.$message.error('修改评论失败')
        }
        this.$message.success('修改评论成功')
        //  隐藏修改评论的对话框
        this.editDialogVisivle = false
        //   重新获取评论数据
        this.pagingQueryExamine()
      })
    },
    //    根据 id 删除对应的评论
    async removeCommentById(id) {
      //    弹框询问用户是否删除数据
      const confirmResult = await this.$confirm(
        '此操作将永久删除该评论, 是否继续?',
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
        '/comment/removeCommentById?id=' + id
      )
      if (res.statue !== 200) {
        return this.$message.error('删除评论失败')
      }
      this.$message.success('删除评论成功')
      //   重新获取评论数据
      this.pagingQueryExamine()
    }
  }
}
</script>

<style lang="less" scoped>
</style>
