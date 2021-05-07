<template>
  <div>
    <!-- 面包屑区域 -->
    <el-breadcrumb class="crumbs" separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/index' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>查找文章 </el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 搜索与添加区域 -->
    <!-- <div style="margin-top: 15px;">
      <el-input v-model="title" placeholder="请输入内容" class="input-with-select">
        <el-button slot="append" icon="el-icon-search" />
      </el-input>
    </div> -->

    <!-- 最新壁纸区域 -->
    <div class="article">
      <el-link
        style="font-size: 25px"
        :underline="false"
        icon="el-icon-star-on"
        type="info"
      >查询结果</el-link>
      <el-row :gutter="20">
        <el-col v-for="o in articleList" :key="o" :span="6">
          <a @click="detailArticle(o.id)">
            <el-card class="showbox box-card">
              <div class="titlePic" style="height: 100px">
                <img
                  style="height: 100%"
                  :src="o.articleCover"
                  alt="加载失败"
                >
              </div>
              <div class="title" style="height: 50px">
                {{ o.title }}
              </div>
            </el-card>
          </a>
        </el-col>
      </el-row>
    </div>

    <!-- 分页区域 -->
    <div class="block">
      <el-pagination
        :current-page="cpage"
        :page-sizes="[5, 10, 20, 30]"
        :page-size="100"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      />
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      articleList: [],
      total: 0,
      cpage: 1,
      queryInfo: {
        query: '',
        //  当前的页数
        index: 1,
        //  当前每页显示多少条数据
        size: 5
      }
    }
  },
  created() {
    this.getArticleList(this.$route.query.title)
    this.fuzhi()
  },
  methods: {
    fuzhi() {
      this.queryInfo.query = this.$route.query.title
    },
    async  getArticleList(title) {
      const { data: res } = await this.$http.get(`/article/findArticleByTitleExamine?title=${title}`)
      console.log(res)
      if (res.statue !== 200) {
        return this.$message.error('获取文章列表失败')
      }
      this.articleList = res.data.articleList
      this.total = res.data.articleList.length
    },
    detailArticle(id) {
      this.$router.push(`/showDetailArticle?id=${id}`)
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
    async pagingQueryExamine() {
      const { data: res } = await this.$http.get(
        `/article/pagingQueryExamine?title=${this.queryInfo.query}&index=${this.queryInfo.index}&size=${this.queryInfo.size}`
      )
      console.log(res)
      if (res.statue !== 200) {
        return this.$message.error('获取文章列表失败')
      }
      this.articleList = res.data.articleIPage.records
      this.total = res.data.articleIPage.total
    }
  }

}
</script>

<style lang="less" scoped>
.crumbs{
  margin-top: 20px;
}
.article {
  width: 100%;
  margin-top: 20px;
  margin-bottom: 30px;
}
.showbox {
  height: 150px;
  border-radius: 10px;
}
.el-card {
  margin-top: 20px;
}
.titlePic {
  height: 100px;
}
.title {
  margin-top: 5px;
  font-size: 14px;
  height: 20px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.links {
  width: 300px;
  height: 30px;
  background-color: seagreen;
  text-align: center;
  line-height: 30px;
  border-radius: 25px;
  margin: 20px auto;
}
.input-with-select {
  margin: 20px 0 10px 0;
  width: 400px;
}
</style>
