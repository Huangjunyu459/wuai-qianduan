<template>
  <el-container class="home_container">
    <!-- 头部区域 -->
    <el-header>
      <div>
        <img src="../assets/bigwhite.jpg" alt="logo">
        <span>吾爱后台管理系统</span>
      </div>
      <el-button type="info" @click="logout">退出</el-button>
    </el-header>
    <!-- 页面主体区域 -->
    <el-container>
      <!-- 侧边栏 -->
      <el-aside :width="isCollapse ? '64px' : '200px'">
        <div class="toggle-button" @click="toggleCollapse">|||</div>
        <!-- 侧边栏菜单区域 -->
        <el-menu
          text-color="#fff"
          active-text-color="#409EFF"
          background-color="#333744"
          :unique-opened="true"
          :collapse="isCollapse"
          :collapse-transition="false"
          :router="true"
          :default-active="$route.path"
        >
          <!-- 一级菜单 -->
          <el-submenu index="1">
            <!-- 一级菜单模板区域 -->
            <template slot="title">
              <!-- 图表 -->
              <i class="el-icon-user" />
              <!-- 文本 -->
              <span>用户管理</span>
            </template>
            <!-- 二级菜单 -->
            <el-menu-item index="/user/findAllUser">
              <template slot="title">
                <!-- 图表 -->
                <i class="el-icon-menu" />
                <!-- 文本 -->
                <span>用户列表</span>
              </template>
            </el-menu-item>
            <el-menu-item index="/user/findIsDelete">
              <template slot="title">
                <!-- 图表 -->
                <i class="el-icon-menu" />
                <!-- 文本 -->
                <span>已删除用户</span>
              </template>
            </el-menu-item>
          </el-submenu>
          <el-submenu index="2">
            <!-- 一级菜单模板区域 -->
            <template slot="title">
              <!-- 图表 -->
              <i class="iconfont icon-jiaoseguanli" />
              <!-- 文本 -->
              <span>角色管理</span>
            </template>
            <!-- 二级菜单 -->
            <el-menu-item index="/roles/findAllRoles">
              <template slot="title">
                <!-- 图表 -->
                <i class="el-icon-menu" />
                <!-- 文本 -->
                <span>角色列表</span>
              </template>
            </el-menu-item>
            <el-menu-item index="/roles/findIsDelete">
              <template slot="title">
                <!-- 图表 -->
                <i class="el-icon-menu" />
                <!-- 文本 -->
                <span>已删除角色</span>
              </template>
            </el-menu-item>
          </el-submenu>
          <el-submenu index="3">
            <!-- 一级菜单模板区域 -->
            <template slot="title">
              <!-- 图表 -->
              <i class="iconfont icon-fenlei" />
              <!-- 文本 -->
              <span>分类管理</span>
            </template>
            <!-- 二级菜单 -->
            <el-menu-item index="/category/findAllCategory">
              <template slot="title">
                <!-- 图表 -->
                <i class="el-icon-menu" />
                <!-- 文本 -->
                <span>分类列表</span>
              </template>
            </el-menu-item>
            <el-menu-item index="/category/findIsDelete">
              <template slot="title">
                <!-- 图表 -->
                <i class="el-icon-menu" />
                <!-- 文本 -->
                <span>已删除分类</span>
              </template>
            </el-menu-item>
          </el-submenu>
          <el-submenu index="4">
            <!-- 一级菜单模板区域 -->
            <template slot="title">
              <!-- 图表 -->
              <i class="iconfont icon-hanhan-01-01" />
              <!-- 文本 -->
              <span>游戏管理</span>
            </template>
            <!-- 二级菜单 -->
            <el-menu-item index="/game/findAllGameExamine">
              <template slot="title">
                <!-- 图表 -->
                <i class="el-icon-menu" />
                <!-- 文本 -->
                <span>已审核游戏</span>
              </template>
            </el-menu-item>
            <el-menu-item index="/game/findAllGameNoExamine">
              <template slot="title">
                <!-- 图表 -->
                <i class="el-icon-menu" />
                <!-- 文本 -->
                <span>未审核游戏</span>
              </template>
            </el-menu-item>
            <el-menu-item index="/game/findIsDelete">
              <template slot="title">
                <!-- 图表 -->
                <i class="el-icon-menu" />
                <!-- 文本 -->
                <span>已删除游戏</span>
              </template>
            </el-menu-item>
          </el-submenu>
          <el-submenu index="5">
            <!-- 一级菜单模板区域 -->
            <template slot="title">
              <!-- 图表 -->
              <i class="iconfont icon-iconset0148" />
              <!-- 文本 -->
              <span>壁纸管理</span>
            </template>
            <!-- 二级菜单 -->
            <el-menu-item index="/wallpaper/findAllWallpaperExamine">
              <template slot="title">
                <!-- 图表 -->
                <i class="el-icon-menu" />
                <!-- 文本 -->
                <span>已审核壁纸</span>
              </template>
            </el-menu-item>
            <el-menu-item index="/wallpaper/findAllWallpaperNoExamine">
              <template slot="title">
                <!-- 图表 -->
                <i class="el-icon-menu" />
                <!-- 文本 -->
                <span>未审核壁纸</span>
              </template>
            </el-menu-item>
            <el-menu-item index="/wallpaper/findIsDelete">
              <template slot="title">
                <!-- 图表 -->
                <i class="el-icon-menu" />
                <!-- 文本 -->
                <span>已删除壁纸</span>
              </template>
            </el-menu-item>
          </el-submenu>
          <el-submenu index="6">
            <!-- 一级菜单模板区域 -->
            <template slot="title">
              <!-- 图表 -->
              <i class="iconfont icon-16" />
              <!-- 文本 -->
              <span>文章管理</span>
            </template>
            <!-- 二级菜单 -->
            <el-menu-item index="/article/findAllArticleExamine">
              <template slot="title">
                <!-- 图表 -->
                <i class="el-icon-menu" />
                <!-- 文本 -->
                <span>已审核文章</span>
              </template>
            </el-menu-item>
            <el-menu-item index="/article/findAllArticleNoExamine">
              <template slot="title">
                <!-- 图表 -->
                <i class="el-icon-menu" />
                <!-- 文本 -->
                <span>未审核文章</span>
              </template>
            </el-menu-item>
            <el-menu-item index="/article/findIsDelete">
              <template slot="title">
                <!-- 图表 -->
                <i class="el-icon-menu" />
                <!-- 文本 -->
                <span>已删除文章</span>
              </template>
            </el-menu-item>
          </el-submenu>
          <el-submenu index="7">
            <!-- 一级菜单模板区域 -->
            <template slot="title">
              <!-- 图表 -->
              <i class="iconfont icon-yinpin" />
              <!-- 文本 -->
              <span>音频管理</span>
            </template>
            <!-- 二级菜单 -->
            <el-menu-item index="/music/findAllMusicExamine">
              <template slot="title">
                <!-- 图表 -->
                <i class="el-icon-menu" />
                <!-- 文本 -->
                <span>已审核音频</span>
              </template>
            </el-menu-item>
            <el-menu-item index="/music/findAllMusicNoExamine">
              <template slot="title">
                <!-- 图表 -->
                <i class="el-icon-menu" />
                <!-- 文本 -->
                <span>未审核音频</span>
              </template>
            </el-menu-item>
            <el-menu-item index="/music/findIsDelete">
              <template slot="title">
                <!-- 图表 -->
                <i class="el-icon-menu" />
                <!-- 文本 -->
                <span>已删除音频</span>
              </template>
            </el-menu-item>
          </el-submenu>
          <el-submenu index="8">
            <!-- 一级菜单模板区域 -->
            <template slot="title">
              <!-- 图表 -->
              <i class="iconfont icon-shipin" />
              <!-- 文本 -->
              <span>视频管理</span>
            </template>
            <!-- 二级菜单 -->
            <el-menu-item index="/video/findAllVideoExamine">
              <template slot="title">
                <!-- 图表 -->
                <i class="el-icon-menu" />
                <!-- 文本 -->
                <span>已审核视频</span>
              </template>
            </el-menu-item>
            <el-menu-item index="/video/findAllVideoNoExamine">
              <template slot="title">
                <!-- 图表 -->
                <i class="el-icon-menu" />
                <!-- 文本 -->
                <span>未审核视频</span>
              </template>
            </el-menu-item>
            <el-menu-item index="/video/findIsDelete">
              <template slot="title">
                <!-- 图表 -->
                <i class="el-icon-menu" />
                <!-- 文本 -->
                <span>已删除视频</span>
              </template>
            </el-menu-item>
          </el-submenu>
          <el-submenu index="9">
            <!-- 一级菜单模板区域 -->
            <template slot="title">
              <!-- 图表 -->
              <i class="iconfont icon-shipin" />
              <!-- 文本 -->
              <span>评论管理</span>
            </template>
            <!-- 二级菜单 -->
            <el-menu-item index="/comment/findAllCommentExamine">
              <template slot="title">
                <!-- 图表 -->
                <i class="el-icon-menu" />
                <!-- 文本 -->
                <span>已审核评论</span>
              </template>
            </el-menu-item>
            <el-menu-item index="/comment/findAllCommentNoExamine">
              <template slot="title">
                <!-- 图表 -->
                <i class="el-icon-menu" />
                <!-- 文本 -->
                <span>未审核评论</span>
              </template>
            </el-menu-item>
            <el-menu-item index="/comment/findIsDelete">
              <template slot="title">
                <!-- 图表 -->
                <i class="el-icon-menu" />
                <!-- 文本 -->
                <span>已删除评论</span>
              </template>
            </el-menu-item>
          </el-submenu>
          <el-submenu index="10">
            <!-- 一级菜单模板区域 -->
            <template slot="title">
              <!-- 图表 -->
              <i class="iconfont icon-shipin" />
              <!-- 文本 -->
              <span>激活码管理</span>
            </template>
            <!-- 二级菜单 -->
            <el-menu-item index="/activeCode/findActiveCode">
              <template slot="title">
                <!-- 图表 -->
                <i class="el-icon-menu" />
                <!-- 文本 -->
                <span>未使用激活码</span>
              </template>
            </el-menu-item>
            <el-menu-item index="/activeCode/findIsDelete">
              <template slot="title">
                <!-- 图表 -->
                <i class="el-icon-menu" />
                <!-- 文本 -->
                <span>已使用激活码</span>
              </template>
            </el-menu-item>
          </el-submenu>
        </el-menu>
      </el-aside>
      <!-- 右侧内容主体区域 -->
      <el-main>
        <!-- 路由占位符 -->
        <router-view />
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
export default {
  data() {
    return {
      //  是否折叠
      isCollapse: false
    }
  },
  methods: {
    //    退出功能
    logout: function() {
      window.sessionStorage.clear()
      this.$router.push('/login')
    },
    //  点击按钮，切换菜单的折叠与展开
    toggleCollapse: function() {
      this.isCollapse = !this.isCollapse
    }
  }
}
</script>

<style lang="less" scoped>
.home_container {
  height: 100%;
}
.el-header {
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
.el-aside {
  background-color: #333744;
  .el-menu {
    border-right: none;
  }
}
.el-main {
  background-color: #eaedf1;
}
.iconfont {
  margin-right: 10px;
}
.toggle-button {
  background-color: #4a5064;
  font-size: 10px;
  line-height: 24px;
  color: #fff;
  text-align: center;
  letter-spacing: 0.5em;
  cursor: pointer;
}
</style>
