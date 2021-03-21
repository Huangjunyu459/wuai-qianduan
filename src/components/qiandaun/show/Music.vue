<template>
  <div>
    <!-- 面包屑区域 -->
    <el-breadcrumb class="crumbs" separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/index' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>音频 </el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 搜索与添加区域 -->
    <div style="margin-top: 15px">
      <el-input
        v-model="song"
        placeholder="请输入内容"
        class="input-with-select"
      >
        <el-button
          slot="append"
          icon="el-icon-search"
          @click="findMusicBySongExamine(song)"
        />
      </el-input>
    </div>

    <!-- 最新音频区域 -->
    <div class="music">
      <el-link
        style="font-size: 25px"
        :underline="false"
        icon="el-icon-star-on"
        type="info"
      >最新音频</el-link>
      <el-row :gutter="20">
        <el-col v-for="o in musicList" :key="o" :span="6">
          <a @click="detailMusic(o.id)">
            <el-card class="showbox box-card">
              <div>
                <audio class="audio" :src="o.ossSrc" controls="controls" />
              </div>
              <div class="song" style="height: 50px">
                {{ o.singer }}----{{ o.song }}
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
          href="/showMoreMusic"
        >更多音频资讯</el-link>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      musicList: [],
      song: ''
    }
  },
  created() {
    this.getMusicList()
  },
  methods: {
    async getMusicList() {
      const { data: res } = await this.$http.get(`/music/findSixthMusic`)
      if (res.statue !== 200) {
        return this.$message.error('获取音乐列表失败')
      }
      this.musicList = res.data.musicList
    },
    detailMusic(id) {
      this.$router.push(`/showDetailMusic?id=${id}`)
    },
    findMusicBySongExamine(song) {
      this.$router.push(`/findMusicBySongExamine?song=${song}`)
    }
  }
}
</script>

<style lang="less" scoped>
.crumbs {
  margin-top: 20px;
}
.music {
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
.audio {
  width: 180px;
}
.song {
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
