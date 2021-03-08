<template>
  <div>
    <!-- 面包屑导航区域 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>用户管理</el-breadcrumb-item>
      <el-breadcrumb-item>用户列表</el-breadcrumb-item>
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
            @clear="getUserList"
          >
            <el-button
              slot="append"
              icon="el-icon-search"
              @click="findUsersByUsername(queryInfo)"
            />
          </el-input>
        </el-col>
        <el-col :span="4">
          <el-button
            type="primary"
            @click="addDialogVisible = true"
          >添加用户</el-button>
        </el-col>
      </el-row>

      <!-- 用户列表区域 -->
      <el-table :data="userList" border stripe>
        <el-table-column label="序号" type="index" />
        <el-table-column label="用户id" prop="id" />
        <el-table-column label="用户名" prop="username" />
        <el-table-column label="邮箱" prop="email" />
        <el-table-column label="密码" prop="password" />
        <el-table-column label="积分" prop="score" />
        <el-table-column label="等级" prop="state">
          <template slot-scope="{ row }">
            <div v-show="row.state === 1">普通用户</div>
            <div v-show="row.state === 2">会员</div>
          </template>
        </el-table-column>
        <el-table-column label="签到状态">
          <template slot-scope="{ row }">
            <div v-show="row.qiandao === 0">未签到</div>
            <div v-show="row.qiandao === 1">已签到</div>
          </template>
        </el-table-column>
        <el-table-column label="创建时间" prop="createTime" />
        <el-table-column label="修改时间" prop="updateTime" />
        <el-table-column label="操作" width="250px">
          <template slot-scope="{ row }">
            <!-- 按钮提示 -->
            <el-tooltip
              effect="dark"
              content="修改用户"
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
              content="删除用户"
              placement="top"
              :enterable="false"
            >
              <!-- 删除按钮 -->
              <el-button
                type="danger"
                icon="el-icon-delete"
                size="mini"
                @click="removeUserById(row.id)"
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

    <!-- 添加用户的对话框 -->
    <el-dialog
      title="添加用户"
      :visible.sync="addDialogVisible"
      width="50%"
      @close="addDialogClose"
    >
      <!-- 内容主体区域 -->
      <el-form
        ref="addFormRef"
        :model="addForm"
        :rules="addFormRules"
        label-width="70px"
      >
        <el-form-item label="用户名" prop="username">
          <el-input v-model="addForm.username" />
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input v-model="addForm.password" />
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="addForm.email" />
        </el-form-item>
      </el-form>
      <!-- 底部区域 -->
      <span slot="footer" class="dialog-footer">
        <el-button @click="addDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="register">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 修改用户对话框 -->
    <el-dialog
      title="修改用户"
      :visible.sync="editDialogVisivle"
      width="50%"
      @close="editDialogClosed"
    >
      <el-form
        ref="editFormRef"
        :model="editForm"
        :rules="editFormRules"
        label-width="70px"
      >
        <el-form-item label="用户名">
          <el-input v-model="editForm.username" disabled />
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input v-model="editForm.password" />
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="editForm.email" />
        </el-form-item>
        <el-form-item label="积分" prop="score">
          <el-input v-model="editForm.score" />
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editDialogVisivle = false">取 消</el-button>
        <el-button type="primary" @click="editUserInfo">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data() {
    //    邮箱验证规则
    var checkEmail = (rule, value, cb) => {
      //  验证邮箱的正则表达式
      const regEamil = /^\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/
      if (regEamil.test(value)) {
        //    合法的邮箱
        return cb()
      }

      cb(new Error('请输入合法的邮箱'))
    }

    //  密码验证规则
    var checkPassword = (rule, value, cb) => {
      //  验证密码的正则表达式
      const regEamil = /^[A-Za-z0-9]+$/
      if (regEamil.test(value)) {
        //    合法的密码
        return cb()
      }

      cb(new Error('密码由字母和数字构成'))
    }

    //  积分验证规则
    var checkScore = (rule, value, cb) => {
      //  验证积分的正则表达式
      const regScore = /^[A-Za-z0-9]+$/
      if (regScore.test(value)) {
        //    合法的积分
        return cb()
      }

      cb(new Error('积分只能是数字'))
    }

    return {
      //  获取用户列表的参数对象
      queryInfo: {
        query: '',
        //  当前的页数
        index: 1,
        //  当前每页显示多少条数据
        size: 5
      },
      //    接受返回的用户列表结果
      userList: [],
      total: 0,
      // 控制添加用户对话框的显示与隐藏
      addDialogVisible: false,
      //    添加用户的表单数据
      addForm: {
        username: '',
        password: '',
        email: ''
      },
      //    添加表单的验证规则对象
      addFormRules: {
        username: [
          { required: true, message: '请输入用户名', trigger: 'blur' },
          {
            min: 3,
            max: 16,
            message: '长度在 3 到 16 个字符',
            trigger: 'blur'
          }
        ],
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' },
          { validator: checkPassword, trigger: 'blur' },
          {
            min: 6,
            max: 16,
            message: '长度在 6 到 16 个字符',
            trigger: 'blur'
          }
        ],
        email: [
          { required: true, message: '请输入邮箱', trigger: 'blur' },
          { validator: checkEmail, trigger: 'blur' },
          {
            min: 6,
            max: 16,
            message: '长度在 6 到 16 个字符',
            trigger: 'blur'
          }
        ]
      },
      //    控制修改对话框的显示与隐藏
      editDialogVisivle: false,
      //    查询到的用户信息保存对象
      editForm: {
        username: '',
        password: '',
        email: '',
        score: 0
      },
      //    修改表单的验证规则对象
      editFormRules: {
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' },
          { validator: checkPassword, trigger: 'blur' }
        ],
        email: [
          { required: true, message: '请输入邮箱', trigger: 'blur' },
          { validator: checkEmail, trigger: 'blur' },
          {
            min: 6,
            max: 20,
            message: '长度在 6 到 20 个字符',
            trigger: 'blur'
          }
        ],
        score: [{ validator: checkScore, trigger: 'blur' }]
      }
    }
  },
  created() {
    this.pagingQuery()
  },
  methods: {
    async getUserList() {
      const { data: res } = await this.$http.get('/admin/findAllUser')
      if (res.statue !== 200) {
        return this.$message.error('获取用户列表失败')
      }
      this.userList = res.data.userList
      this.total = res.data.userList.length
    },
    async pagingQuery() {
      const { data: res } = await this.$http.get(
        `/admin/pagingQuery?username=${this.queryInfo.query}&index=${this.queryInfo.index}&size=${this.queryInfo.size}`
      )
      console.log(res)
      if (res.statue !== 200) {
        return this.$message.error('获取用户列表失败')
      }
      this.userList = res.data.userIPage.records
      this.total = res.data.userIPage.total
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
    //  根据用户名模糊查找
    async findUsersByUsername(queryInfo) {
      const { data: res } = await this.$http.get(
        `/admin/findUsersByUsername?username=${queryInfo.query}`
      )
      console.log(res)
      if (res.statue !== 200) {
        return this.$message.error('不存在该用户')
      }
      this.userList = res.data.userList
      this.total = res.data.userList.length
    },
    //  监听添加用户对话框的关闭事件
    addDialogClose() {
      this.$refs.addFormRef.resetFields()
    },
    //  点击按钮，添加新用户
    register() {
      this.$refs.addFormRef.validate(async(valid) => {
        if (!valid) return
        //    可以发起添加用户的网络请求
        const { data: res } = await this.$http.post(
          '/admin/addUser',
          this.addForm
        )
        if (res.statue !== 200) {
          return this.$message.error('用户名已存在，添加用户失败')
        }
        this.$message.success('添加用户成功')
        //  隐藏添加用户的对话框
        this.addDialogVisible = false
        //  重新获取用户数据
        this.pagingQuery()
      })
    },
    //  展示编辑用户的对话框
    async showEditDialog(id) {
      const { data: res } = await this.$http.get('/admin/findUserById?id=' + id)
      this.editForm = res.data.user
      this.editDialogVisivle = true
    },
    //  监听修改用户对话框的关闭事件
    editDialogClosed() {
      this.$refs.editFormRef.resetFields()
    },
    //  修改用户信息并提交
    editUserInfo() {
      this.$refs.editFormRef.validate(async(valid) => {
        if (!valid) return
        //  发起修改用户信息的网络请求
        const { data: res } = await this.$http.post(
          '/admin/updateUser',
          this.editForm
        )
        if (res.statue !== 200) {
          return this.$message.error('修改用户失败')
        }
        this.$message.success('修改用户成功')
        //  隐藏修改用户的对话框
        this.editDialogVisivle = false
        //  重新获取用户数据
        this.pagingQuery()
      })
    },
    //    根据 id 删除对应的用户
    async removeUserById(id) {
      //    弹框询问用户是否删除数据
      const confirmResult = await this.$confirm(
        '此操作将永久删除该用户, 是否继续?',
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
        '/admin/removeUserById?id=' + id
      )
      if (res.statue !== 200) {
        return this.$message.error('删除用户失败')
      }
      this.$message.success('删除用户成功')
      this.pagingQuery()
    }
  }
}
</script>

<style lang="less" scoped>
</style>
