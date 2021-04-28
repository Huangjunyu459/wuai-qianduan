<template>
  <div>
    <!-- 面包屑导航区域 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>文章管理</el-breadcrumb-item>
      <el-breadcrumb-item>已删除文章</el-breadcrumb-item>
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
              @click="findArticleByTitleIsDelete(queryInfo)"
            />
          </el-input>
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
            <img alt="封面图片" :src="row.articleCover" height="50px" width="50px">
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
        <el-table-column label="会员专属" prop="isVip">
          <template slot-scope="{ row }">
            <div v-show="row.isVip === false">非会员</div>
            <div v-show="row.isVip === true">会员</div>
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
      total: 0
    }
  },
  created() {
    this.getArticleList()
  },
  methods: {
    async getArticleList() {
      const { data: res } = await this.$http.get('/article/findIsDelete')
      if (res.statue !== 200) {
        return this.$message.error('获取文章列表失败')
      }
      this.articleList = res.data.articleList
      this.total = res.data.articleList.length
    },
    async pagingQueryIsDelete() {
      const { data: res } = await this.$http.get(
        `/article/pagingQueryIsDelete?title=${this.queryInfo.query}&index=${this.queryInfo.index}&size=${this.queryInfo.size}`
      )
      console.log(res)
      if (res.statue !== 200) {
        return this.$message.error('获取文章列表失败')
      }
      this.articleList = res.data.articleList
      this.total = res.data.articleList.length
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
    //  根据文章名称模糊查询
    async findArticleByTitleIsDelete(queryInfo) {
      const { data: res } = await this.$http.get(
        `/article/findArticleByTitleIsDelete?title=${queryInfo.query}`
      )
      console.log(res)
      if (res.statue !== 200) {
        return this.$message.error('不存在该文章')
      }
      this.articleList = res.data.articleList
      this.total = res.data.articleList.length
    }
  }
}
</script>

<style lang="less" scoped>
</style>
