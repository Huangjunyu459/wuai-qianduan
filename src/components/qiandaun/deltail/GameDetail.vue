<template>

  <div>
    <!-- 面包屑区域 -->
    <el-breadcrumb class="crumbs" separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/index' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item
        :to="{ path: '/game' }"
      >游戏
      </el-breadcrumb-item>
      <el-breadcrumb-item>游戏详情 </el-breadcrumb-item>
      <el-breadcrumb-item>{{ game.gameName }} </el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 游戏展示区域 -->
    <div class="showbox">
      <!-- 游戏封面图 -->
      <div class="game_cover">
        <img
          :src="game.gameCover"
          alt="加载失败"
        >
      </div>
      <!-- 游戏描述 -->
      <div class="description">
        <p v-for="item in description" :key="item">
          {{ item }}
        </p>
      </div>

      <!-- 点赞和下载区域 -->
      <div class="btn">
        <el-button
          class="mybtn"
          round
          icon="el-icon-star-off"
          type="danger"
          @click="likes(game.id)"
        >点赞  {{ game.love }}</el-button>
        <el-button
          class="mybtn"
          round
          icon="el-icon-download"
          type="success"
          @click="gameDownload(game.id)"
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
    <el-dialog
      title="评论区"
      :visible.sync="dialogVisible"
      width="40%"
      :before-close="handleClose"
    >

      <el-form ref="commentFormRef" label-width="100px" class="demo-ruleForm" :model="commentForm" :rules="commentFormRules">
        <el-form-item label="评论内容" prop="content">
          <el-input
            v-model="commentForm.content"
            type="textarea"
            :autosize="{ minRows: 4, maxRows: 6}"
            maxlength="300"
            show-word-limit
          />
        </el-form-item>
        <el-form-item hidden label="作品id">
          <el-input v-model="commentForm.articleId" />
        </el-form-item>
        <el-form-item hidden label="用户id">
          <el-input v-model="commentForm.userId" />
        </el-form-item>
        <el-form-item hidden label="用户名称">
          <el-input v-model="commentForm.userName" />
        </el-form-item>
      </el-form>

      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="commit">提交</el-button>
      </span>
    </el-dialog>

    <!-- 评论区域 -->
    <div class="comment">
      <div class="joinComment">
        <el-button
          icon="el-icon-edit"
          class="commentBtn"
          round
          type="danger"
          @click="showComment"
        >参与评论聊一聊</el-button>
      </div>
      <div class="showComment">
        <i class="el-icon-chat-line-round">最新评论</i>
        <div v-for="comment in commentList" :key="comment" class="user_comment">
          <div class="user_avator">
            <img
              src="https://2021article.oss-cn-hangzhou.aliyuncs.com/pic/ae2483538378479f84c66a6a89384e5c_%E9%BB%98%E8%AE%A4%E5%A4%B4%E5%83%8F.jpg"
              alt="用户头像"
            >
          </div>
          <span>{{ comment.userName }}</span>
          <p>{{ comment.content }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import GameDownloadVue from '../show/GameDownload.vue'
export default {
  data() {
    return {
      game: '',
      description: [],
      dialogVisible: false,
      commentForm: {
        articleId: '',
        userId: '',
        userName: '',
        content: ''
      },
      commentList: []
    }
  },
  created() {
    this.getGame(this.$route.query.id)
    this.getComment(this.$route.query.id)
    this.fuzhi()
  },
  methods: {
    fuzhi() {
      this.commentForm.userId = this.$cookies.get('user').id
      this.commentForm.userName = this.$cookies.get('user').username
    },
    async getGame(id) {
      const { data: res } = await this.$http.get(`/game/getById?id=${id}`)
      if (res.statue !== 200) {
        return this.$message.error('获取游戏失败')
      }
      this.game = res.data.game
      this.description = res.data.game.description.split('/')
      this.commentForm.articleId = res.data.game.id
    },
    async  likes(id) {
      const { data: res } = await this.$http.get(`/game/likes?id=${id}`)
      if (res.statue !== 200) {
        return this.$notify.error('点赞失败')
      }
      this.getGame(this.$route.query.id)
      return this.$notify({
        message: '点赞成功',
        type: 'success'
      })
    },
    gameDownload(id) {
      this.$router.push(`/gameDownload?id=${id}`)
    },
    async getComment(id) {
      const { data: res } = await this.$http.get(`/comment/findFiveCommentExamine?id=${id}`)
      console.log(id)
      if (res.statue !== 200) {
        return this.$message.error('获取评论失败')
      }
      this.commentList = res.data.commentList
      console.log(this.commentList)
    },
    showComment() {
      this.dialogVisible = true
    },
    async commit() {
      const { data: res } = await this.$http.post(`/comment/addComment`, this.commentForm)
      if (res.statue !== 200) {
        return this.$message.error('评论失败')
      }
      this.$refs.commentFormRef.resetFields()
      this.dialogVisible = false
      return this.$message.success('评论成功')
    },
    handleClose(done) {
      this.dialogVisible = false
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
.game_cover {
  width: 100%;
  height: 400px;
}
.game_cover img {
  width: 100%;
  height: 100%;
}
.description{
  margin-top: 10px;
  text-indent: 2em;
  font-size: 20px;
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
