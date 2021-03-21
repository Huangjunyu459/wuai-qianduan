<template>
  <div>
    <!-- 面包屑区域 -->
    <el-breadcrumb class="crumbs" separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/index' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item
        :to="{ path: '/music' }"
      >音乐
      </el-breadcrumb-item>
      <el-breadcrumb-item>音频详情 </el-breadcrumb-item>
      <el-breadcrumb-item>{{ music.song }} </el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 壁纸展示区域 -->
    <div class="showbox">
      <div class="music">
        <img
          :src="music.musicCover"
          alt="加载失败"
        >
      </div>
      <span style="font-size:20px">{{ music.singer }}-{{ music.song }}</span>
      <br>
      <!-- 音乐播放器组件 -->
      <audio controls="controls" :src="music.ossSrc" />
      <!-- 点赞和下载区域 -->
      <div class="btn">
        <el-button
          class="mybtn"
          round
          icon="el-icon-star-off"
          type="danger"
          @click="likes(music.id)"
        >点赞   {{ music.love }}</el-button>
        <el-button
          class="mybtn"
          round
          icon="el-icon-download"
          type="success"
        >下载
        </el-button>
      </div>

      <!-- 声明区域 -->
      <div class="statement">
        <p>本作品是由吾爱分享(用户级别)(用户名)投递的作品</p>
        <p>欢迎转载，但请务必注明来源地址：http://localhost:80</p>
      </div>
    </div>

    <!-- 评论区域 -->
    <div class="comment">
      <div class="joinComment">
        <el-button
          icon="el-icon-edit"
          class="commentBtn"
          round
          type="danger"
        >参与评论聊一聊</el-button>
      </div>
      <div class="showComment">
        <i class="el-icon-chat-line-round">最新评论</i>
        <div class="user_comment">
          <div class="user_avator">
            <img
              src="https://2021article.oss-cn-hangzhou.aliyuncs.com/pic/ae2483538378479f84c66a6a89384e5c_%E9%BB%98%E8%AE%A4%E5%A4%B4%E5%83%8F.jpg"
              alt="avator"
            >
          </div>
          <span>用户名</span>
          <p>用户评论</p>
        </div>

        <div class="user_comment">
          <div class="user_avator">
            <img
              src="https://2021article.oss-cn-hangzhou.aliyuncs.com/pic/ae2483538378479f84c66a6a89384e5c_%E9%BB%98%E8%AE%A4%E5%A4%B4%E5%83%8F.jpg"
              alt="avator"
            >
          </div>
          <span>用户名</span>
          <p>用户评论</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      music: ''
    }
  },
  created() {
    this.getMusic(this.$route.query.id)
  },
  methods: {
    async getMusic(id) {
      const { data: res } = await this.$http.get(`/music/getById?id=${id}`)
      if (res.statue !== 200) {
        return this.$message.error('获取音乐失败')
      }
      this.music = res.data.music
    },
    async  likes(id) {
      const { data: res } = await this.$http.get(`/music/likes?id=${id}`)
      if (res.statue !== 200) {
        return this.$notify.error('点赞失败')
      }
      this.getMusic(this.$route.query.id)
      return this.$notify({
        message: '点赞成功',
        type: 'success'
      })
    }
  }

}
</script>

<style lang="less" scoped>
.crumbs {
  margin-top: 20px;
}
.showbox {
  margin-top: 20px;
  width: 100%;
}
.music {
  display: inline-block;
  width: 100px;
  height: 100px;
}
.music img {
  width: 100%;
  height: 100%;
}
.btn {
  margin-top: 20px;
  text-align: center;
}
.mybtn {
  width: 300px;
  margin-right: 80px;
}
.statement {
  margin-top: 10px;
  margin-bottom: 15px;
  font-size: 14px;
  color: rgb(63, 64, 65);
}
.comment {
  width: 100%;
  color: rgb(63, 64, 65);
}
.joinComment {
  width: 80%;
  height: 50px;
  margin-bottom: 5px;
  border-radius: 25px;
}
.commentBtn {
  width: 100%;
  height: 50px;
  font-size: 20px;
}
.showComment i {
  font-size: 14px;
  margin: 10px 0;
}
.user_comment {
  width: 80%;
}
.user_avator {
  display: inline-block;
  width: 50px;
  height: 50px;
  border-radius: 25px;
}
.user_avator img {
  width: 100%;
  height: 100%;
  border-radius: 25px;
}
</style>
