<template>
  <div>
    <!-- 面包屑区域 -->
    <el-breadcrumb class="crumbs" separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/index' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>文章 </el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 搜索区域 -->
    <div style="margin-top: 15px;">
      <el-input v-model="title" placeholder="请输入内容" class="input-with-select">
        <el-button
          slot="append"
          icon="el-icon-search"
          @click="findArticleByTitleExamine(title)"
        />
      </el-input>
    </div>

    <!-- 最新文章区域 -->
    <div class="article">
      <el-link
        style="font-size: 25px"
        :underline="false"
        icon="el-icon-star-on"
        type="info"
      >最新文章</el-link>
      <el-row :gutter="20">
        <el-col v-for="o in articleList" :key="o" :span="6">
          <a @click="detailArticle(o.id)">
            <el-card class="showbox box-card">
              <div class="titlePic" style="height: 100px">
                <img
                  style="height: 100%"
                  :src="o.articleCover"
                >
              </div>
              <div class="title" style="height: 50px">
                {{ o.title }}
              </div>
            </el-card>
          </a>
        </el-col>
      </el-row>
      <div class="links">
        <el-link
          style="color: black"
          :underline="false"
          type="info"
          href="/showMoreArticle"
        >更多文章资讯</el-link>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      articleList: [],
      title: ''
    }
  },
  created() {
    this.getArticleList()
  },
  methods: {
    async getArticleList() {
      const { data: res } = await this.$http.get(`/article/findSixthArticle`)
      if (res.statue !== 200) {
        return this.$message.error('获取文章列表失败')
      }
      this.articleList = res.data.articleList
    },
    detailArticle(id) {
      this.$router.push(`/showDetailArticle?id=${id}`)
    },
    findArticleByTitleExamine(title) {
      this.$router.push(`/findArticleByTitleExamine?title=${title}`)
    }
  }

}
</script>

<style lang="less" scoped>
.crumbs{
  margin-top: 20px;
}
.article{
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
