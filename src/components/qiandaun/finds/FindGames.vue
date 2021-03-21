<template>
  <div>
    <!-- 面包屑区域 -->
    <el-breadcrumb class="crumbs" separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/index' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>查找壁纸 </el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 搜索与添加区域 -->
    <!-- <div style="margin-top: 15px;">
      <el-input v-model="input3" placeholder="请输入内容" class="input-with-select">
        <el-button slot="append" icon="el-icon-search" />
      </el-input>
    </div> -->

    <!-- 最新壁纸区域 -->
    <div class="game">
      <el-link
        style="font-size: 25px"
        :underline="false"
        icon="el-icon-star-on"
        type="info"
      >查询结果</el-link>
      <el-row :gutter="20">
        <el-col v-for="o in gameList" :key="o" :span="6">
          <el-card class="showbox box-card">
            <a
              @click="detailGame(o.id)"
            >
              <div class="titlePic" style="height: 100px">
                <img
                  style="height: 100%"
                  :src="o.gameCover"
                  alt="加载失败"
                >
              </div>
            </a>
            <div class="title" style="height: 50px">
              <el-link
                style="color: black"
                :underline="false"
                type="info"
                @click="detailGame(o.id)"
              > {{ o.gameName }}</el-link>
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
      gameList: [],
      total: 0,
      cpage: 1
    }
  },
  created() {
    this.getGameList(this.$route.query.gameName)
  },
  methods: {
    async  getGameList(gameName) {
      const { data: res } = await this.$http.get(`/game/findGameByGameNameExamine?gameName=${gameName}`)
      if (res.statue !== 200) {
        return this.$message.error('获取壁纸列表失败')
      }
      this.gameList = res.data.gameList
      this.total = res.data.gameList.length
    },
    detailGame(id) {
      this.$router.push(`/showDetailGame?id=${id}`)
    }
  }

}
</script>

<style lang="less" scoped>
.crumbs{
  margin-top: 20px;
}
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
