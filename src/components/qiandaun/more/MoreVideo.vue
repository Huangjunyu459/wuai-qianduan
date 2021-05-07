<template>
  <div>

    <!-- 面包屑区域 -->
    <el-breadcrumb class="crumbs" separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/index' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>视频 </el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 搜索与添加区域 -->
    <div style="margin-top: 15px;">
      <el-input v-model="videoName" placeholder="请输入内容" class="input-with-select">
        <el-button
          slot="append"
          icon="el-icon-search"
          @click="findVideoByVideoNameExamine(videoName)"
        />
      </el-input>
    </div>

    <!-- 最新视频区域 -->
    <div class="video">
      <el-link
        style="font-size: 25px"
        :underline="false"
        icon="el-icon-star-on"
        type="info"
      >最新视频</el-link>
      <el-row :gutter="20">
        <el-col v-for="o in videoList" :key="o" :span="6">
          <a @click="detailVideo(o.id)">
            <el-card class="showbox box-card">
              <div>
                <video
                  class="shipin"
                  :src="o.ossSrc"
                  controls="controls"
                />
              </div>
              <div class="videoName" style="height: 50px">
                {{ o.videoName }}
              </div>
            </el-card>
          </a>
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
      videoList: [],
      videoName: '',
      total: 0,
      cpage: 1,
      queryInfo: {
        query: '',
        //  当前的页数
        index: 1,
        //  当前每页显示多少条数据
        size: 5
      }
    }
  },
  created() {
    this.getVideoList()
  },
  methods: {
    async getVideoList() {
      const { data: res } = await this.$http.get('/video/findAllVideoExamine')
      if (res.statue !== 200) {
        return this.$message.error('获取视频列表失败')
      }
      this.videoList = res.data.videoList
      this.total = res.data.videoList.length
    },
    detailVideo(id) {
      this.$router.push(`/showDetailVideo?id=${id}`)
    },
    findVideoByVideoNameExamine(videoName) {
      this.$router.push(`/findVideoByVideoNameExamine?videoName=${videoName}`)
    },
    async pagingQueryExamine() {
      const { data: res } = await this.$http.get(
        `/video/pagingQueryExamine?videoName=${this.queryInfo.query}&index=${this.queryInfo.index}&size=${this.queryInfo.size}`
      )
      console.log(res)
      if (res.statue !== 200) {
        return this.$message.error('获取视频列表失败')
      }
      this.videoList = res.data.videoIPage.records
      this.total = res.data.videoIPage.total
    },
    //  监听 pagesize 改变的事件
    handleSizeChange(newSize) {
      this.queryInfo.size = newSize
      this.pagingQueryExamine()
    },
    //  监听 页码值 改变的事件
    handleCurrentChange(newPage) {
      this.queryInfo.index = newPage
      this.pagingQueryExamine()
    }
  }

}
</script>

<style lang="less" scoped>
.crumbs{
  margin-top: 20px;
}
.video{
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
.shipin{
  width: 150px;
}
.videoName {
  font-size: 14px;
  height: 20px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.input-with-select {
  margin: 20px 0 10px 0;
  width: 400px;
}
</style>
