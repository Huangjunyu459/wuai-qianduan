<template>
  <div>
    <!-- 面包屑区域 -->
    <el-breadcrumb class="crumbs" separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/index' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>视频 </el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 搜索与添加区域 -->
    <div style="margin-top: 15px;">
      <el-input v-model="videoName" placeholder="请输入内容" class="input-with-select">
        <el-button
          slot="append"
          icon="el-icon-search"
          @click="findVideoByVideoNameExamine(videoName)"
        />
      </el-input>
    </div>

    <!-- 最新视频区域 -->
    <div class="video">
      <el-link
        style="font-size: 25px"
        :underline="false"
        icon="el-icon-star-on"
        type="info"
      >最新视频</el-link>
      <el-row :gutter="20">
        <el-col v-for="o in videoList" :key="o" :span="6">
          <a @click="detailVideo(o.id)">
            <el-card class="showbox box-card">
              <div>
                <video
                  class="shipin"
                  :src="o.ossSrc"
                  controls="controls"
                />
              </div>
              <div class="videoName" style="height: 50px">
                {{ o.videoName }}
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
          href="/showMoreVideo"
        >更多视频资讯</el-link>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      videoList: [],
      videoName: ''
    }
  },
  created() {
    this.getVideoList()
  },
  methods: {
    async getVideoList() {
      const { data: res } = await this.$http.get('/video/findSixthVideo')
      if (res.statue !== 200) {
        return this.$message.error('获取视频列表失败')
      }
      this.videoList = res.data.videoList
    },
    detailVideo(id) {
      this.$router.push(`/showDetailVideo?id=${id}`)
    },
    findVideoByVideoNameExamine(videoName) {
      this.$router.push(`/findVideoByVideoNameExamine?videoName=${videoName}`)
    }
  }
}
</script>

<style lang="less" scoped>
.crumbs{
  margin-top: 20px;
}
.video{
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
.shipin{
  width: 150px;
}
.videoName {
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
