<template>
  <div>
    <!-- 面包屑区域 -->
    <el-breadcrumb class="crumbs" separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/index' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>查找壁纸 </el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 搜索与添加区域 -->
    <!-- <div style="margin-top: 15px;">
      <el-input v-model="query" placeholder="请输入内容" class="input-with-select">
        <el-button
          slot="append"
          icon="el-icon-search"
          @click="findWallpaperByTitleExamine(query)"
        />
      </el-input>
    </div> -->

    <!-- 最新壁纸区域 -->
    <div class="wallpaper">
      <el-link
        style="font-size: 25px"
        :underline="false"
        icon="el-icon-star-on"
        type="info"
      >查询结果</el-link>
      <el-row :gutter="20">
        <el-col v-for="o in wallpaperList" :key="o" :span="6">
          <el-card class="showbox box-card">
            <a
              @click="detailWallpaper(o.id)"
            >
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
              > {{ o.title }}</el-link>
            </div>
          </el-card>
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
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
      />
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      wallpaperList: [],
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
    this.getwallpaperList(this.$route.query.title)
    this.fuzhi()
  },
  methods: {
    fuzhi() {
      this.queryInfo.query = this.$route.query.title
    },
    async  getwallpaperList(title) {
      const { data: res } = await this.$http.get(`/wallpaper/findWallpaperByTitleExamine?title=${title}`)
      if (res.statue !== 200) {
        return this.$message.error('获取壁纸列表失败')
      }
      this.wallpaperList = res.data.wallpaperList
      this.total = res.data.wallpaperList.length
    },
    detailWallpaper(id) {
      this.$router.push(`/showDetailWallpaper?id=${id}`)
    },
    async  pagingQueryExamine() {
      const { data: res } = await this.$http.get(
        `/wallpaper/pagingQueryExamine?title=${this.queryInfo.query}&index=${this.queryInfo.index}&size=${this.queryInfo.size}`
      )
      console.log(res)
      if (res.statue !== 200) {
        return this.$message.error('获取壁纸列表失败')
      }
      this.wallpaperList = res.data.wallpaperIPage.records
      this.total = res.data.wallpaperIPage.total
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
    }
  }

}
</script>

<style lang="less" scoped>
.crumbs{
  margin-top: 20px;
}
.wallpaper {
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
