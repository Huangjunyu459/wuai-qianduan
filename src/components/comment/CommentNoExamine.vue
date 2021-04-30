<template>
  <div>
    <!-- 面包屑导航区域 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>评论管理</el-breadcrumb-item>
      <el-breadcrumb-item>未审核评论</el-breadcrumb-item>
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
              @click="findCommentByContentNoExamine(queryInfo)"
            />
          </el-input>
        </el-col>
      </el-row>

      <!-- 评论列表区域 -->
      <el-table :data="commentList" border stripe>
        <el-table-column label="序号" type="index" />
        <el-table-column label="评论的id" prop="id" />
        <el-table-column label="文章的id" prop="articleId" />
        <el-table-column label="评论的用户id" prop="userId" />
        <el-table-column label="评论内容" prop="content" />
        <el-table-column label="操作" width="300px">
          <template slot-scope="{ row }">
            <!-- 按钮提示 -->
            <el-tooltip
              effect="dark"
              content="预览"
              placement="top"
              :enterable="false"
            >
              <!-- 预览按钮 -->
              <el-button
                type="primary"
                icon="el-icon-edit"
                size="mini"
                @click="showEditDialog(row.id)"
              >预览</el-button>
            </el-tooltip>
            <el-tooltip
              effect="dark"
              content="审核通过"
              placement="top"
              :enterable="false"
            >
              <!-- 审核通过按钮 -->
              <el-button
                type="success"
                icon="el-icon-edit"
                size="mini"
                @click="examine(row.id)"
              >通过</el-button>
            </el-tooltip>
            <el-tooltip
              effect="dark"
              content="审核不通过"
              placement="top"
              :enterable="false"
            >
              <!-- 审核不通过按钮 -->
              <el-button
                type="danger"
                icon="el-icon-delete"
                size="mini"
                @click="removeCommentById(row.id)"
              >不通过</el-button>
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

    <!-- 修改评论对话框 -->
    <el-dialog
      title="预览"
      :visible.sync="editDialogVisivle"
      width="50%"
      @close="editDialogClosed"
    >
      <el-form
        ref="editFormRef"
        :model="editForm"
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
    </el-dialog>
  </div>
</template>

<script>
export default {
  data() {
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
      //    控制修改对话框的显示与隐藏
      editDialogVisivle: false,
      //    查询到的评论信息保存对象
      editForm: {
        articleId: '',
        userId: '',
        content: ''
      }
    }
  },
  created() {
    this.getCommentList()
  },
  methods: {
    async getCommentList() {
      const { data: res } = await this.$http.get('/comment/findAllCommentNoExamine')
      if (res.statue !== 200) {
        return this.$message.error('获取评论列表失败')
      }
      this.commentList = res.data.commentList
      this.total = res.data.commentList.length
    },
    async pagingQueryNoExamine() {
      const { data: res } = await this.$http.get(
        `/comment/pagingQueryNoExamine?content=${this.queryInfo.query}&index=${this.queryInfo.index}&size=${this.queryInfo.size}`
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
      this.pagingQueryNoExamine()
    },
    //  监听 页码值 改变的事件
    handleCurrentChange(newPage) {
      this.queryInfo.index = newPage
      this.pagingQueryNoExamine()
    },
    //  根据评论名称模糊查询
    async findCommentByContentNoExamine(queryInfo) {
      const { data: res } = await this.$http.get(
        `/comment/findCommentByContentNoExamine?content=${queryInfo.query}`
      )
      if (res.statue !== 200) {
        return this.$message.error('不存在该评论')
      }
      this.commentList = res.data.commentList
      this.total = res.data.commentList.length
    },
    //  展示编辑评论的对话框
    async showEditDialog(id) {
      const { data: res } = await this.$http.get('/comment/getByIdNoExamine?id=' + id)
      console.log(res)
      this.editForm = res.data.comment
      this.editDialogVisivle = true
    },
    //  监听修改评论对话框的关闭事件
    editDialogClosed() {
      this.$refs.editFormRef.resetFields()
    },
    //    根据 id 审核对应的评论
    async examine(id) {
      //    弹框询问用户是否过审
      const confirmResult = await this.$confirm(
        '评论已过审, 是否继续?',
        '提示',
        {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }
      ).catch((err) => err)

      //  如果用户确认过审，则返回值为字符串 confirm
      //   如果用户取消过审，则返回值为字符串 cancel
      //  console.log(confirmResult)
      if (confirmResult !== 'confirm') {
        return this.$message.info('已取消过审')
      }
      const { data: res } = await this.$http.get(
        '/comment/examine?id=' + id
      )
      if (res.statue !== 200) {
        return this.$message.error('审核评论失败')
      }
      this.$message.success('审核评论成功')
      // 分页功能有bug 先不使用
      this.pagingQueryNoExamine()
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
      //  分页功能有bug
      this.pagingQueryNoExamine()
    }
  }
}
</script>

<style lang="less" scoped>
</style>
