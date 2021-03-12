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
        <el-button class="lbtn">登录</el-button>
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
    return {
      // 用户登录状态
      islogin: true,
      // 用户信息是否显示
      userInfo: false
    }
  },
  methods: {
    showUserInfo() {
      this.userInfo = true
    },
    NoShowUserInfo() {
      this.userInfo = false
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
  background-color: rgb(224, 183, 48);
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
