<template>
  <div>
    <!-- 面包屑区域 -->
    <el-breadcrumb class="crumbs" separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/index' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item />
    </el-breadcrumb>

    <!-- 轮播图区域 -->
    <div class="carousel">
      <el-carousel height="400px" indicator-position="outside">
        <el-carousel-item v-for="item in wallpaperList" :key="item">
          <a @click="detailWallpaper(item.id)">
            <div class="cimg">
              <img :src="item.ossSrc" alt="加载失败"></div></a>
        </el-carousel-item>
      </el-carousel>
    </div>

    <div class="content">
      <!-- 快捷导航区域 -->
      <div class="quickNav">
        <i class="el-icon-star-on">快捷导航</i>
        <el-card class="box-card">
          <el-link
            style="font-size: 25px; color: cornflowerblue; margin-bottom: 20px"
            :underline="false"
            type="info"
            href="javasriptl:;"
          >
            积分获取教程</el-link><br>
          <el-link
            style="font-size: 25px; color: cornflowerblue; margin-bottom: 20px"
            :underline="false"
            type="info"
            href="javasriptl:;"
          >
            管理员申请</el-link><br>
          <el-link
            style="font-size: 25px; color: cornflowerblue; margin-bottom: 20px"
            :underline="false"
            type="info"
            href="javasriptl:;"
          >
            网页异常点我</el-link>
        </el-card>
      </div>

      <!-- 公告区域 -->
      <div class="notice">
        <i class="el-icon-star-on">公告</i>
        <el-card class="box-card">
          <el-link
            style="font-size: 25px; color: cornflowerblue; margin-bottom: 20px"
            :underline="false"
            type="info"
            href="javasriptl:;"
          >
            关于网站说明</el-link><br>
          <el-link
            style="font-size: 25px; color: cornflowerblue; margin-bottom: 20px"
            :underline="false"
            type="info"
            href="javasriptl:;"
          >
            新用户规范</el-link><br>
          <el-link
            style="font-size: 25px; color: cornflowerblue; margin-bottom: 20px"
            :underline="false"
            type="info"
            href="javasriptl:;"
          >
            违规处理</el-link>
        </el-card>
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
        <div class="links">
          <el-link
            style="color: black"
            :underline="false"
            type="info"
            href="/showMoreArticle"
          >更多文章资讯</el-link>
        </div>
      </div>

      <!-- 最新游戏区域 -->
      <div class="game">
        <el-link
          style="font-size: 25px"
          :underline="false"
          icon="el-icon-star-on"
          type="info"
        >最新游戏</el-link>
        <el-row :gutter="20">
          <el-col v-for="o in gameList" :key="o" :span="6">
            <a @click="detailGame(o.id)">
              <el-card class="showbox box-card">
                <div class="titlePic" style="height: 100px">
                  <img style="height: 100%" :src="o.gameCover" alt="加载失败">
                </div>
                <div class="title" style="height: 50px">
                  {{ o.gameName }}
                </div></el-card></a>
          </el-col>
        </el-row>
        <div class="links">
          <el-link
            style="color: black"
            :underline="false"
            type="info"
            href="/showMoreGame"
          >更多游戏资讯</el-link>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  data() {
    return {
      wallpaperList: [],
      articleList: [],
      gameList: []
    }
  },
  created() {
    this.getWallpaperList()
    this.getArticleList()
    this.getGameList()
  },
  methods: {
    //  获取最新的八张壁纸
    async getWallpaperList() {
      const { data: res } = await this.$http.get(
        '/wallpaper/findEightWallpaper'
      )
      if (res.statue !== 200) {
        return this.$message.error('获取壁纸列表失败')
      }
      this.wallpaperList = res.data.wallpaperList
    },
    //  跳转到壁纸的详情页
    detailWallpaper(id) {
      this.$router.push(`/showDetailWallpaper?id=${id}`)
    },
    //  获取最新的八篇文章
    async getArticleList() {
      const { data: res } = await this.$http.get('/article/findEightArticle')
      if (res.statue !== 200) {
        return this.$message.error('获取文章列表失败')
      }
      this.articleList = res.data.articleList
    },
    //  跳转到文章的详情页
    detailArticle(id) {
      this.$router.push(`/showDetailArticle?id=${id}`)
    },
    //  获取最新的八篇游戏
    async getGameList() {
      const { data: res } = await this.$http.get('/game/findEightGame')
      if (res.statue !== 200) {
        return this.$message.error('获取游戏列表失败')
      }
      this.gameList = res.data.gameList
    },
    //  跳转到游戏的详情页
    detailGame(id) {
      this.$router.push(`/showDetailGame?id=${id}`)
    }
  }
}
</script>

<style lang="less" scoped>
.crumbs {
  margin-top: 20px;
}
.carousel {
  margin-top: 20px;
  margin-bottom: 50px;
  width: 100%;
}

.el-carousel__item:nth-child(2n) {
  background-color: #99a9bf;
}

.el-carousel__item:nth-child(2n + 1) {
  background-color: #d3dce6;
}
.cimg {
  height: 400px;
}
img {
  width: 100%;
  height: 100%;
}

.article,
.game {
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
.quickNav {
  display: inline-block;
  width: 45%;
  height: 300px;
}
.el-icon-star-on {
  font-size: 35px;
  color: #475669;
  font-weight: 900;
}
.notice {
  display: inline-block;
  width: 45%;
  height: 300px;
  margin-left: 50px;
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
</style>
