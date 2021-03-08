<template>
  <div>
    <!-- 面包屑导航区域 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>角色管理</el-breadcrumb-item>
      <el-breadcrumb-item>已删除角色</el-breadcrumb-item>
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
            @clear="findIsDelete"
          >
            <el-button
              slot="append"
              icon="el-icon-search"
              @click="findRoleByRoleNameIsDelete(queryInfo)"
            />
          </el-input>
        </el-col>
      </el-row>

      <!-- 角色列表区域 -->
      <el-table :data="roleList" border stripe>
        <el-table-column label="序号" type="index" />
        <el-table-column label="id" prop="id" />
        <el-table-column label="角色id" prop="roleId" />
        <el-table-column label="角色名称" prop="roleName" />
        <el-table-column label="创建时间" prop="createTime" />
        <el-table-column label="修改时间" prop="updateTime" />
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
  </div>
</template>

<script>
export default {
  data() {
    return {
      //  获取角色列表的参数对象
      queryInfo: {
        query: '',
        //  当前的页数
        index: 1,
        //  当前每页显示多少条数据
        size: 5
      },
      //    接受返回的角色列表结果
      roleList: [],
      total: 0
    }
  },
  created() {
    this.findIsDelete()
  },
  methods: {
    async findIsDelete() {
      const { data: res } = await this.$http.get('/roles/findIsDelete')
      if (res.statue !== 200) {
        return this.$message.error('获取角色列表失败')
      }
      this.roleList = res.data.rolesList
      this.total = res.data.rolesList.length
    },
    async pagingQueryIsDelete() {
      const { data: res } = await this.$http.get(
        `/roles/pagingQueryIsDelete?roleName=${this.queryInfo.query}&index=${this.queryInfo.index}&size=${this.queryInfo.size}`
      )
      console.log(res)
      if (res.statue !== 200) {
        return this.$message.error('获取角色列表失败')
      }
      this.roleList = res.data.rolesList
      this.total = res.data.rolesList.length
    },
    //  监听 pagesize 改变的事件
    handleSizeChange(newSize) {
      this.queryInfo.size = newSize
      this.pagingQueryIsDelete()
    },
    //  监听 页码值 改变的事件
    handleCurrentChange(newPage) {
      this.queryInfo.index = newPage
      this.pagingQueryIsDelete()
    },
    //  根据角色名称模糊查询
    async findRoleByRoleNameIsDelete(queryInfo) {
      const { data: res } = await this.$http.get(
        `/roles/findRoleByRoleNameIsDelete?roleName=${queryInfo.query}`
      )
      console.log(res)
      if (res.statue !== 200) {
        return this.$message.error('不存在该角色')
      }
      this.roleList = res.data.rolesList
      this.total = res.data.rolesList.length
    },
    //  监听添加角色对话框的关闭事件
    addDialogClose() {
      this.$refs.addFormRef.resetFields()
    },
    //  点击按钮，添加新角色
    addRole() {
      this.$refs.addFormRef.validate(async(valid) => {
        if (!valid) return
        //    可以发起添加角色的网络请求
        const { data: res } = await this.$http.post(
          '/roles/addRole',
          this.addForm
        )
        if (res.statue !== 200) {
          return this.$message.error('添加角色失败')
        }
        this.$message.success('添加角色成功')
        //  隐藏添加角色的对话框
        this.addDialogVisible = false
        //  重新获取角色数据
        this.pagingQuery()
      })
    },
    //  展示编辑角色的对话框
    async showEditDialog(id) {
      const { data: res } = await this.$http.get('/roles/getById?id=' + id)
      this.editForm = res.data.role
      this.editDialogVisivle = true
    },
    //  监听修改角色对话框的关闭事件
    editDialogClosed() {
      this.$refs.editFormRef.resetFields()
    },
    //  修改角色信息并提交
    editRoleInfo() {
      this.$refs.editFormRef.validate(async(valid) => {
        if (!valid) return
        //  发起修改角色信息的网络请求
        const { data: res } = await this.$http.post(
          '/roles/updateRoleById',
          this.editForm
        )
        if (res.statue !== 200) {
          return this.$message.error('修改角色失败')
        }
        this.$message.success('修改角色成功')
        //  隐藏修改角色的对话框
        this.editDialogVisivle = false
        //  重新获取角色数据
        this.pagingQuery()
      })
    },
    //    根据 id 删除对应的角色
    async removeRoleById(id) {
      //    弹框询问用户是否删除数据
      const confirmResult = await this.$confirm(
        '此操作将永久删除该角色, 是否继续?',
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
        '/roles/removeRoleById?id=' + id
      )
      if (res.statue !== 200) {
        return this.$message.error('删除角色失败')
      }
      this.$message.success('删除角色成功')
      this.pagingQuery()
    }
  }
}
</script>

<style lang="less" scoped>
</style>
