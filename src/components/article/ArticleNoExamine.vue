<template>
  <div>
    <!-- 面包屑导航区域 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>文章管理</el-breadcrumb-item>
      <el-breadcrumb-item>未审核文章</el-breadcrumb-item>
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
            @clear="getArticleList"
          >
            <el-button
              slot="append"
              icon="el-icon-search"
              @click="findArticleByTitleNoExamine(queryInfo)"
            />
          </el-input>
        </el-col>
      </el-row>

      <!-- 文章列表区域 -->
      <el-table :data="articleList" border stripe>
        <el-table-column label="序号" type="index" />
        <el-table-column label="文章id" prop="id" />
        <el-table-column label="文章标题" prop="title" />
        <el-table-column label="文章内容" prop="content" />
        <el-table-column label="封面">
          <template slot-scope="{ row }">
            <img alt="封面图片" :src="row.articleCover" height="50px" width="50px">
          </template>
        </el-table-column>
        <el-table-column label="封面连接" prop="articleCover" />
        <el-table-column label="上传的作者id" prop="authorID" />
        <el-table-column label="所属分类" prop="categoryId">
          <template slot-scope="{ row }">
            <div v-show="row.categoryId === 5">文章</div>
          </template>
        </el-table-column>
        <el-table-column label="点赞数" prop="love" />
        <el-table-column label="创建时间" prop="createTime" />
        <el-table-column label="修改时间" prop="updateTime" />
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
                @click="removeArticleById(row.id)"
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

    <!-- 修改文章对话框 -->
    <el-dialog
      title="预览"
      :visible.sync="editDialogVisivle"
      width="50%"
      @close="editDialogClosed"
    >
      <el-form
        ref="editFormRef"
        :model="editForm"
        label-width="100px"
      >
        <el-form-item label="文章标题">
          <el-input v-model="editForm.title" />
        </el-form-item>
        <el-form-item label="文章内容">
          <el-input v-model="editForm.content" />
        </el-form-item>
        <el-form-item label="文章封面预览">
          <img alt="封面图片" :src="editForm.articleCover" height="200px" width="200px">
          <!-- <el-input v-model="editForm.ossSrc" /> -->
        </el-form-item>
        <el-form-item label="点赞数">
          <el-input v-model="editForm.love" />
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data() {
    return {
      //  获取文章列表的参数对象
      queryInfo: {
        query: '',
        //  当前的页数
        index: 1,
        //  当前每页显示多少条数据
        size: 5
      },
      //    接受返回的文章列表结果
      articleList: [],
      total: 0,
      //    控制修改对话框的显示与隐藏
      editDialogVisivle: false,
      //    查询到的文章信息保存对象
      editForm: {
        title: '',
        content: '',
        articleCover: '',
        love: 0
      }
    }
  },
  created() {
    this.getArticleList()
  },
  methods: {
    async getArticleList() {
      const { data: res } = await this.$http.get('/article/findAllArticleNoExamine')
      if (res.statue !== 200) {
        return this.$message.error('获取文章列表失败')
      }
      this.articleList = res.data.articleList
      this.total = res.data.articleList.length
    },
    async pagingQueryNoExamine() {
      const { data: res } = await this.$http.get(
        `/article/pagingQueryNoExamine?title=${this.queryInfo.query}&index=${this.queryInfo.index}&size=${this.queryInfo.size}`
      )
      console.log(res)
      if (res.statue !== 200) {
        return this.$message.error('获取文章列表失败')
      }
      this.articleList = res.data.articleIPage.records
      this.total = res.data.articleIPage.total
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
    //  根据文章名称模糊查询
    async findArticleByTitleNoExamine(queryInfo) {
      const { data: res } = await this.$http.get(
        `/article/findArticleByTitleNoExamine?title=${queryInfo.query}`
      )
      console.log(res)
      if (res.statue !== 200) {
        return this.$message.error('不存在该文章')
      }
      this.articleList = res.data.articleList
      this.total = res.data.articleList.length
    },
    //  展示编辑文章的对话框
    async showEditDialog(id) {
      const { data: res } = await this.$http.get('/article/getByIdNoExamine?id=' + id)
      console.log(res)
      this.editForm = res.data.article
      this.editDialogVisivle = true
    },
    //  监听修改文章对话框的关闭事件
    editDialogClosed() {
      this.$refs.editFormRef.resetFields()
    },
    //  修改文章信息并提交
    editArticleInfo() {
      this.$refs.editFormRef.validate(async(valid) => {
        if (!valid) return
        //  发起修改文章信息的网络请求
        const { data: res } = await this.$http.post(
          '/article/updateArticleById',
          this.editForm
        )
        if (res.statue !== 200) {
          return this.$message.error('修改文章失败')
        }
        this.$message.success('修改文章成功')
        //  隐藏修改文章的对话框
        this.editDialogVisivle = false
        //  分页功能有bug this.pagingQueryNoExamine()
      })
    },
    //    根据 id 审核对应的文章
    async examine(id) {
      //    弹框询问用户是否过审
      const confirmResult = await this.$confirm(
        '文章已过审, 是否继续?',
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
        '/article/examine?id=' + id
      )
      if (res.statue !== 200) {
        return this.$message.error('审核文章失败')
      }
      this.$message.success('审核文章成功')
      // 分页功能有bug 先不使用 this.pagingQueryNoExamine()
    },

    //    根据 id 删除对应的文章
    async removeArticleById(id) {
      //    弹框询问用户是否删除数据
      const confirmResult = await this.$confirm(
        '此操作将永久删除该文章, 是否继续?',
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
        '/article/removeArticleById?id=' + id
      )
      if (res.statue !== 200) {
        return this.$message.error('删除文章失败')
      }
      this.$message.success('删除文章成功')
      //  分页功能有bug this.pagingQueryNoExamine()
    }
  }
}
</script>

<style lang="less" scoped>
</style>
