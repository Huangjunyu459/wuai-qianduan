<template>
  <div class="contribution">
    <el-tag class="mytag"><i class="el-icon-edit">看我</i></el-tag>
    <div class="statement">
      <ol>
        <li>欢迎大家踊跃投稿，凡是造福人类的事 我们一律支持！</li>
        <li>投稿后作品被下载和点赞收藏 投稿者都会获得相应的积分奖励哦！</li>
        <li>文章编辑完毕提交会进入审核阶，请按规定投稿哦!</li>
      </ol>
    </div>
    <el-tag class="mytag"><i class="el-icon-edit">上传格式</i></el-tag>
    <el-tabs value="article" @tab-click="handleClick">
      <el-tab-pane label="文章" name="article">
        <div>
          <el-form ref="articleFormRef" :model="articleForm" :rules="articleFormRules" label-width="100px" class="demo-ruleForm">
            <el-form-item label="文章标题" prop="title">
              <el-input v-model="articleForm.title" />
            </el-form-item>
            <el-form-item label="文章内容" prop="content">
              <el-input
                v-model="articleForm.content"
                placeholder="请使用 / 来进行分段"
                type="textarea"
                :autosize="{ minRows: 4, maxRows: 6}"
                maxlength="2000"
                show-word-limit
              />
            </el-form-item>
            <el-form-item label="文章封面">
              <el-upload
                ref="articleRef"
                class="upload-demo"
                drag
                name="file"
                action="http://localhost:8080/oss/uploadArticle"
                :multiple="false"
                :on-success="handleArticleSuccess"
              >
                <i class="el-icon-upload" />
                <div class="el-upload__text">将图片拖到此处，或<em>点击上传</em></div>
              </el-upload>
            </el-form-item>
            <el-form-item label="会员专属" prop="isVip">
              <el-switch v-model="articleForm.isVip" />
            </el-form-item>
            <el-form-item hidden label="作者id">
              <el-input v-model="authorId" />
            </el-form-item>
          </el-form>
          <el-button
            class="ubtn"
            size="mini"
            round
            type="success"
            @click="uploadArticle"
          ><i class="el-icon-check">上传文章</i></el-button>
        </div>
      </el-tab-pane>
      <el-tab-pane label="壁纸" name="wallpaper">
        <div>
          <el-form ref="wallpaperFormRef" :model="wallpaperForm" :rules="wallpaperFormRules" label-width="100px" class="demo-ruleForm">
            <el-form-item label="壁纸标题" prop="title">
              <el-input v-model="wallpaperForm.title" />
            </el-form-item>
            <el-form-item label="壁纸">
              <el-upload
                ref="wallpaperRef"
                class="upload-demo"
                drag
                name="file"
                action="http://localhost:8080/oss/uploadPic"
                :multiple="false"
                :on-success="handleWallpaperSuccess"
              >
                <i class="el-icon-upload" />
                <div class="el-upload__text">将图片拖到此处，或<em>点击上传</em></div>
              </el-upload>
            </el-form-item>
            <el-form-item label="会员专属" prop="isVip">
              <el-switch v-model="wallpaperForm.isVip" />
            </el-form-item>
            <el-form-item hidden label="作者id">
              <el-input v-model="authorId" />
            </el-form-item>
          </el-form>
          <el-button
            class="ubtn"
            size="mini"
            round
            type="success"
            @click="uploadWallpaper"
          ><i class="el-icon-check">上传壁纸</i></el-button>
        </div>
      </el-tab-pane>
      <el-tab-pane label="游戏" name="game">
        <div>
          <el-form ref="gameFormRef" :model="gameForm" :rules="gameFormRules" label-width="100px" class="demo-ruleForm">
            <el-form-item label="游戏名" prop="gameName">
              <el-input v-model="gameForm.gameName" />
            </el-form-item>
            <el-form-item label="游戏描述" prop="description">
              <el-input
                v-model="gameForm.description"
                type="textarea"
                :autosize="{ minRows: 4, maxRows: 6}"
                maxlength="200"
                show-word-limit
              />
            </el-form-item>
            <el-form-item label="游戏封面">
              <el-upload
                ref="gameRef"
                class="upload-demo"
                drag
                name="file"
                action="http://localhost:8080/oss/uploadGameCover"
                :multiple="false"
                :on-success="handleGameSuccess"
              >
                <i class="el-icon-upload" />
                <div class="el-upload__text">将图片拖到此处，或<em>点击上传</em></div>
              </el-upload>
            </el-form-item>
            <el-form-item label="百度云盘" prop="bdSrc">
              <el-input v-model="gameForm.bdSrc" />
            </el-form-item>
            <el-form-item label="提取码" prop="bdCode">
              <el-input v-model="gameForm.bdCode" />
            </el-form-item>
            <el-form-item label="解压码" prop="dCode">
              <el-input v-model="gameForm.dCode" />
            </el-form-item>
            <el-form-item label="会员专属" prop="isVip">
              <el-switch v-model="gameForm.isVip" />
            </el-form-item>
            <el-form-item hidden label="作者id">
              <el-input v-model="authorId" />
            </el-form-item>
          </el-form>
          <el-button
            class="ubtn"
            size="mini"
            round
            type="success"
            @click="uploadGame"
          ><i class="el-icon-check">上传游戏</i></el-button>
        </div>
      </el-tab-pane>
      <el-tab-pane label="音频" name="music">
        <div>
          <el-form ref="musicFormRef" :model="musicForm" :rules="musicFormRules" label-width="100px" class="demo-ruleForm">
            <el-form-item label="歌手名" prop="singer">
              <el-input v-model="musicForm.singer" />
            </el-form-item>
            <el-form-item label="歌曲名" prop="song">
              <el-input v-model="musicForm.song" />
            </el-form-item>
            <el-form-item label="歌曲封面">
              <el-upload
                ref="musicCoverRef"
                class="upload-demo"
                drag
                name="file"
                action="http://localhost:8080/oss/uploadMusicCover"
                :multiple="false"
                :on-success="handleMusicCoverSuccess"
              >
                <i class="el-icon-upload" />
                <div class="el-upload__text">将图片拖到此处，或<em>点击上传</em></div>
              </el-upload>
            </el-form-item>
            <el-form-item label="歌曲文件">
              <el-upload
                ref="musicRef"
                class="upload-demo"
                drag
                name="files"
                action="http://localhost:8080/oss/uploadMusic"
                :multiple="false"
                :on-success="handleMusicSuccess"
              >
                <i class="el-icon-upload" />
                <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
              </el-upload>
            </el-form-item>
            <el-form-item label="会员专属" prop="isVip">
              <el-switch v-model="musicForm.isVip" />
            </el-form-item>
            <el-form-item hidden label="作者id">
              <el-input v-model="authorId" />
            </el-form-item>
          </el-form>
          <el-button
            class="ubtn"
            size="mini"
            round
            type="success"
            @click="uploadMusic"
          ><i class="el-icon-check">上传音频</i></el-button>
        </div>
      </el-tab-pane>
      <el-tab-pane label="视频" name="video">
        <div>
          <el-form ref="videoFormRef" :model="videoForm" :rules="videoFormRules" label-width="100px" class="demo-ruleForm">
            <el-form-item label="视频名" prop="videoName">
              <el-input v-model="videoForm.videoName" />
            </el-form-item>
            <el-form-item label="视频文件">
              <el-upload
                ref="videoRef"
                class="upload-demo"
                drag
                name="file"
                action="http://localhost:8080/oss/uploadVideo"
                :multiple="false"
                :on-success="handleVideoSuccess"
              >
                <i class="el-icon-upload" />
                <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
              </el-upload>
            </el-form-item>
            <el-form-item label="会员专属" prop="isVip">
              <el-switch v-model="videoForm.isVip" />
            </el-form-item>
            <el-form-item hidden label="作者id">
              <el-input v-model="authorId" />
            </el-form-item>
          </el-form>
          <el-button
            class="ubtn"
            size="mini"
            round
            type="success"
            @click="uploadVideo"
          ><i class="el-icon-check">上传视频</i></el-button>
        </div>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
export default {
  inject: ['reload'],
  data() {
    //  提取码验证规则
    var checckCode = (rule, value, cb) => {
      //  验证的正则表达式
      const regCode = /^[A-Za-z0-9]+$/
      if (regCode.test(value)) {
        //    合法的提取码
        return cb()
      }

      cb(new Error('提取码只能是数字或英文'))
    }
    return {
      articleForm: {
        title: '',
        content: '',
        articleCover: '',
        authorId: '',
        isVip: false
      },
      articleFormRules: {
        title: [
          { required: true, message: '请输入文章标题', trigger: 'blur' },
          {
            min: 1,
            max: 50,
            message: '长度在 1 到 50 个字符',
            trigger: 'blur'
          }
        ],
        content: [
          { required: true, message: '请输入文章内容', trigger: 'blur' },
          {
            min: 20,
            max: 2000,
            message: '长度在 20 到 2000 个字符',
            trigger: 'blur'
          }
        ]
      },

      wallpaperForm: {
        title: '',
        ossSrc: '',
        authorId: '',
        isVip: false
      },
      wallpaperFormRules: {
        title: [
          { required: true, message: '请输入壁纸名称', trigger: 'blur' },
          {
            min: 1,
            max: 50,
            message: '长度在 1 到 50 个字符',
            trigger: 'blur'
          }
        ]

      },

      gameForm: {
        gameName: '',
        description: '',
        gameCover: '',
        bdSrc: '',
        bdCode: '',
        dCode: '',
        authorId: '',
        isVip: false
      },
      gameFormRules: {
        gameName: [
          { required: true, message: '请输入游戏名称', trigger: 'blur' },
          {
            min: 1,
            max: 50,
            message: '长度在 1 到 50 个字符',
            trigger: 'blur'
          }
        ],
        description: [
          { required: true, message: '请输入游戏描述', trigger: 'blur' },
          {
            min: 20,
            max: 200,
            message: '长度在 20 到 200 个字符',
            trigger: 'blur'
          }
        ],
        bdSrc: [
          { required: true, message: '请输入百度云盘', trigger: 'blur' },
          {
            min: 10,
            max: 200,
            message: '长度在 10 到 200 个字符',
            trigger: 'blur'
          }
        ],
        bdCode: [
          { required: true, message: '请输入提取码', trigger: 'blur' },
          { validator: checckCode, trigger: 'blur' },
          {
            min: 4,
            max: 4,
            message: '长度为 4 个字符',
            trigger: 'blur'
          }
        ],
        dCode: [
          {
            min: 0,
            max: 50,
            message: '长度不能超过50个字符',
            trigger: 'blur'
          }
        ]
      },

      musicForm: {
        singer: '',
        song: '',
        ossSrc: '',
        musicCover: '',
        authorId: '',
        isVip: false
      },
      musicFormRules: {
        singer: [
          { required: true, message: '请输入歌手名', trigger: 'blur' },
          {
            min: 1,
            max: 50,
            message: '长度在 1 到 50 个字符',
            trigger: 'blur'
          }
        ],
        song: [
          { required: true, message: '请输入歌曲名', trigger: 'blur' },
          {
            min: 1,
            max: 50,
            message: '长度在 1 到 50 个字符',
            trigger: 'blur'
          }
        ]
      },
      videoForm: {
        videoName: '',
        ossSrc: '',
        authorId: '',
        isVip: false
      },
      videoFormRules: {
        videoName: [
          { required: true, message: '请输入视频名', trigger: 'blur' },
          {
            min: 1,
            max: 50,
            message: '长度在 1 到 50 个字符',
            trigger: 'blur'
          }
        ]
      }
    }
  },
  created() {
    this.fuzhi()
  },
  methods: {
    fuzhi() {
      this.articleForm.authorId = this.$cookies.get('user').id
      this.wallpaperForm.authorId = this.$cookies.get('user').id
      this.gameForm.authorId = this.$cookies.get('user').id
      this.musicForm.authorId = this.$cookies.get('user').id
      this.videoForm.authorId = this.$cookies.get('user').id
    },
    handleArticleSuccess(responese) {
      this.articleForm.articleCover = responese.data
    },
    async uploadArticle() {
      const { data: res } = await this.$http.post(`/article/addArticle`, this.articleForm)
      if (res.statue !== 200) {
        return this.$message.error('上传失败')
      }
      this.$refs.articleFormRef.resetFields()
      this.$refs.articleRef.clearFiles()
      this.reload()
      return this.$message.success('上传成功')
    },
    handleWallpaperSuccess(responese) {
      console.log('responese.data:' + responese.data)
      this.wallpaperForm.ossSrc = responese.data
      console.log('wallpaperform.ossSrc:' + this.wallpaperForm.ossSrc)
    },
    async uploadWallpaper() {
      const { data: res } = await this.$http.post(`/wallpaper/addWallpaper`, this.wallpaperForm)
      if (res.statue !== 200) {
        return this.$message.error('上传失败')
      }
      this.$refs.wallpaperFormRef.resetFields()
      this.$refs.wallpaperRef.clearFiles()
      this.reload()
      return this.$message.success('上传成功')
    },
    handleGameSuccess(responese) {
      this.gameForm.gameCover = responese.data
    },
    async uploadGame() {
      const { data: res } = await this.$http.post(`/game/addGame`, this.gameForm)
      if (res.statue !== 200) {
        return this.$message.error('上传失败')
      }
      this.$refs.gameFormRef.resetFields()
      this.$refs.gameRef.clearFiles()
      this.reload()
      return this.$message.success('上传成功')
    },
    handleMusicSuccess(responese) {
      console.log(responese.data)
      this.musicForm.ossSrc = responese.data
      console.log(this.musicForm.ossSrc)
    },
    handleMusicCoverSuccess(responese) {
      this.musicForm.musicCover = responese.data
    },
    async uploadMusic() {
      const { data: res } = await this.$http.post(`/music/addMusic`, this.musicForm)
      if (res.statue !== 200) {
        return this.$message.error('上传失败')
      }
      this.$refs.musicFormRef.resetFields()
      this.$refs.musicRef.clearFiles()
      this.$refs.musicCoverRef.clearFiles()
      this.reload()
      return this.$message.success('上传成功')
    },
    handleVideoSuccess(responese) {
      this.videoForm.ossSrc = responese.data
    },
    async uploadVideo() {
      const { data: res } = await this.$http.post(`/video/addVideo`, this.videoForm)
      if (res.statue !== 200) {
        return this.$message.error('上传失败')
      }
      this.$refs.videoFormRef.resetFields()
      this.$refs.videoRef.clearFiles()
      this.reload()
      return this.$message.success('上传成功')
    }
  }

}
</script>

<style lang="less" scoped>
.contribution {
  width: 100%;
}
.mytag {
  text-align: center;
  width: 100px;
  height: 40px;
  font-size: 15px;
  line-height: 40px;
  border-radius: 20px;
}
.ubtn{
  margin-left: 300px;
  width: 300px;
}
</style>
