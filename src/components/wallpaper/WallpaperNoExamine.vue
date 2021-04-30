<template>
  <div>
    <!-- 面包屑导航区域 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>壁纸管理</el-breadcrumb-item>
      <el-breadcrumb-item>未审核壁纸</el-breadcrumb-item>
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
            @clear="getWallpaperList"
          >
            <el-button
              slot="append"
              icon="el-icon-search"
              @click="findWallpaperByTitleNoExamine(queryInfo)"
            />
          </el-input>
        </el-col>
      </el-row>

      <!-- 壁纸列表区域 -->
      <el-table :data="wallpaperList" border stripe>
        <el-table-column label="序号" type="index" />
        <el-table-column label="id" prop="id" />
        <el-table-column label="壁纸标题" prop="title" />
        <el-table-column label="阿里云地址" prop="ossSrc" />
        <el-table-column label="上传的作者id" prop="authorId" />
        <el-table-column label="所属分类" prop="categoryId">
          <template slot-scope="{ row }">
            <div v-show="row.categoryId === 1">壁纸</div>
          </template>
        </el-table-column>
        <el-table-column label="点赞数" prop="love" />
        <el-table-column label="会员专属" prop="isVip">
          <template slot-scope="{ row }">
            <div v-show="row.isVip === false">非会员</div>
            <div v-show="row.isVip === true">会员</div>
          </template>
        </el-table-column>
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
                @click="removeWallpaperById(row.id,row.authorId)"
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

    <!-- 修改壁纸对话框 -->
    <el-dialog
      title="预览"
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
        <el-form-item label="壁纸标题" prop="title">
          <el-input v-model="editForm.title" />
        </el-form-item>
        <el-form-item label="壁纸预览">
          <img :alt="editForm.title" :src="editForm.ossSrc" height="200px" width="200px">
          <!-- <el-input v-model="editForm.ossSrc" /> -->
        </el-form-item>
        <el-form-item label="点赞数" prop="love">
          <el-input v-model="editForm.love" />
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data() {
    //  点赞数验证规则
    var checckLove = (rule, value, cb) => {
      //  验证的正则表达式
      const regLove = /^[0-9]+$/
      if (regLove.test(value)) {
        //    合法的壁纸id
        return cb()
      }

      cb(new Error('只能是数字'))
    }

    return {
      //  获取壁纸列表的参数对象
      queryInfo: {
        query: '',
        //  当前的页数
        index: 1,
        //  当前每页显示多少条数据
        size: 5
      },
      //    接受返回的壁纸列表结果
      wallpaperList: [],
      total: 0,
      //    控制修改对话框的显示与隐藏
      editDialogVisivle: false,
      //    查询到的壁纸信息保存对象
      editForm: {
        id: '',
        title: '',
        ossSrc: '',
        authorId: '',
        love: 0
      },
      //    修改表单的验证规则对象
      editFormRules: {
        id: [
          { required: true, message: '请输入壁纸id', trigger: 'blur' },
          { validator: checckLove, trigger: 'blur' },
          {
            min: 1,
            max: 19,
            message: '长度在 1 到 19 个字符',
            trigger: 'blur'
          }
        ],
        title: [
          { required: true, message: '请输入壁纸名称', trigger: 'blur' },
          {
            min: 1,
            max: 100,
            message: '长度在 1 到 100 个字符',
            trigger: 'blur'
          }
        ],
        ossSrc: [
          { required: true, message: '请输入阿里云地址', trigger: 'blur' },
          {
            min: 10,
            max: 200,
            message: '长度在 10 到 200 个字符',
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
        ],
        love: [
          { required: true, message: '请输入', trigger: 'blur' },
          { validator: checckLove, trigger: 'blur' }
        ]
      }
    }
  },
  created() {
    this.getWallpaperList()
  },
  methods: {
    async getWallpaperList() {
      const { data: res } = await this.$http.get('/wallpaper/findAllWallpaperNoExamine')
      if (res.statue !== 200) {
        return this.$message.error('获取壁纸列表失败')
      }
      this.wallpaperList = res.data.wallpaperList
      this.total = res.data.wallpaperList.length
    },
    async pagingQueryNoExamine() {
      const { data: res } = await this.$http.get(
        `/wallpaper/pagingQueryNoExamine?title=${this.queryInfo.query}&index=${this.queryInfo.index}&size=${this.queryInfo.size}`
      )
      console.log(res)
      if (res.statue !== 200) {
        return this.$message.error('获取壁纸列表失败')
      }
      this.wallpaperList = res.data.wallpaperIPage.records
      this.total = res.data.wallpaperIPage.total
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
    //  根据壁纸名称模糊查询
    async findWallpaperByTitleNoExamine(queryInfo) {
      const { data: res } = await this.$http.get(
        `/wallpaper/findWallpaperByTitleNoExamine?title=${queryInfo.query}`
      )
      console.log(res)
      if (res.statue !== 200) {
        return this.$message.error('不存在该壁纸')
      }
      this.wallpaperList = res.data.wallpaperList
      this.total = res.data.wallpaperList.length
    },
    //  监听添加壁纸对话框的关闭事件
    addDialogClose() {
      this.$refs.addFormRef.resetFields()
    },
    //  点击按钮，添加新壁纸
    addWallpaper() {
      this.$refs.addFormRef.validate(async(valid) => {
        if (!valid) return
        //    可以发起添加壁纸的网络请求
        const { data: res } = await this.$http.post(
          '/wallpaper/addWallpaper',
          this.addForm
        )
        if (res.statue !== 200) {
          return this.$message.error('添加壁纸失败')
        }
        this.$message.success('添加壁纸成功')
        //  隐藏添加壁纸的对话框
        this.addDialogVisible = false
        //  分页功能有bug this.pagingQueryNoExamine()
      })
    },
    //  展示编辑壁纸的对话框
    async showEditDialog(id) {
      const { data: res } = await this.$http.get('/wallpaper/getByIdNoExamine?id=' + id)
      console.log(res)
      this.editForm = res.data.wallpaper
      this.editDialogVisivle = true
    },
    //  监听修改壁纸对话框的关闭事件
    editDialogClosed() {
      this.$refs.editFormRef.resetFields()
    },
    //  修改壁纸信息并提交
    editGameInfo() {
      this.$refs.editFormRef.validate(async(valid) => {
        if (!valid) return
        //  发起修改壁纸信息的网络请求
        const { data: res } = await this.$http.post(
          '/wallpaper/updateWallpaperById',
          this.editForm
        )
        if (res.statue !== 200) {
          return this.$message.error('修改壁纸失败')
        }
        this.$message.success('修改壁纸成功')
        //  隐藏修改壁纸的对话框
        this.editDialogVisivle = false
        //  分页功能有bug this.pagingQueryNoExamine()
      })
    },
    //    根据 id 审核对应的壁纸
    async examine(id) {
      //    弹框询问用户是否过审
      const confirmResult = await this.$confirm(
        '壁纸已过审, 是否继续?',
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
        '/wallpaper/examine?id=' + id
      )
      if (res.statue !== 200) {
        return this.$message.error('审核壁纸失败')
      }
      this.$message.success('审核壁纸成功')
      // 分页功能有bug 先不使用 this.pagingQueryNoExamine()
    },

    //    根据 id 删除对应的壁纸
    async removeWallpaperById(id, authorId) {
      //    弹框询问用户是否删除数据
      const confirmResult = await this.$confirm(
        '此操作将永久删除该壁纸, 是否继续?',
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
        `/wallpaper/removeWallpaperById?id=${id}&authorId=${authorId}`
      )
      if (res.statue !== 200) {
        return this.$message.error('删除壁纸失败')
      }
      this.$message.success('删除壁纸成功')
      //  分页功能有bug this.pagingQueryNoExamine()
    }
  }
}
</script>

<style lang="less" scoped>
</style>
