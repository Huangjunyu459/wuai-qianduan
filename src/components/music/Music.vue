<template>
  <div>
    <!-- 面包屑导航区域 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>音频管理</el-breadcrumb-item>
      <el-breadcrumb-item>已审核音频</el-breadcrumb-item>
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
            @clear="getMusicList"
          >
            <el-button
              slot="append"
              icon="el-icon-search"
              @click="findMusicBySongExamine(queryInfo)"
            />
          </el-input>
        </el-col>
        <el-col :span="4">
          <el-button
            type="primary"
            @click="addDialogVisible = true"
          >添加音频</el-button>
        </el-col>
      </el-row>

      <!-- 音频列表区域 -->
      <el-table :data="musicList" border stripe>
        <el-table-column label="序号" type="index" />
        <el-table-column label="音频id" prop="id" />
        <el-table-column label="歌手名" prop="singer" />
        <el-table-column label="歌曲名" prop="song" />
        <el-table-column label="阿里云地址" prop="ossSrc" />
        <el-table-column label="上传的作者id" prop="authorId" />
        <el-table-column label="所属分类" prop="categoryId">
          <template slot-scope="{ row }">
            <div v-show="row.categoryId === 4">音频</div>
          </template>
        </el-table-column>
        <el-table-column label="点赞数" prop="love" />
        <el-table-column label="创建时间" prop="createTime" />
        <el-table-column label="修改时间" prop="updateTime" />
        <el-table-column label="操作" width="250px">
          <template slot-scope="{ row }">
            <!-- 按钮提示 -->
            <el-tooltip
              effect="dark"
              content="修改音频"
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
              content="删除音频"
              placement="top"
              :enterable="false"
            >
              <!-- 删除按钮 -->
              <el-button
                type="danger"
                icon="el-icon-delete"
                size="mini"
                @click="removeMusicById(row.id)"
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

    <!-- 添加音频的对话框 -->
    <el-dialog
      title="添加音频"
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
        <el-form-item label="歌手名" prop="singer">
          <el-input v-model="addForm.singer" />
        </el-form-item>
        <el-form-item label="歌曲名" prop="song">
          <el-input v-model="addForm.song" />
        </el-form-item>
        <el-form-item label="阿里云地址" prop="ossSrc">
          <el-input v-model="addForm.ossSrc" />
        </el-form-item>
        <el-form-item label="作者id" prop="authorId">
          <el-input v-model="addForm.authorId" />
        </el-form-item>
      </el-form>
      <!-- 底部区域 -->
      <span slot="footer" class="dialog-footer">
        <el-button @click="addDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addMusic">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 修改音频对话框 -->
    <el-dialog
      title="修改音频"
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
        <el-form-item label="歌手名" prop="singer">
          <el-input v-model="editForm.singer" />
        </el-form-item>
        <el-form-item label="歌曲名" prop="song">
          <el-input v-model="editForm.song" />
        </el-form-item>
        <el-form-item label="阿里云地址" prop="ossSrc">
          <el-input v-model="editForm.ossSrc" />
        </el-form-item>
        <el-form-item label="点赞数" prop="love">
          <el-input v-model="editForm.love" />
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editDialogVisivle = false">取 消</el-button>
        <el-button type="primary" @click="editMusicInfo">确 定</el-button>
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
        //    合法的音频id
        return cb()
      }

      cb(new Error('音频id只能是数字'))
    }
    return {
      //  获取音频列表的参数对象
      queryInfo: {
        query: '',
        //  当前的页数
        index: 1,
        //  当前每页显示多少条数据
        size: 5
      },
      //    接受返回的音频列表结果
      musicList: [],
      total: 0,
      // 控制添加音频对话框的显示与隐藏
      addDialogVisible: false,
      //    添加音频的表单数据
      addForm: {
        singer: '',
        song: '',
        ossSrc: '',
        authorId: ''
      },
      //    添加表单的验证规则对象
      addFormRules: {
        singer: [
          { required: true, message: '请输入歌手名', trigger: 'blur' },
          {
            min: 1,
            max: 50,
            message: '长度在 1 到 50 个字符',
            trigger: 'blur'
          }
        ],
        song: [
          { required: true, message: '请输入歌曲名', trigger: 'blur' },
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
        ]
      },
      //    控制修改对话框的显示与隐藏
      editDialogVisivle: false,
      //    查询到的音频信息保存对象
      editForm: {
        singer: '',
        song: '',
        ossSrc: '',
        love: 0
      },
      //    修改表单的验证规则对象
      editFormRules: {
        singer: [
          { required: true, message: '请输入歌手名', trigger: 'blur' },
          {
            min: 1,
            max: 50,
            message: '长度在 1 到 50 个字符',
            trigger: 'blur'
          }
        ],
        song: [
          { required: true, message: '请输入歌曲名', trigger: 'blur' },
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
            max: 200,
            message: '长度在 10 到 200 个字符',
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
    this.getMusicList()
  },
  methods: {
    async getMusicList() {
      const { data: res } = await this.$http.get('/music/findAllMusicExamine')
      if (res.statue !== 200) {
        return this.$message.error('获取音频列表失败')
      }
      this.musicList = res.data.musicList
      this.total = res.data.musicList.length
    },
    async pagingQueryExamine() {
      const { data: res } = await this.$http.get(
        `/music/pagingQueryExamine?song=${this.queryInfo.query}&index=${this.queryInfo.index}&size=${this.queryInfo.size}`
      )
      console.log(res)
      if (res.statue !== 200) {
        return this.$message.error('获取音频列表失败')
      }
      this.musicList = res.data.musicIPage.records
      this.total = res.data.musicIPage.total
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
    //  根据音频名称模糊查询
    async findMusicBySongExamine(queryInfo) {
      const { data: res } = await this.$http.get(
        `/music/findMusicBySongExamine?song=${queryInfo.query}`
      )
      console.log(res)
      if (res.statue !== 200) {
        return this.$message.error('不存在该音频')
      }
      this.musicList = res.data.musicList
      this.total = res.data.musicList.length
    },
    //  监听添加音频对话框的关闭事件
    addDialogClose() {
      this.$refs.addFormRef.resetFields()
    },
    //  点击按钮，添加新音频
    addMusic() {
      this.$refs.addFormRef.validate(async(valid) => {
        if (!valid) return
        //    可以发起添加音频的网络请求
        const { data: res } = await this.$http.post(
          '/music/addMusic',
          this.addForm
        )
        if (res.statue !== 200) {
          return this.$message.error('添加音频失败')
        }
        this.$message.success('添加音频成功')
        //  隐藏添加音频的对话框
        this.addDialogVisible = false
        //  功能有bug 重新获取音频数据 this.pagingQueryExamine()
        this.getMusicList()
      })
    },
    //  展示编辑音频的对话框
    async showEditDialog(id) {
      const { data: res } = await this.$http.get('/music/getById?id=' + id)
      console.log(res)
      this.editForm = res.data.music
      this.editDialogVisivle = true
    },
    //  监听修改音频对话框的关闭事件
    editDialogClosed() {
      this.$refs.editFormRef.resetFields()
    },
    //  修改音频信息并提交
    editMusicInfo() {
      this.$refs.editFormRef.validate(async(valid) => {
        if (!valid) return
        //  发起修改音频信息的网络请求
        const { data: res } = await this.$http.post(
          '/music/updateMusicById',
          this.editForm
        )
        if (res.statue !== 200) {
          return this.$message.error('修改音频失败')
        }
        this.$message.success('修改音频成功')
        //  隐藏修改音频的对话框
        this.editDialogVisivle = false
        //  功能有bug 重新获取音频数据 this.pagingQueryExamine()
        this.geArticleList()
      })
    },
    //    根据 id 删除对应的音频
    async removeMusicById(id) {
      //    弹框询问用户是否删除数据
      const confirmResult = await this.$confirm(
        '此操作将永久删除该音频, 是否继续?',
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
        '/music/removeMusicById?id=' + id
      )
      if (res.statue !== 200) {
        return this.$message.error('删除音频失败')
      }
      this.$message.success('删除音频成功')
      //  功能有bug 重新获取音频数据 this.pagingQueryExamine()
      this.getMusicList()
    }
  }
}
</script>

<style lang="less" scoped>
</style>
