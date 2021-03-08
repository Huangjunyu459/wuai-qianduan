<template>
  <div>
    <!-- 面包屑导航区域 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>游戏管理</el-breadcrumb-item>
      <el-breadcrumb-item>已审核游戏</el-breadcrumb-item>
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
            @clear="getGameList"
          >
            <el-button
              slot="append"
              icon="el-icon-search"
              @click="findGameByGameNameExamine(queryInfo)"
            />
          </el-input>
        </el-col>
        <el-col :span="4">
          <el-button
            type="primary"
            @click="addDialogVisible = true"
          >添加游戏</el-button>
        </el-col>
      </el-row>

      <!-- 游戏列表区域 -->
      <el-table :data="gameList" border stripe>
        <el-table-column label="序号" type="index" />
        <el-table-column label="id" prop="id" />
        <el-table-column label="游戏名称" prop="gameName" />
        <el-table-column label="游戏描述" prop="description" />
        <el-table-column label="百度云盘" prop="bdSrc" />
        <el-table-column label="提取码" prop="bdCode" />
        <el-table-column label="上传的作者id" prop="authorID" />
        <el-table-column label="所属分类" prop="categoryId">
          <template slot-scope="{ row }">
            <div v-show="row.categoryId === 2">游戏</div>
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
              content="修改游戏"
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
              content="删除游戏"
              placement="top"
              :enterable="false"
            >
              <!-- 删除按钮 -->
              <el-button
                type="danger"
                icon="el-icon-delete"
                size="mini"
                @click="removeRoleById(row.id)"
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

    <!-- 添加游戏的对话框 -->
    <el-dialog
      title="添加游戏"
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
        <el-form-item label="游戏名称" prop="gameName">
          <el-input v-model="addForm.gameName" />
        </el-form-item>
        <el-form-item label="游戏描述" prop="description">
          <el-input v-model="addForm.description" />
        </el-form-item>
        <el-form-item label="百度云盘" prop="bdSrc">
          <el-input v-model="addForm.bdSrc" />
        </el-form-item>
        <el-form-item label="提取码" prop="bdCode">
          <el-input v-model="addForm.bdCode" />
        </el-form-item>
        <el-form-item label="作者id" prop="authorId">
          <el-input v-model="addForm.authorId" />
        </el-form-item>
      </el-form>
      <!-- 底部区域 -->
      <span slot="footer" class="dialog-footer">
        <el-button @click="addDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addGame">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 修改游戏对话框 -->
    <el-dialog
      title="修改游戏"
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
        <el-form-item label="游戏id" prop="id">
          <el-input v-model="editForm.id" disabled />
        </el-form-item>
        <el-form-item label="游戏名称" prop="gameName">
          <el-input v-model="editForm.gameName" />
        </el-form-item>
        <el-form-item label="游戏描述" prop="description">
          <el-input v-model="editForm.description" />
        </el-form-item>
        <el-form-item label="百度云盘" prop="bdSrc">
          <el-input v-model="editForm.bdSrc" />
        </el-form-item>
        <el-form-item label="提取码" prop="bdCode">
          <el-input v-model="editForm.bdCode" />
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editDialogVisivle = false">取 消</el-button>
        <el-button type="primary" @click="editGameInfo">确 定</el-button>
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
        //    合法的游戏id
        return cb()
      }

      cb(new Error('游戏id只能是数字'))
    }

    //  提取码验证规则
    var checckCode = (rule, value, cb) => {
      //  验证的正则表达式
      const regCode = /^[A-Za-z0-9]+$/
      if (regCode.test(value)) {
        //    合法的提取码
        return cb()
      }

      cb(new Error('提取码只能是数字或英文'))
    }

    return {
      //  获取游戏列表的参数对象
      queryInfo: {
        query: '',
        //  当前的页数
        index: 1,
        //  当前每页显示多少条数据
        size: 5
      },
      //    接受返回的游戏列表结果
      gameList: [],
      total: 0,
      // 控制添加游戏对话框的显示与隐藏
      addDialogVisible: false,
      //    添加游戏的表单数据
      addForm: {
        id: '',
        gameName: '',
        description: '',
        bdSrc: '',
        bdCode: '',
        authorId: '',
        categoryId: '',
        love: 0
      },
      //    添加表单的验证规则对象
      addFormRules: {
        id: [
          { required: true, message: '请输入游戏id', trigger: 'blur' },
          { validator: checckLove, trigger: 'blur' },
          {
            min: 1,
            max: 19,
            message: '长度在 1 到 19 个字符',
            trigger: 'blur'
          }
        ],
        gameName: [
          { required: true, message: '请输入游戏名称', trigger: 'blur' },
          {
            min: 1,
            max: 16,
            message: '长度在 1 到 16 个字符',
            trigger: 'blur'
          }
        ],
        description: [
          { required: true, message: '请输入游戏描述', trigger: 'blur' },
          {
            min: 20,
            max: 200,
            message: '长度在 20 到 200 个字符',
            trigger: 'blur'
          }
        ],
        bdSrc: [
          { required: true, message: '请输入百度云盘', trigger: 'blur' },
          {
            min: 10,
            max: 200,
            message: '长度在 10 到 200 个字符',
            trigger: 'blur'
          }
        ],
        bdCode: [
          { required: true, message: '请输入提取码', trigger: 'blur' },
          { validator: checckCode, trigger: 'blur' },
          {
            min: 4,
            max: 4,
            message: '长度为 4 个字符',
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
        categoryId: [
          { required: true, message: '请输入所属分类id', trigger: 'blur' },
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
      //    查询到的游戏信息保存对象
      editForm: {
        id: '',
        gameName: '',
        description: '',
        bdSrc: '',
        bdCode: '',
        authorId: '',
        categoryId: '',
        love: 0
      },
      //    修改表单的验证规则对象
      editFormRules: {
        id: [
          { required: true, message: '请输入游戏id', trigger: 'blur' },
          { validator: checckLove, trigger: 'blur' },
          {
            min: 1,
            max: 19,
            message: '长度在 1 到 19 个字符',
            trigger: 'blur'
          }
        ],
        gameName: [
          { required: true, message: '请输入游戏名称', trigger: 'blur' },
          {
            min: 1,
            max: 16,
            message: '长度在 1 到 16 个字符',
            trigger: 'blur'
          }
        ],
        description: [
          { required: true, message: '请输入游戏描述', trigger: 'blur' },
          {
            min: 20,
            max: 200,
            message: '长度在 20 到 200 个字符',
            trigger: 'blur'
          }
        ],
        bdSrc: [
          { required: true, message: '请输入百度云盘', trigger: 'blur' },
          {
            min: 10,
            max: 200,
            message: '长度在 10 到 200 个字符',
            trigger: 'blur'
          }
        ],
        bdCode: [
          { required: true, message: '请输入提取码', trigger: 'blur' },
          { validator: checckCode, trigger: 'blur' },
          {
            min: 4,
            max: 4,
            message: '长度为 4 个字符',
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
        categoryId: [
          { required: true, message: '请输入所属分类id', trigger: 'blur' },
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
          { validator: checckLove, trigger: 'blur' },
          {
            min: 1,
            max: 19,
            message: '长度在 1 到 19 个字符',
            trigger: 'blur'
          }
        ]
      }
    }
  },
  created() {
    this.getGameList()
  },
  methods: {
    async getGameList() {
      const { data: res } = await this.$http.get('/game/findAllGameExamine')
      if (res.statue !== 200) {
        return this.$message.error('获取游戏列表失败')
      }
      this.gameList = res.data.gameList
      this.total = res.data.gameList.length
    },
    async pagingQueryExamine() {
      const { data: res } = await this.$http.get(
        `/game/pagingQueryExamine?gameName=${this.queryInfo.query}&index=${this.queryInfo.index}&size=${this.queryInfo.size}`
      )
      console.log(res)
      if (res.statue !== 200) {
        return this.$message.error('获取游戏列表失败')
      }
      this.gameList = res.data.gameIPage.records
      this.total = res.data.gameIPage.total
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
    //  根据游戏名称模糊查询
    async findGameByGameNameExamine(queryInfo) {
      const { data: res } = await this.$http.get(
        `/game/findGameByGameNameExamine?gameName=${queryInfo.query}`
      )
      console.log(res)
      if (res.statue !== 200) {
        return this.$message.error('不存在该游戏')
      }
      this.gameList = res.data.gameList
      this.total = res.data.gameList.length
    },
    //  监听添加游戏对话框的关闭事件
    addDialogClose() {
      this.$refs.addFormRef.resetFields()
    },
    //  点击按钮，添加新游戏
    addGame() {
      this.$refs.addFormRef.validate(async(valid) => {
        if (!valid) return
        //    可以发起添加游戏的网络请求
        const { data: res } = await this.$http.post(
          '/game/addGame',
          this.addForm
        )
        if (res.statue !== 200) {
          return this.$message.error('添加游戏失败')
        }
        this.$message.success('添加游戏成功')
        //  隐藏添加游戏的对话框
        this.addDialogVisible = false
        //  重新获取游戏数据
        this.pagingQueryExamine()
      })
    },
    //  展示编辑游戏的对话框
    async showEditDialog(id) {
      const { data: res } = await this.$http.get('/game/getById?id=' + id)
      console.log(res)
      this.editForm = res.data.game
      this.editDialogVisivle = true
    },
    //  监听修改游戏对话框的关闭事件
    editDialogClosed() {
      this.$refs.editFormRef.resetFields()
    },
    //  修改游戏信息并提交
    editGameInfo() {
      this.$refs.editFormRef.validate(async(valid) => {
        if (!valid) return
        //  发起修改游戏信息的网络请求
        const { data: res } = await this.$http.post(
          '/game/updateById',
          this.editForm
        )
        if (res.statue !== 200) {
          return this.$message.error('修改游戏失败')
        }
        this.$message.success('修改游戏成功')
        //  隐藏修改游戏的对话框
        this.editDialogVisivle = false
        //  重新获取游戏数据
        this.pagingQueryExamine()
      })
    },
    //    根据 id 删除对应的游戏
    async removeRoleById(id) {
      //    弹框询问用户是否删除数据
      const confirmResult = await this.$confirm(
        '此操作将永久删除该游戏, 是否继续?',
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
        '/game/removeById?id=' + id
      )
      if (res.statue !== 200) {
        return this.$message.error('删除游戏失败')
      }
      this.$message.success('删除游戏成功')
      this.pagingQueryExamine()
    }
  }
}
</script>

<style lang="less" scoped>
</style>
