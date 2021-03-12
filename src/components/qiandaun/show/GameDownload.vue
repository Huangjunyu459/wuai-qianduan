<template>
  <div>
    <!-- 面包屑区域 -->
    <el-breadcrumb class="crumbs" separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/index' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item :to="{ path: '/game' }">游戏 </el-breadcrumb-item>
      <el-breadcrumb-item>游戏下载 </el-breadcrumb-item>
      <el-breadcrumb-item>游戏名 </el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 游戏下载页面 -->
    <div class="showbox">
      <!-- 游戏描述 -->
      <div class="gameName">
        <p>你正准备下载（游戏名）</p>
      </div>
    </div>

    <!-- 获取声明区域 -->
    <div class="statement">
      <i class="el-icon-caret-bottom">获取说明</i>
      <p>
        本站为爱好者的兴趣交流站，不含上传下载及经营性内容，站内所提供的内容均依据为各大动漫官方、站点提供的公开引用资源。
      </p>
      <p>
        如有侵犯您的版权或触犯法律的内容请发邮件告知，我们将会在24小时内处理。联系邮箱：541605007@qq.com
      </p>
      <p>
        If there is any content that violates your copyright or violates the
        law, please send an email to let us know, and we will deal with it
        within 48 hours. Contact email: 541605007@qq.com
      </p>
    </div>

    <!-- 下载区域 -->
    <div class="download">
      <i class="el-icon-caret-bottom">下载链接</i>
      <!-- 提取密码区域 -->
      <div class="download_form">
        <i class="el-icon-unlock"><span style="margin-left:8px">提取密码</span></i>
        <el-input
          v-model="input3"
          class="input-with-select"
        >
          <el-button slot="append" class="cbtn" icon="el-icon-document-copy" />
        </el-input>
      </div>
      <!-- 解压密码区域 -->
      <div class="download_form">
        <i class="el-icon-key"><span style="margin-left:8px">解压密码</span></i>
        <el-input
          v-model="input3"
          class="input-with-select"
        >
          <el-button slot="append" class="cbtn" icon="el-icon-document-copy" />
        </el-input>
      </div>

      <!-- 下载按钮区域 -->
      <el-button class="dbtn" icon="el-icon-download" type="success" round>下载</el-button>
    </div>
  </div>
</template>

<script>
export default {}
</script>

<style lang="less" scoped>
.crumbs {
  margin-top: 20px;
}
.showbox {
  margin-top: 20px;
  width: 100%;
}
.gameName p {
  text-align: center;
  color: rgb(223, 57, 57);
}
.statement {
  font-size: 14px;
  color: rgb(63, 64, 65);
}
.statement i,
.download>i {
  font-weight: 900;
  font-size: 30px;
}
.statement p {
  font-size: 20px;
  color: rgb(58, 66, 66);
}
.download_form{
  margin-top: 15px;
}
.input-with-select{
  text-align: center;
  margin-left: 40px;
  width: 700px;
  border-radius: 25px;
}
.dbtn{
  margin: 15px 0   0 15px;
  width: 80%;
  height: 40px;
}
</style>
