<template>
  <div>
    <!-- 面包屑导航区域 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>音频管理</el-breadcrumb-item>
      <el-breadcrumb-item>已删除音频</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 卡片视图区域 -->
    <el-card>
      <!-- 搜索与添加区域 -->
      <el-row :gutter="20">
        <el-col :span="7">
          <el-input
            v-model="queryInfo.query"
            placeholder="请输入内容"
            clearable
            @clear="getMusicList"
          >
            <el-button
              slot="append"
              icon="el-icon-search"
              @click="findMusicBySongIsDelete(queryInfo)"
            />
          </el-input>
        </el-col>
      </el-row>

      <!-- 音频列表区域 -->
      <el-table :data="musicList" border stripe>
        <el-table-column label="序号" type="index" />
        <el-table-column label="音频id" prop="id" />
        <el-table-column label="歌手名" prop="singer" />
        <el-table-column label="歌曲名" prop="song" />
        <el-table-column label="阿里云地址" prop="ossSrc" />
        <el-table-column label="上传的作者id" prop="authorId" />
        <el-table-column label="所属分类" prop="categoryId">
          <template slot-scope="{ row }">
            <div v-show="row.categoryId === 4">音频</div>
          </template>
        </el-table-column>
        <el-table-column label="点赞数" prop="love" />
        <el-table-column label="会员专属" prop="isVip">
          <template slot-scope="{ row }">
            <div v-show="row.isVip === false">非会员</div>
            <div v-show="row.isVip === true">会员</div>
          </template>
        </el-table-column>
        <el-table-column label="创建时间" prop="createTime" />
        <el-table-column label="修改时间" prop="updateTime" />
      </el-table>

      <!-- 分页区域 -->
      <el-pagination
        :current-page="queryInfo.index"
        :page-sizes="[1, 2, 5, 10]"
        :page-size="queryInfo.size"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
      />
    </el-card>
  </div>
</template>

<script>
export default {
  data() {
    return {
      //  获取音频列表的参数对象
      queryInfo: {
        query: '',
        //  当前的页数
        index: 1,
        //  当前每页显示多少条数据
        size: 5
      },
      //    接受返回的音频列表结果
      musicList: [],
      total: 0
    }
  },
  created() {
    this.getMusicList()
  },
  methods: {
    async getMusicList() {
      const { data: res } = await this.$http.get('/music/findIsDelete')
      if (res.statue !== 200) {
        return this.$message.error('获取音频列表失败')
      }
      this.musicList = res.data.musicList
      this.total = res.data.musicList.length
    },
    async pagingQueryIsDelete() {
      const { data: res } = await this.$http.get(
        `/music/pagingQueryIsDelete?song=${this.queryInfo.query}&index=${this.queryInfo.index}&size=${this.queryInfo.size}`
      )
      console.log(res)
      if (res.statue !== 200) {
        return this.$message.error('获取音频列表失败')
      }
      this.musicList = res.data.musicList
      this.total = res.data.musicList.length
    },
    //  监听 pagesize 改变的事件
    handleSizeChange(newSize) {
      this.queryInfo.size = newSize
      this.pagingQueryIsDelete()
    },
    //  监听 页码值 改变的事件
    handleCurrentChange(newPage) {
      this.queryInfo.index = newPage
      this.pagingQueryIsDelete()
    },
    //  根据音频名称模糊查询
    async findMusicBySongIsDelete(queryInfo) {
      const { data: res } = await this.$http.get(
        `/music/findMusicBySongIsDelete?song=${queryInfo.query}`
      )
      console.log(res)
      if (res.statue !== 200) {
        return this.$message.error('不存在该音频')
      }
      this.musicList = res.data.musicList
      this.total = res.data.musicList.length
    }
  }
}
</script>

<style lang="less" scoped>
</style>
