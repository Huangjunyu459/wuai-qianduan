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
                type="textarea"
                :autosize="{ minRows: 4, maxRows: 6}"
                maxlength="300"
                show-word-limit
              />
            </el-form-item>
            <el-form-item label="文章封面">
              <el-upload
                class="upload-demo"
                drag
                name="file"
                action="https://jsonplaceholder.typicode.com/posts/"
                :multiple="false"
              >
                <i class="el-icon-upload" />
                <div class="el-upload__text">将图片拖到此处，或<em>点击上传</em></div>
              </el-upload>
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
          ><i class="el-icon-check">上传文章</i></el-button>
        </div>
      </el-tab-pane>
      <el-tab-pane label="壁纸" name="wallpaper">
        <div>
          <el-form ref="wallpaperFormRef" :model="wallpaperForm" :rules="wallpaperFormRules" label-width="100px" class="demo-ruleForm">
            <el-form-item label="壁纸标题" prop="title">
              <el-input v-model="wallpaerForm.title" />
            </el-form-item>
            <el-form-item label="壁纸">
              <el-upload
                class="upload-demo"
                drag
                name="file"
                action="https://jsonplaceholder.typicode.com/posts/"
                :multiple="false"
              >
                <i class="el-icon-upload" />
                <div class="el-upload__text">将图片拖到此处，或<em>点击上传</em></div>
              </el-upload>
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
                class="upload-demo"
                drag
                name="file"
                action="https://jsonplaceholder.typicode.com/posts/"
                :multiple="false"
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
            <el-form-item hidden label="作者id">
              <el-input v-model="authorId" />
            </el-form-item>
          </el-form>
          <el-button
            class="ubtn"
            size="mini"
            round
            type="success"
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
                class="upload-demo"
                drag
                name="file"
                action="https://jsonplaceholder.typicode.com/posts/"
                :multiple="false"
              >
                <i class="el-icon-upload" />
                <div class="el-upload__text">将图片拖到此处，或<em>点击上传</em></div>
              </el-upload>
            </el-form-item>
            <el-form-item label="歌曲文件">
              <el-upload
                class="upload-demo"
                drag
                name="file"
                action="https://jsonplaceholder.typicode.com/posts/"
                :multiple="false"
              >
                <i class="el-icon-upload" />
                <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
              </el-upload>
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
                class="upload-demo"
                drag
                name="file"
                action="https://jsonplaceholder.typicode.com/posts/"
                :multiple="false"
              >
                <i class="el-icon-upload" />
                <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
              </el-upload>
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
          ><i class="el-icon-check">上传视频</i></el-button>
        </div>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
export default {
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
        articleCover: ''
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
            max: 300,
            message: '长度在 20 到 300 个字符',
            trigger: 'blur'
          }
        ]
      },

      wallpaerForm: {
        title: '',
        ossSrc: ''
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
        bdSrc: '',
        bdCode: '',
        dCode: ''
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
        ossSrc: ''
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
        ossSrc: ''
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
      },

      authorId: ''
    }
  },
  methods: {

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
