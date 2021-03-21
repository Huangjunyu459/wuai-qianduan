<template>

  <div>
    <!-- 面包屑区域 -->
    <el-breadcrumb class="crumbs" separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/index' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>游戏 </el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 搜索与添加区域 -->
    <div style="margin-top: 15px">
      <el-input
        v-model="gameName"
        placeholder="请输入内容"
        class="input-with-select"
      >
        <el-button
          slot="append"
          icon="el-icon-search"
          @click="findGameByGameNameExamine(gameName)"
        />
      </el-input>
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
                <img
                  style="height: 100%"
                  :src="o.gameCover"
                  alt="加载失败"
                >
              </div>
              <div class="gameName" style="height: 50px">
                {{ o.gameName }}
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
          href="/showMoreGame"
        >更多游戏资讯</el-link>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      gameList: [],
      gameName: ''
    }
  },
  created() {
    this.getGameList()
  },
  methods: {
    async getGameList() {
      const { data: res } = await this.$http.get('/game/findSixthGame')
      if (res.statue !== 200) {
        return this.$message.error('获取游戏列表失败')
      }
      this.gameList = res.data.gameList
    },
    detailGame(id) {
      this.$router.push(`/showDetailGame?id=${id}`)
    },
    findGameByGameNameExamine(gameName) {
      this.$router.push(`/findGameByGameNameExamine?gameName=${gameName}`)
    }
  }

}
</script>

<style lang="less" scoped>
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
