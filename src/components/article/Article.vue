<template>
  <div>
    <!-- 面包屑导航区域 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>文章管理</el-breadcrumb-item>
      <el-breadcrumb-item>已审核文章</el-breadcrumb-item>
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
              @click="findArticleByTitleExamine(queryInfo)"
            />
          </el-input>
        </el-col>
        <el-col :span="4">
          <el-button
            type="primary"
            @click="addDialogVisible = true"
          >添加文章</el-button>
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
            <img
              alt="封面图片"
              :src="row.articleCover"
              height="50px"
              width="50px"
            >
          </template>
        </el-table-column>
        <el-table-column label="封面连接" prop="articleCover" />
        <el-table-column label="上传的作者id" prop="authorId" />
        <el-table-column label="所属分类" prop="categoryId">
          <template slot-scope="{ row }">
            <div v-show="row.categoryId === 5">文章</div>
          </template>
        </el-table-column>
        <el-table-column label="点赞数" prop="love" />
        <!-- <el-table-column label="创建时间" prop="createTime" />
        <el-table-column label="修改时间" prop="updateTime" /> -->
        <el-table-column label="会员专属" prop="isVip">
          <template slot-scope="{ row }">
            <div v-show="row.isVip === false">非会员</div>
            <div v-show="row.isVip === true">会员</div>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="250px">
          <template slot-scope="{ row }">
            <!-- 按钮提示 -->
            <el-tooltip
              effect="dark"
              content="修改文章"
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
              content="删除文章"
              placement="top"
              :enterable="false"
            >
              <!-- 删除按钮 -->
              <el-button
                type="danger"
                icon="el-icon-delete"
                size="mini"
                @click="removeArticleById(row.id)"
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

    <!-- 添加文章的对话框 -->
    <el-dialog
      title="添加文章"
      :visible.sync="addDialogVisible"
      width="50%"
      @close="addDialogClose"
    >
      <!-- 内容主体区域 -->
      <el-form
        ref="addFormRef"
        :model="addForm"
        :rules="addFormRules"
        label-width="100px"
      >
        <el-form-item label="文章标题" prop="title">
          <el-input v-model="addForm.title" />
        </el-form-item>
        <el-form-item label="文章内容" prop="content">
          <el-input v-model="addForm.content" />
        </el-form-item>
        <el-form-item label="文章封面">
          <el-upload
            ref="articleRef"
            class="upload-demo"
            drag
            name="file"
            action="http://127.0.0.1:8080/oss/uploadArticle"
            :multiple="false"
            :on-success="handleArticleSuccess"
          >
            <i class="el-icon-upload" />
            <div class="el-upload__text">将图片拖到此处，或<em>点击上传</em></div>
          </el-upload>
        </el-form-item>
        <el-form-item label="作者id" prop="authorId">
          <el-input v-model="addForm.authorId" />
        </el-form-item>
        <el-form-item label="会员专属" prop="isVip">
          <el-switch v-model="addForm.isVip" />
        </el-form-item>
      </el-form>
      <!-- 底部区域 -->
      <span slot="footer" class="dialog-footer">
        <el-button @click="addDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addArticle">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 修改文章对话框 -->
    <el-dialog
      title="修改文章"
      :visible.sync="editDialogVisivle"
      width="50%"
      @close="editDialogClosed"
    >
      <el-form
        ref="editFormRef"
        :model="editForm"
        :rules="editFormRules"
        label-width="100px"
      >
        <el-form-item label="文章标题" prop="title">
          <el-input v-model="editForm.title" />
        </el-form-item>
        <el-form-item label="文章内容" prop="content">
          <el-input v-model="editForm.content" />
        </el-form-item>
        <el-form-item label="阿里云地址" prop="articleCover">
          <el-input v-model="editForm.articleCover" />
        </el-form-item>
        <el-form-item label="点赞数" prop="love">
          <el-input v-model="editForm.love" />
        </el-form-item>
        <el-form-item label="会员专属" prop="isVip">
          <el-switch v-model="editForm.isVip" />
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editDialogVisivle = false">取 消</el-button>
        <el-button type="primary" @click="editArticleInfo">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data() {
    //  点赞数id验证规则
    var checckLove = (rule, value, cb) => {
      //  验证的正则表达式
      const regLove = /^[0-9]+$/
      if (regLove.test(value)) {
        //    合法的文章id
        return cb()
      }

      cb(new Error('文章id只能是数字'))
    }

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
      // 控制添加文章对话框的显示与隐藏
      addDialogVisible: false,
      //    添加文章的表单数据
      addForm: {
        title: '',
        content: '',
        articleCover: '',
        authorId: '',
        isVip: false
      },
      //    添加表单的验证规则对象
      addFormRules: {
        title: [
          { required: true, message: '请输入文章标题', trigger: 'blur' },
          {
            min: 1,
            max: 50,
            message: '长度在 1 到 50 个字符',
            trigger: 'blur'
          }
        ],
        content: [
          { required: true, message: '请输入文章内容', trigger: 'blur' },
          {
            min: 20,
            max: 10000,
            message: '长度在 20 到 10000 个字符',
            trigger: 'blur'
          }
        ],
        authorId: [
          { required: true, message: '请输入上传用户id', trigger: 'blur' },
          { validator: checckLove, trigger: 'blur' },
          {
            min: 1,
            max: 19,
            message: '长度在 1 到 19 个字符',
            trigger: 'blur'
          }
        ]
      },
      //    控制修改对话框的显示与隐藏
      editDialogVisivle: false,
      //    查询到的文章信息保存对象
      editForm: {
        title: '',
        content: '',
        articleCover: '',
        love: 0,
        isVip: false
      },
      //    修改表单的验证规则对象
      editFormRules: {
        title: [
          { required: true, message: '请输入文章标题', trigger: 'blur' },
          {
            min: 1,
            max: 50,
            message: '长度在 1 到 50 个字符',
            trigger: 'blur'
          }
        ],
        content: [
          { required: true, message: '请输入文章内容', trigger: 'blur' },
          {
            min: 20,
            max: 10000,
            message: '长度在 20 到 10000 个字符',
            trigger: 'blur'
          }
        ],
        articleCover: [
          { required: true, message: '请输入封面图片连接', trigger: 'blur' },
          {
            min: 10,
            max: 200,
            message: '长度在 10 到 200 个字符',
            trigger: 'blur'
          }
        ],
        love: [
          { required: true, message: '请输入', trigger: 'blur' },
          { validator: checckLove, trigger: 'blur' }
        ]
      }
    }
  },
  created() {
    this.pagingQueryExamine()
  },
  methods: {
    async getArticleList() {
      const { data: res } = await this.$http.get(
        '/article/findAllArticleExamine'
      )
      if (res.statue !== 200) {
        return this.$message.error('获取文章列表失败')
      }
      this.articleList = res.data.articleList
      this.total = res.data.articleList.length
    },
    async pagingQueryExamine() {
      const { data: res } = await this.$http.get(
        `/article/pagingQueryExamine?title=${this.queryInfo.query}&index=${this.queryInfo.index}&size=${this.queryInfo.size}`
      )
      console.log(res)
      if (res.statue !== 200) {
        return this.$message.error('获取文章列表失败')
      }
      this.articleList = res.data.articleIPage.records
      this.total = res.data.articleIPage.total
    },
    handleArticleSuccess(responese) {
      this.addForm.articleCover = responese.data
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
    //  根据文章名称模糊查询
    async findArticleByTitleExamine(queryInfo) {
      const { data: res } = await this.$http.get(
        `/article/findArticleByTitleExamine?title=${queryInfo.query}`
      )
      console.log(res)
      if (res.statue !== 200) {
        return this.$message.error('不存在该文章')
      }
      this.articleList = res.data.articleList
      this.total = res.data.articleList.length
    },
    //  监听添加文章对话框的关闭事件
    addDialogClose() {
      this.$refs.addFormRef.resetFields()
    },
    //  点击按钮，添加新文章
    addArticle() {
      this.$refs.addFormRef.validate(async(valid) => {
        if (!valid) return
        //    可以发起添加文章的网络请求
        const { data: res } = await this.$http.post(
          '/article/addArticle',
          this.addForm
        )
        if (res.statue !== 200) {
          return this.$message.error('添加文章失败')
        }
        this.$refs.articleRef.clearFiles()
        this.$message.success('添加文章成功')
        //  隐藏添加文章的对话框
        this.addDialogVisible = false
        //  重新获取文章数据
        this.pagingQueryExamine()
      })
    },
    //  展示编辑文章的对话框
    async showEditDialog(id) {
      const { data: res } = await this.$http.get('/article/getById?id=' + id)
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
        //   重新获取文章数据
        this.pagingQueryExamine()
      })
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
      //   重新获取文章数据
      this.pagingQueryExamine()
    }
  }
}
</script>

<style lang="less" scoped>
</style>
