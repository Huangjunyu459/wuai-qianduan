<template>
  <div>
    <!-- 面包屑导航区域 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>用户管理</el-breadcrumb-item>
      <el-breadcrumb-item>已删除用户</el-breadcrumb-item>
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
              @click="findUsersByUsernameIsDelete(queryInfo)"
            />
          </el-input>
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
      total: 0
    }
  },
  created() {
    this.findIsDelete()
  },
  methods: {
    async findIsDelete() {
      const { data: res } = await this.$http.get('/admin/findIsDelete')
      if (res.statue !== 200) {
        return this.$message.error('获取用户列表失败')
      }
      this.userList = res.data.userList
      this.total = res.data.userList.length
    },
    async pagingQueryIsDelete() {
      const { data: res } = await this.$http.get(
        `/admin/pagingQueryIsDelete?username=${this.queryInfo.query}&index=${this.queryInfo.index}&size=${this.queryInfo.size}`
      )
      console.log(res)
      if (res.statue !== 200) {
        return this.$message.error('获取用户列表失败')
      }
      this.userList = res.data.userList
      this.total = res.data.userList.length
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
    //  根据用户名模糊查找
    async findUsersByUsernameIsDelete(queryInfo) {
      const { data: res } = await this.$http.get(
        `/admin/findUsersByUsernameIsDelete?username=${queryInfo.query}`
      )
      console.log(res)
      if (res.statue !== 200) {
        return this.$message.error('不存在该用户')
      }
      this.userList = res.data.userList
      this.total = res.data.userList.length
    }

  }
}
</script>

<style lang="less" scoped>
</style>
