<template>
  <div>
    <!-- 面包屑区域 -->
    <el-breadcrumb class="crumbs" separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/index' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>查找音乐 </el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 搜索与添加区域 -->
    <!-- <div style="margin-top: 15px;">
      <el-input v-model="input3" placeholder="请输入内容" class="input-with-select">
        <el-button slot="append" icon="el-icon-search" />
      </el-input>
    </div> -->

    <!-- 最新壁纸区域 -->
    <div class="music">
      <el-link
        style="font-size: 25px"
        :underline="false"
        icon="el-icon-star-on"
        type="info"
      >查询结果</el-link>
      <el-row :gutter="20">
        <el-col v-for="o in musicList" :key="o" :span="6">
          <a @click="detailMusic(o.id)">
            <el-card class="showbox box-card">
              <div>
                <audio class="audio" :src="o.ossSrc" controls="controls" />
              </div>
              <div class="song" style="height: 50px">
                {{ o.singer }}----{{ o.song }}
              </div>
            </el-card></a>
        </el-col>
      </el-row>
    </div>

    <!-- 分页区域 -->
    <div class="block">
      <el-pagination
        :current-page="cpage"
        :page-sizes="[5, 10, 20, 30]"
        :page-size="100"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
      />
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      musicList: [],
      total: 0,
      cpage: 1
    }
  },
  created() {
    this.getMusicList(this.$route.query.song)
  },
  methods: {
    async  getMusicList(song) {
      const { data: res } = await this.$http.get(`/music/findMusicBySongExamine?song=${song}`)
      if (res.statue !== 200) {
        return this.$message.error('获取音乐列表失败')
      }
      this.musicList = res.data.musicList
      this.total = res.data.musicList.length
    },
    detailMusic(id) {
      this.$router.push(`/showDetailMusic?id=${id}`)
    }
  }

}
</script>

<style lang="less" scoped>
.crumbs{
  margin-top: 20px;
}
.music {
  width: 100%;
  margin-top: 20px;
  margin-bottom: 30px;
}
.showbox {
  height: 150px;
  border-radius: 10px;
}
.el-card {
  margin-top: 20px;
}
.audio {
  width: 180px;
}
.song {
  margin-top: 5px;
  font-size: 14px;
  height: 20px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.links {
  width: 300px;
  height: 30px;
  background-color: seagreen;
  text-align: center;
  line-height: 30px;
  border-radius: 25px;
  margin: 20px auto;
}
.input-with-select {
  margin: 20px 0 10px 0;
  width: 400px;
}
</style>
