<template>
  <el-container class="index_container">
    <!-- 头部区域 -->
    <el-header style="height: 300px">
      <!-- 地址发布页 -->
      <div class="links">
        <el-link
          :underline="false"
          type="info"
          icon="el-icon-edit"
        >地址发布页</el-link>
      </div>
      <!-- logo首页连接 -->
      <div class="logoPic">
        <img src="../../assets/banner.png" alt="logo">
      </div>
      <el-menu
        id="navigation"
        :router="true"
        class="el-menu-demo"
        mode="horizontal"
      >
        <el-menu-item index="/main"> 首页 </el-menu-item>
        <el-menu-item index="/wallpaper"> 壁纸 </el-menu-item>
        <el-menu-item index="/article"> 文章 </el-menu-item>
        <el-menu-item index="/game"> 游戏 </el-menu-item>
        <el-menu-item index="/music"> 音频 </el-menu-item>
        <el-menu-item index="/video"> 视频 </el-menu-item>
        <el-menu-item index="/vip"> 会员专区 </el-menu-item>
      </el-menu>
      <!-- 用户已登录区域 -->
      <div
        v-if="islogin"
        id="loginbox"
        class="loginbox"
        @mouseover="showUserInfo"
        @mouseout="NoShowUserInfo"
      >
        <img
          src="https://2021article.oss-cn-hangzhou.aliyuncs.com/pic/ae2483538378479f84c66a6a89384e5c_%E9%BB%98%E8%AE%A4%E5%A4%B4%E5%83%8F.jpg"
          alt=""
        >
      </div>

      <!-- 用户未登录区域 -->
      <div v-if="!islogin" class="loginbox">
        <el-button class="lbtn" @click="showLoginBox">登录</el-button>
      </div>

      <!-- 显示用户信息区域 -->
      <div
        v-show="userInfo"
        class="userInfo"
        @mouseover="showUserInfo"
        @mouseout="NoShowUserInfo"
      >
        <i class="el-icon-medal"><span>用户积分</span></i>
        <div class="psetting">
          个人设置<br>
          <el-link
            href="/personInfo"
            :underline="false"
          ><i class="el-icon-user-solid">我的概述</i></el-link><br>
          <el-link
            href="personSetting"
            :underline="false"
          ><i class="el-icon-s-tools">我的设置</i></el-link><br>
          <el-link
            :underline="false"
            @click="logout"
          ><i class="el-icon-switch-button">登出</i></el-link><br>
        </div>
        <div class="asetting">
          文章管理<br>
          <el-link
            href="/contribution"
            :underline="false"
          ><i class="el-icon-edit">up投稿</i></el-link><br>
          <el-link
            :underline="false"
          ><i class="el-icon-document">我的作品</i></el-link><br>
          <el-link
            :underline="false"
          ><i class="el-icon-chat-round">评论管理</i></el-link><br>
        </div>
      </div>

      <el-dialog
        style="border-radius: 25px"
        :visible.sync="loginFormVisible"
        width="30%"
        :before-close="handleClose"
        @close="loginFormClosed"
      >
        <el-tabs value="login" @tab-click="handleClick">
          <el-tab-pane label="登录" name="login">
            <p style="margin-left: 180px">欢迎登录</p>
            <el-form
              ref="loginFormRef"
              size="small "
              :model="loginForm"
              label-width="100px"
            >
              <el-form-item label="昵称">
                <el-input v-model="loginForm.username" />
              </el-form-item>
              <el-form-item label="密码">
                <el-input v-model="loginForm.password" />
              </el-form-item>
            </el-form>
            <el-button
              style="border-radius: 25px; margin-left: 150px; width: 150px"
              type="success"
            ><i class="el-icon-check">登录</i></el-button>
          </el-tab-pane>
          <el-tab-pane label="注册" name="register">
            <el-form
              ref="registerFormRef"
              :model="registerForm"
              :rules="registerFormRules"
              label-width="100px"
            >
              <el-form-item label="昵称" prop="username">
                <el-input v-model="registerForm.username" />
              </el-form-item>
              <el-form-item label="邮箱" prop="email">
                <el-input v-model="registerForm.email" />
              </el-form-item>
              <el-form-item label="密码" prop="password">
                <el-input v-model="registerForm.password" />
              </el-form-item>
            </el-form>
            <el-button
              style="border-radius: 25px; margin-left: 150px; width: 150px"
              type="success"
            ><i class="el-icon-check">注册</i></el-button>
          </el-tab-pane>
          <el-tab-pane label="丢失密码" name="findPS">
            <p>
              如果您忘记了账号密码，您可以通过账号邮箱来重置密码。请输入您的账号邮箱，我们将会发送一封确认邮件，并根据提示重置您的密码。
            </p>
            <el-form
              ref="findPSFormRef"
              :model="findPSForm"
              :rules="findPSFormRules"
              label-width="100px"
            >
              <el-form-item label="邮箱" prop="email">
                <el-input v-model="findPSForm.email" />
              </el-form-item>
              <el-form-item label="邮箱验证码">
                <el-input v-model="findPSForm.checkCoed" />
              </el-form-item>
              <el-form-item label="新密码" prop="newPassword">
                <el-input v-model="findPSForm.newPassword" />
              </el-form-item>
            </el-form>
            <el-button
              style="border-radius: 25px; "
              type="primary"
            ><i class="el-icon-message">发送验证码到邮箱</i></el-button>
            <el-button
              style="border-radius: 25px; margin-left: 150px; width: 150px"
              type="success"
            ><i class="el-icon-check">确认更新密码</i></el-button>
          </el-tab-pane>
        </el-tabs>
      </el-dialog>
    </el-header>

    <!-- main 主页 -->
    <el-main>
      <div class="main">
        <router-view />
      </div>
    </el-main>

    <!-- 页脚 -->
    <el-footer style="height: 300px">
      <div class="footer">
        <p>
          <b>联系我</b> <br><br>
          如果您有任何版权疑问，或广告合作，请发站内私信
          或者发送电子邮件联系我（541605007@qq,com）。
        </p>
        <p>
          If you have any copyright questions, or advertising cooperation,
          please send me a private message or email (541605007@qq.com).
        </p>
      </div>
      <div class="footer-statement">
        <p>
          <b>关于吾爱分享</b> <br><br>
          所有资源来自网友分享，本站只提供用户交互平台，且本站本地并无存储任何资源！
        </p>
      </div>
      <div class="copyright">
        <p>版权所有 © 吾爱分享 2021</p>
      </div>
    </el-footer>
  </el-container>
</template>

<script>
import navigation from '../../assets/js/navigation'
export default {
  data() {
    //    邮箱验证规则
    var checkEmail = (rule, value, cb) => {
      //  验证邮箱的正则表达式
      const regEamil = /^\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/
      if (regEamil.test(value)) {
        //    合法的邮箱
        return cb()
      }

      cb(new Error('请输入合法的邮箱'))
    }

    //  密码验证规则
    var checkPassword = (rule, value, cb) => {
      //  验证密码的正则表达式
      const regPS = /^[A-Za-z0-9]+$/
      if (regPS.test(value)) {
        //    合法的密码
        return cb()
      }

      cb(new Error('密码由字母和数字构成'))
    }
    return {
      // 用户登录状态
      islogin: true,
      //  控制用户登录框显示与隐藏
      loginFormVisible: false,
      // 用户信息是否显示
      userInfo: false,
      loginForm: {
        username: '',
        password: ''
      },
      registerForm: {
        username: '',
        email: '',
        password: ''
      },
      registerFormRules: {
        username: [
          { required: true, message: '请输入用户名', trigger: 'blur' },
          {
            min: 3,
            max: 16,
            message: '长度在 3 到 16 个字符',
            trigger: 'blur'
          }
        ],
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' },
          { validator: checkPassword, trigger: 'blur' },
          {
            min: 6,
            max: 16,
            message: '长度在 6 到 16 个字符',
            trigger: 'blur'
          }
        ],
        email: [
          { required: true, message: '请输入邮箱', trigger: 'blur' },
          { validator: checkEmail, trigger: 'blur' },
          {
            min: 6,
            max: 16,
            message: '长度在 6 到 16 个字符',
            trigger: 'blur'
          }
        ]
      },
      findPSForm: {
        email: '',
        checkCoed: '',
        newPassword: ''
      },
      findPSFormRules: {
        newPassword: [
          { required: true, message: '请输入密码', trigger: 'blur' },
          { validator: checkPassword, trigger: 'blur' },
          {
            min: 6,
            max: 16,
            message: '长度在 6 到 16 个字符',
            trigger: 'blur'
          }
        ],
        email: [
          { required: true, message: '请输入邮箱', trigger: 'blur' },
          { validator: checkEmail, trigger: 'blur' },
          {
            min: 6,
            max: 16,
            message: '长度在 6 到 16 个字符',
            trigger: 'blur'
          }
        ]
      }
    }
  },
  methods: {
    showUserInfo() {
      this.userInfo = true
    },
    NoShowUserInfo() {
      this.userInfo = false
    },
    //  监听修改用户对话框的关闭事件
    showLoginBox() {
      this.loginFormVisible = true
    },
    loginFormClosed() {
      this.$refs.loginFormRef.resetFields()
      this.$refs.registerFormRef.resetFields()
      this.$refs.findPSFormRef.resetFields()
    },
    //    退出功能
    logout: function() {
      window.sessionStorage.clear()
      this.$router.push('/index')
    }
  }
}
</script>

<style lang="less" scoped>
.el-header {
  position: relative;
  background-color: #37314d;
  display: flex;
  justify-content: space-between;
  padding-left: 0;
  align-items: center;
  color: #fff;
  font-size: 20px;
  > div {
    display: flex;
    align-items: center;
    span {
      margin-left: 15px;
    }
  }
}
.el-footer {
  position: relative;
  background-color: rgb(137, 152, 182);
  display: flex;
  justify-content: space-between;
  padding-left: 0;
  align-items: center;
  color: rgb(58, 54, 54);
  font-size: 20px;
  > div {
    display: flex;
    align-items: center;
    span {
      margin-left: 15px;
    }
  }
}
.crumbs {
  margin-top: 20px;
}

.loginbox {
  width: 70px;
  height: 70px;
  position: absolute;
  top: 240px;
  right: 300px;
  border-radius: 25px;
  font-size: 14px;
  text-align: center;
  > img {
    width: 100%;
    height: 100%;
    border-radius: 25px;
  }
}
.lbtn {
  width: 70px;
  height: 70px;
  border-radius: 25px;
}
.userInfo {
  position: absolute;
  top: 240px;
  right: 370px;
  width: 400px;
  height: 200px;
  border-radius: 25px;
  z-index: 999;
  text-align: center;
  background-color: rgb(105, 152, 190);
  > i {
    position: absolute;
    top: 10px;
    left: 140px;
    font-size: 16px;
  }
}
.psetting {
  display: inline-block;
  position: absolute;
  bottom: 0px;
  width: 180px;
  height: 80%;
  border-radius: 25px;
}
.asetting {
  display: inline-block;
  position: absolute;
  bottom: 0px;
  right: 0px;
  width: 180px;
  height: 80%;
  border-radius: 25px;
}
.el-menu-demo {
  position: absolute;
  top: 260px;
  left: 350px;
  background-color: whitesmoke;
  opacity: 0.8;
  border-radius: 25px;
}
.el-menu-item {
  margin-left: 30px;
  border-radius: 25px;
}

.links {
  position: absolute;
  top: 10px;
  right: 380px;
  width: 105px;
  height: 35px;
  border-radius: 25px;
  background-color: #fff;
  opacity: 0.6;
}
.logoPic {
  width: 100%;
  height: 300px;
}
.logoPic img {
  width: 110%;
  height: 310px;
}
.main {
  width: 1000px;
  margin-left: 350px;
}
.footer {
  width: 500px;
  height: 200px;
  font-size: 14px;
  margin-left: 100px;
}
.footer p {
  margin-left: 50px;
}
.footer-statement {
  width: 300px;
  height: 100px;
  margin: 0 725px 100px 0;
  font-size: 14px;
}
.copyright {
  position: absolute;
  left: 700px;
  bottom: 20px;
  width: 250px;
  height: 30px;
  font-size: 14px;
}
</style>
