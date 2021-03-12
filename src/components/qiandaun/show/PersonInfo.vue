<template>
  <div class="showbox">
    <!-- 头像用户区域 -->
    <div class="avator">
      <img
        src="https://2021article.oss-cn-hangzhou.aliyuncs.com/pic/ae2483538378479f84c66a6a89384e5c_%E9%BB%98%E8%AE%A4%E5%A4%B4%E5%83%8F.jpg"
        alt=""
      >
    </div>
    <span>用户名</span>
    <div class="level">用户级别</div>

    <!-- 用户信息区域 -->
    <div class="info">
      <el-menu :router="true" class="el-menu-demo" mode="horizontal">
        <el-menu-item>
          <el-button @click="showInfoBox">概述</el-button>
        </el-menu-item>
        <el-menu-item><el-button @click="showArticleBox">文章</el-button>
        </el-menu-item>
        <el-menu-item><el-button @click="showCommentBox">评论</el-button>
        </el-menu-item>
      </el-menu>
      <el-tag style="border-radius: 25px; margin: 10px 0">基本信息</el-tag>
      <div v-if="infoBox" class="infoBox">
        <div class="infoBox-first">昵称</div>
        <div class="infoBox-second">用户名</div>
        <br>

        <div class="infoBox-first">UID</div>
        <div class="infoBox-second">用户id</div>
        <br>

        <div class="infoBox-first">描述</div>
        <div class="infoBox-second">用户个签</div>
        <br>

        <div class="infoBox-first">评论统计</div>
        <div class="infoBox-second">0</div>
        <br>

        <div class="infoBox-first">昵称</div>
        <div class="infoBox-second">用户名</div>
        <br>
      </div>
      <div v-if="articleBox">暂无文章资料</div>
      <div v-if="commentBox">暂无评论资料</div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      infoBox: true,
      articleBox: false,
      commentBox: false
    }
  },
  methods: {
    showInfoBox() {
      this.articleBox = false
      this.commentBox = false
      this.infoBox = true
    },
    showArticleBox() {
      this.infoBox = false
      this.commentBox = false
      this.articleBox = true
    },
    showCommentBox() {
      this.articleBox = false
      this.infoBox = false
      this.commentBox = true
    }
  }
}
</script>

<style lang="less" scoped>
.infoBox {
  width: 100%;
  margin-top: 10px;
}
.infoBox-first {
  display: inline-block;
  line-height: 40px;
  width: 100px;
  height: 40px;
  margin-bottom: 10px;
}
.infoBox-second {
  display: inline-block;
  line-height: 50px;
  width: 700px;
  height: 50px;
  margin-bottom: 10px;
}
.showbox {
  color: rgb(73, 80, 80);
  width: 100%;
}
.avator {
  margin: 10px 10px 10px 400px;
  display: inline-block;
  width: 100px;
  height: 100px;
  border-radius: 50px;
  > img {
    width: 100%;
    height: 100%;
    border-radius: 50px;
  }
}
.level {
  margin-left: 10px;
  text-align: center;
  line-height: 35px;
  display: inline-block;
  height: 35px;
  width: 100px;
  border-radius: 25px;
  background-color: skyblue;
}
.info {
  width: 100%;
  margin-top: 10px;
}
</style>
