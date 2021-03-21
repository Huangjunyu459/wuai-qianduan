<template>
  <div>
    <!-- 面包屑区域 -->
    <el-breadcrumb class="crumbs" separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/index' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>壁纸 </el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 搜索与添加区域 -->
    <div style="margin-top: 15px">
      <el-input
        v-model="title"
        placeholder="请输入内容"
        class="input-with-select"
      >
        <el-button
          slot="append"
          icon="el-icon-search"
          @click="findWallpaperByTitleExamine(title)"
        />
      </el-input>
    </div>

    <!-- 轮播图区域 -->
    <div class="carousel">
      <el-carousel height="400px" indicator-position="outside">
        <el-carousel-item v-for="item in hotWallpaperList" :key="item">
          <a @click="detailWallpaper(item.id)">
            <div class="cimg">
              <img
                :src="item.ossSrc"
                alt="加载失败"
              >
            </div></a>
        </el-carousel-item>
      </el-carousel>
    </div>

    <!-- 最新壁纸区域 -->
    <div class="wallpaper">
      <el-link
        style="font-size: 25px"
        :underline="false"
        icon="el-icon-star-on"
        type="info"
      >最新壁纸</el-link>
      <el-row :gutter="20">
        <el-col v-for="o in wallpaperList" :key="o" :span="6">
          <el-card class="showbox box-card">
            <a @click="detailWallpaper(o.id)">
              <div class="titlePic" style="height: 100px">
                <img
                  style="height: 100%"
                  :src="o.ossSrc"
                  alt="加载失败"
                >
              </div>
            </a>
            <div class="title" style="height: 50px">
              <el-link
                style="color: black"
                :underline="false"
                type="info"
                @click="detailWallpaper(o.id)"
              >{{ o.title }}</el-link>
            </div>
          </el-card>
        </el-col>
      </el-row>
      <div class="links">
        <el-link
          style="color: black"
          :underline="false"
          type="info"
          href="showMoreWallpaper"
        >更多壁纸资讯</el-link>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      wallpaperList: [],
      hotWallpaperList: [],
      title: ''
    }
  },
  created() {
    this.getWallpaperList()
    this.getHotWallpaperList()
  },
  methods: {
    async getWallpaperList() {
      const { data: res } = await this.$http.get('/wallpaper/findEightWallpaper')
      if (res.statue !== 200) {
        return this.$message.error('获取壁纸列表失败')
      }
      this.wallpaperList = res.data.wallpaperList
    },
    async getHotWallpaperList() {
      const { data: res } = await this.$http.get('/wallpaper/findFiveHotWallpaper')
      console.log(res)
      if (res.statue !== 200) {
        return this.$message.error('获取壁纸列表失败')
      }
      this.hotWallpaperList = res.data.wallpaperList
    },
    detailWallpaper(id) {
      this.$router.push(`/showDetailWallpaper?id=${id}`)
    },
    findWallpaperByTitleExamine(title) {
      this.$router.push(`/findWallpaperByTitleExamine?title=${title}`)
    }
  }
}
</script>

<style lang="less" scoped>
.crumbs{
  margin-top: 20px;
}
.carousel {
  width: 100%;
}

.el-carousel__item:nth-child(2n) {
  background-color: #99a9bf;
}

.el-carousel__item:nth-child(2n + 1) {
  background-color: #d3dce6;
}
.wallpaper {
  width: 100%;
  margin-top: 20px;
  margin-bottom: 30px;
}
.cimg {
  height: 400px;
}
img {
  width: 100%;
  height: 100%;
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
