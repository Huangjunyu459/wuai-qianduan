<template>
  <div>
    <!-- 面包屑区域 -->
    <el-breadcrumb class="crumbs" separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/index' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item
        :to="{ path: '/wallpaper' }"
      >壁纸
      </el-breadcrumb-item>
      <el-breadcrumb-item>壁纸详情 </el-breadcrumb-item>
      <el-breadcrumb-item>{{ title }} </el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 壁纸展示区域 -->
    <div class="showbox">
      <div class="wallpaper">
        <img
          :src="wallpaper.ossSrc"
          alt="加载失败"
        >
      </div>

      <!-- 点赞和下载区域 -->
      <div class="btn">
        <el-button
          class="mybtn"
          round
          icon="el-icon-star-off"
          type="danger"
          @click="likes(wallpaper.id)"
        >点赞   {{ wallpaper.love }}</el-button>
        <el-button
          class="mybtn"
          round
          icon="el-icon-download"
          type="success"
          @click="download"
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
    <a v-show="false" class="wallpapaerLink" :href="wallpaper.ossSrc">12345</a>
  </div>
</template>

<script>
export default {
  inject: ['reload'],
  data() {
    return {
      wallpaper: '',
      title: '',
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
    this.getComment(this.$route.query.id)
    this.getWallpaper(this.$route.query.id)
    this.fuzhi()
  },
  methods: {
    fuzhi() {
      this.commentForm.userId = this.$cookies.get('user').id
      this.commentForm.userName = this.$cookies.get('user').username
    },
    async getWallpaper(id) {
      const { data: res } = await this.$http.get(`/wallpaper/getById?id=${id}`)
      if (res.statue !== 200) {
        return this.$message.error('获取壁纸失败')
      }
      this.wallpaper = res.data.wallpaper
      this.title = this.wallpaper.title.split('.')[0]
      this.commentForm.articleId = res.data.wallpaper.id
    },
    async getComment(id) {
      const { data: res } = await this.$http.get(`/comment/findFiveCommentExamine?id=${id}`)
      if (res.statue !== 200) {
        return
      }
      this.commentList = res.data.commentList
    },
    async  likes(id) {
      if (!this.$cookies.get('user')) return this.$notify.error('请先登录')
      const { data: res } = await this.$http.get(`/wallpaper/likes?id=${id}`)
      if (res.statue !== 200) {
        return this.$notify.error('点赞失败')
      }
      this.getWallpaper(this.$route.query.id)
      return this.$notify({
        message: '点赞成功',
        type: 'success'
      })
    },
    showComment() {
      if (!this.$cookies.get('user')) return this.$notify.error('请先登录')
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
    },
    async download() {
      if (!this.$cookies.get('user')) return this.$notify.error('请先登录')
      const { data: res } = await this.$http.get(`/user/download?id=${this.$cookies.get('user').id}`)
      if (res.statue !== 200) {
        return this.$message.error('积分不足，下载失败')
      }
      document.getElementsByClassName('wallpapaerLink')[0].click()
      const { data: respo } = await this.$http.get(`user/findUserById?id=${this.$cookies.get('user').id}`)
      this.$cookies.set('user', respo.data.user)
      this.reload()
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
.wallpaper {
  width: 100%;
  height: 600px;
}
.wallpaper img {
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
