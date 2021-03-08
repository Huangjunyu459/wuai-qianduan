<template>
  <div>
    <!-- 面包屑导航区域 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>游戏管理</el-breadcrumb-item>
      <el-breadcrumb-item>已删除游戏</el-breadcrumb-item>
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
            @clear="getGameList"
          >
            <el-button
              slot="append"
              icon="el-icon-search"
              @click="findGameByGameNameIsDelete(queryInfo)"
            />
          </el-input>
        </el-col>
      </el-row>

      <!-- 游戏列表区域 -->
      <el-table :data="gameList" border stripe>
        <el-table-column label="序号" type="index" />
        <el-table-column label="id" prop="id" />
        <el-table-column label="游戏名称" prop="gameName" />
        <el-table-column label="游戏描述" prop="description" />
        <el-table-column label="百度云盘" prop="bdSrc" />
        <el-table-column label="提取码" prop="bdCode" />
        <el-table-column label="上传的作者id" prop="authorID" />
        <el-table-column label="所属分类" prop="categoryId">
          <template slot-scope="{ row }">
            <div v-show="row.categoryId === 2">游戏</div>
          </template>
        </el-table-column>
        <el-table-column label="点赞数" prop="love" />
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
      //  获取游戏列表的参数对象
      queryInfo: {
        query: '',
        //  当前的页数
        index: 1,
        //  当前每页显示多少条数据
        size: 5
      },
      //    接受返回的游戏列表结果
      gameList: [],
      total: 0
    }
  },
  created() {
    this.getGameList()
  },
  methods: {
    async getGameList() {
      const { data: res } = await this.$http.get('/game/findIsDelete')
      if (res.statue !== 200) {
        return this.$message.error('获取游戏列表失败')
      }
      this.gameList = res.data.gameList
      this.total = res.data.gameList.length
    },
    async pagingQueryIsDelete() {
      const { data: res } = await this.$http.get(
        `/game/pagingQueryIsDelete?gameName=${this.queryInfo.query}&index=${this.queryInfo.index}&size=${this.queryInfo.size}`
      )
      console.log(res)
      if (res.statue !== 200) {
        return this.$message.error('获取游戏列表失败')
      }
      this.gameList = res.data.gameList
      this.total = res.data.gameList.length
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
    //  根据游戏名称模糊查询
    async findGameByGameNameIsDelete(queryInfo) {
      const { data: res } = await this.$http.get(
        `/game/findGameByGameNameIsDelete?gameName=${queryInfo.query}`
      )
      console.log(res)
      if (res.statue !== 200) {
        return this.$message.error('不存在该游戏')
      }
      this.gameList = res.data.gameList
      this.total = res.data.gameList.length
    }

  }
}
</script>

<style lang="less" scoped>
</style>
