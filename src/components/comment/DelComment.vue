<template>
  <div>
    <!-- 面包屑导航区域 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>评论管理</el-breadcrumb-item>
      <el-breadcrumb-item>已删除评论</el-breadcrumb-item>
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
            @clear="getCommentList"
          >
            <el-button
              slot="append"
              icon="el-icon-search"
              @click="findCommentByContentIsDelete(queryInfo)"
            />
          </el-input>
        </el-col>
      </el-row>

      <!-- 评论列表区域 -->
      <el-table :data="commentList" border stripe>
        <el-table-column label="序号" type="index" />
        <el-table-column label="评论的id" prop="id" />
        <el-table-column label="文章的id" prop="articleId" />
        <el-table-column label="评论的用户id" prop="userId" />
        <el-table-column label="评论内容" prop="content" />
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
      commentList: [],
      total: 0
    }
  },
  created() {
    this.getCommentList()
  },
  methods: {
    async getCommentList() {
      const { data: res } = await this.$http.get('/comment/findIsDelete')
      if (res.statue !== 200) {
        return this.$message.error('获取评论列表失败')
      }
      this.commentList = res.data.commentList
      this.total = res.data.commentList.length
    },
    async pagingQueryIsDelete() {
      const { data: res } = await this.$http.get(
        `/comment/pagingQueryIsDelete?id=${this.queryInfo.query}&index=${this.queryInfo.index}&size=${this.queryInfo.size}`
      )
      console.log(res)
      if (res.statue !== 200) {
        return this.$message.error('获取评论列表失败')
      }
      this.commentList = res.data.commentList
      this.total = res.data.commentList.length
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
    //  根据评论名称模糊查询
    async findCommentByContentIsDelete(queryInfo) {
      const { data: res } = await this.$http.get(
        `/comment/findCommentByContentIsDelete?content=${queryInfo.query}`
      )
      if (res.statue !== 200) {
        return this.$message.error('不存在该评论')
      }
      this.commentList = res.data.commentList
      this.total = res.data.commentList.length
    }
  }
}
</script>

<style lang="less" scoped>
</style>
