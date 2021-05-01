<template>
  <div>
    <!-- 面包屑导航区域 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>视频管理</el-breadcrumb-item>
      <el-breadcrumb-item>已审核视频</el-breadcrumb-item>
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
            @clear="getVideoList"
          >
            <el-button
              slot="append"
              icon="el-icon-search"
              @click="findVideoByVideoNameExamine(queryInfo)"
            />
          </el-input>
        </el-col>
        <el-col :span="4">
          <el-button
            type="primary"
            @click="addDialogVisible = true"
          >添加视频</el-button>
        </el-col>
      </el-row>

      <!-- 视频列表区域 -->
      <el-table :data="videoList" border stripe>
        <el-table-column label="序号" type="index" />
        <el-table-column label="视频id" prop="id" />
        <el-table-column label="视频名" prop="videoName" />
        <el-table-column label="oss视频名" prop="ossName" />
        <el-table-column label="阿里云地址" prop="ossSrc" />
        <el-table-column label="上传的作者id" prop="authorId" />
        <el-table-column label="所属分类" prop="categoryId">
          <template slot-scope="{ row }">
            <div v-show="row.categoryId === 3">视频</div>
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
        <el-table-column label="操作" width="250px">
          <template slot-scope="{ row }">
            <!-- 按钮提示 -->
            <el-tooltip
              effect="dark"
              content="修改视频"
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
              content="删除视频"
              placement="top"
              :enterable="false"
            >
              <!-- 删除按钮 -->
              <el-button
                type="danger"
                icon="el-icon-delete"
                size="mini"
                @click="removeVideoById(row.id)"
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

    <!-- 添加视频的对话框 -->
    <el-dialog
      title="添加视频"
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
        <el-form-item label="视频名" prop="videoName">
          <el-input v-model="addForm.videoName" />
        </el-form-item>
        <el-form-item label="oss视频名" prop="ossName">
          <el-input v-model="addForm.ossName" />
        </el-form-item>
        <el-form-item label="视频文件">
          <el-upload
            ref="videoRef"
            class="upload-demo"
            drag
            name="file"
            action="http://127.0.0.1:8080/oss/uploadVideo"
            :multiple="false"
            :on-success="handleVideoSuccess"
          >
            <i class="el-icon-upload" />
            <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
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
        <el-button type="primary" @click="addVideo">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 修改视频对话框 -->
    <el-dialog
      title="修改视频"
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
        <el-form-item label="视频名" prop="videoName">
          <el-input v-model="editForm.videoName" />
        </el-form-item>
        <el-form-item label="阿里云地址" prop="ossSrc">
          <el-input v-model="editForm.ossSrc" />
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
        <el-button type="primary" @click="editVideoInfo">确 定</el-button>
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
        //    合法的视频id
        return cb()
      }

      cb(new Error('视频id只能是数字'))
    }
    return {
      //  获取视频列表的参数对象
      queryInfo: {
        query: '',
        //  当前的页数
        index: 1,
        //  当前每页显示多少条数据
        size: 5
      },
      //    接受返回的视频列表结果
      videoList: [],
      total: 0,
      // 控制添加视频对话框的显示与隐藏
      addDialogVisible: false,
      //    添加视频的表单数据
      addForm: {
        videoName: '',
        ossSrc: '',
        authorId: '',
        isVip: false
      },
      //    添加表单的验证规则对象
      addFormRules: {
        videoName: [
          { required: true, message: '请输入视频名', trigger: 'blur' },
          {
            min: 1,
            max: 50,
            message: '长度在 1 到 50 个字符',
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
      //    查询到的视频信息保存对象
      editForm: {
        videoName: '',
        ossSrc: '',
        love: 0,
        isVip: false
      },
      //    修改表单的验证规则对象
      editFormRules: {
        videoName: [
          { required: true, message: '请输入视频名', trigger: 'blur' },
          {
            min: 1,
            max: 50,
            message: '长度在 1 到 50 个字符',
            trigger: 'blur'
          }
        ],
        ossSrc: [
          { required: true, message: '阿里云地址', trigger: 'blur' },
          {
            min: 10,
            max: 300,
            message: '长度在 10 到 300 个字符',
            trigger: 'blur'
          }
        ],
        love: [
          { required: true, message: '请输入点赞数', trigger: 'blur' },
          { validator: checckLove, trigger: 'blur' }
        ]
      }
    }
  },
  created() {
    this.getVideoList()
  },
  methods: {
    async getVideoList() {
      const { data: res } = await this.$http.get('/video/findAllVideoExamine')
      if (res.statue !== 200) {
        return this.$message.error('获取视频列表失败')
      }
      this.videoList = res.data.videoList
      this.total = res.data.videoList.length
    },
    async pagingQueryExamine() {
      const { data: res } = await this.$http.get(
        `/video/pagingQueryExamine?videoName=${this.queryInfo.query}&index=${this.queryInfo.index}&size=${this.queryInfo.size}`
      )
      console.log(res)
      if (res.statue !== 200) {
        return this.$message.error('获取视频列表失败')
      }
      this.videoList = res.data.videoIPage.records
      this.total = res.data.videoIPage.total
    },
    handleVideoSuccess(responese) {
      this.addForm.ossSrc = responese.data
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
    //  根据视频名称模糊查询
    async findVideoByVideoNameExamine(queryInfo) {
      const { data: res } = await this.$http.get(
        `/video/findVideoByVideoNameExamine?videoName=${queryInfo.query}`
      )
      console.log(res)
      if (res.statue !== 200) {
        return this.$message.error('不存在该视频')
      }
      this.videoList = res.data.videoList
      this.total = res.data.videoList.length
    },
    //  监听添加视频对话框的关闭事件
    addDialogClose() {
      this.$refs.addFormRef.resetFields()
    },
    //  点击按钮，添加新视频
    addVideo() {
      this.$refs.addFormRef.validate(async(valid) => {
        if (!valid) return
        //    可以发起添加视频的网络请求
        const { data: res } = await this.$http.post(
          '/video/addVideo',
          this.addForm
        )
        if (res.statue !== 200) {
          return this.$message.error('添加视频失败')
        }
        this.$message.success('添加视频成功')
        //  隐藏添加视频的对话框
        this.addDialogVisible = false
        //  功能有bug 重新获取视频数据 this.pagingQueryExamine()
        this.getVideoList()
      })
    },
    //  展示编辑视频的对话框
    async showEditDialog(id) {
      const { data: res } = await this.$http.get('/video/getById?id=' + id)
      console.log(res)
      this.editForm = res.data.video
      this.editDialogVisivle = true
    },
    //  监听修改视频对话框的关闭事件
    editDialogClosed() {
      this.$refs.editFormRef.resetFields()
    },
    //  修改视频信息并提交
    editVideoInfo() {
      this.$refs.editFormRef.validate(async(valid) => {
        if (!valid) return
        //  发起修改视频信息的网络请求
        const { data: res } = await this.$http.post(
          '/video/updateVideoById',
          this.editForm
        )
        if (res.statue !== 200) {
          return this.$message.error('修改视频失败')
        }
        this.$refs.videoRef.clearFiles()
        this.$message.success('修改视频成功')
        //  隐藏修改视频的对话框
        this.editDialogVisivle = false
        //  重新获取游戏数据
        this.pagingQueryExamine()
      })
    },
    //    根据 id 删除对应的视频
    async removeVideoById(id) {
      //    弹框询问用户是否删除数据
      const confirmResult = await this.$confirm(
        '此操作将永久删除该视频, 是否继续?',
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
        '/video/removeVideoById?id=' + id
      )
      if (res.statue !== 200) {
        return this.$message.error('删除视频失败')
      }
      this.$message.success('删除视频成功')
      //  功能有bug 重新获取视频数据 this.pagingQueryExamine()
      this.getVideoList()
    }
  }
}
</script>

<style lang="less" scoped>
</style>
