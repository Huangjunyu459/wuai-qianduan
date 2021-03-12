<template>
  <div>
    <!-- 面包屑区域 -->
    <el-breadcrumb class="crumbs" separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/index' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>音频 </el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 搜索与添加区域 -->
    <div style="margin-top: 15px;">
      <el-input v-model="input3" placeholder="请输入内容" class="input-with-select">
        <el-button slot="append" icon="el-icon-search" />
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
        <el-col v-for="o in 16" :key="o" :span="6">
          <el-card class="showbox box-card">
            <div>
              <audio class="audio" src="https://2021article.oss-cn-hangzhou.aliyuncs.com/music/b8d44d3f763a4c7e9a97106e77565594_丸子呦 - 广寒宫.mp3" controls="controls" />
            </div>
            <div class="song" style="height: 50px">
              <el-link
                style="color: black"
                :underline="false"
                type="info"
                href="/showDetailMusic"
              >歌手-歌曲名</el-link>
            </div>
          </el-card>
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

}
</script>

<style lang="less" scoped>
.crumbs{
  margin-top: 20px;
}
.music{
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
.audio{
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
