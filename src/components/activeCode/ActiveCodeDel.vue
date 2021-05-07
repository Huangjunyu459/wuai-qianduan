<template>
  <div>
    <!-- 面包屑导航区域 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>激活码管理</el-breadcrumb-item>
      <el-breadcrumb-item>已使用激活码</el-breadcrumb-item>
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
            @clear="getActiveCodeList"
          >
            <el-button
              slot="append"
              icon="el-icon-search"
              @click="findActiveCodesByCodeIsDelete(queryInfo)"
            />
          </el-input>
        </el-col>
      </el-row>

      <!-- 评论列表区域 -->
      <el-table :data="activeCodeList" border stripe>
        <el-table-column label="序号" type="index" />
        <el-table-column label="激活码" prop="actCode" />
        <el-table-column label="激活的用户" prop="userId" />
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
      //  获取评论列表的参数对象
      queryInfo: {
        query: '',
        //  当前的页数
        index: 1,
        //  当前每页显示多少条数据
        size: 5
      },
      //    接受返回的评论列表结果
      activeCodeList: [],
      total: 0
    }
  },
  created() {
    this.getActiveCodeList()
  },
  methods: {
    async getActiveCodeList() {
      const { data: res } = await this.$http.get(
        '/actCode/findIsDelete'
      )
      if (res.statue !== 200) {
        return this.$message.error('获取激活码失败')
      }
      this.activeCodeList = res.data.activeCodeList
      this.total = res.data.activeCodeList.length
    },
    async pagingQuery() {
      const { data: res } = await this.$http.get(
        `/actCode/pagingQueryIsDelete?code=${this.queryInfo.query}&index=${this.queryInfo.index}&size=${this.queryInfo.size}`
      )
      if (res.statue !== 200) {
        return this.$message.error('获取激活码失败')
      }
      this.activeCodeList = res.data.activeCodeIPage.records
      this.total = res.data.activeCodeIPage.total
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
    //  根据评论名称模糊查询
    async findActiveCodesByCodeIsDelete(queryInfo) {
      const { data: res } = await this.$http.get(
        `/actCode/findActiveCodesByCodeIsDelete?code=${queryInfo.query}`
      )
      console.log(res)
      if (res.statue !== 200) {
        return this.$message.error('不存在该激活码')
      }
      this.activeCodeList = res.data.activeCodeList
      this.total = res.data.activeCodeList.length
    }
  }
}
</script>

<style lang="less" scoped>
</style>
