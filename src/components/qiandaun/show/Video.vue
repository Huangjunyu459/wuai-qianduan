<template>
  <div>
    <!-- 面包屑区域 -->
    <el-breadcrumb class="crumbs" separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/index' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>视频 </el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 搜索与添加区域 -->
    <div style="margin-top: 15px;">
      <el-input v-model="input3" placeholder="请输入内容" class="input-with-select">
        <el-button slot="append" icon="el-icon-search" />
      </el-input>
    </div>

    <!-- 最新视频区域 -->
    <div class="music">
      <el-link
        style="font-size: 25px"
        :underline="false"
        icon="el-icon-star-on"
        type="info"
      >最新视频</el-link>
      <el-row :gutter="20">
        <el-col v-for="o in 16" :key="o" :span="6">
          <el-card class="showbox box-card">
            <div>
              <video class="shipin" src="https://2021article.oss-cn-hangzhou.aliyuncs.com/video/c6886c7117de4ea38102393b717de17e_%E7%8C%AB%E7%8C%AB%E6%95%99%E4%BD%A0%E6%97%A9%E4%B8%8A%E5%A6%82%E4%BD%95%E5%BF%AB%E9%80%9F%E6%B8%85%E9%86%92.mp4" controls="controls" />
            </div>
            <div class="videoName" style="height: 50px">
              <el-link
                style="color: black"
                :underline="false"
                type="info"
                href="/showDetailVideo"
              >视频名</el-link>
            </div>
          </el-card>
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
