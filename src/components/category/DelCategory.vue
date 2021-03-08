<template>
  <div>
    <!-- 面包屑导航区域 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>分类管理</el-breadcrumb-item>
      <el-breadcrumb-item>已删除分类</el-breadcrumb-item>
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
            @clear="findIsDelete"
          >
            <el-button
              slot="append"
              icon="el-icon-search"
              @click="findCategoryByCategoryNameIsDelete(queryInfo)"
            />
          </el-input>
        </el-col>
      </el-row>

      <!-- 分类列表区域 -->
      <el-table :data="categoryList" border stripe>
        <el-table-column label="序号" type="index" />
        <el-table-column label="分类id" prop="id" />
        <el-table-column label="分类名称" prop="categoryName" />
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
      //  获取分类列表的参数对象
      queryInfo: {
        query: '',
        //  当前的页数
        index: 1,
        //  当前每页显示多少条数据
        size: 5
      },
      //    接受返回的分类列表结果
      categoryList: [],
      total: 0
    }
  },
  created() {
    this.findIsDelete()
  },
  methods: {
    async findIsDelete() {
      const { data: res } = await this.$http.get('/category/findIsDelete')
      if (res.statue !== 200) {
        return this.$message.error('获取分类列表失败')
      }
      this.categoryList = res.data.categoryList
      this.total = res.data.categoryList.length
    },
    async pagingQueryIsDelete() {
      const { data: res } = await this.$http.get(
        `/category/pagingQueryIsDelete?categoryName=${this.queryInfo.query}&index=${this.queryInfo.index}&size=${this.queryInfo.size}`
      )
      console.log(res)
      if (res.statue !== 200) {
        return this.$message.error('获取分类列表失败')
      }
      this.categoryList = res.data.categoryList
      this.total = res.data.categoryList.length
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
    //  根据分类名称模糊查询
    async findCategoryByCategoryNameIsDelete(queryInfo) {
      const { data: res } = await this.$http.get(
        `/category/findCategoryByCategoryNameIsDelete?categoryName=${queryInfo.query}`
      )
      console.log(res)
      if (res.statue !== 200) {
        return this.$message.error('不存在该分类')
      }
      this.categoryList = res.data.categoryList
      this.total = res.data.categoryList.length
    }
  }
}
</script>

<style lang="less" scoped>
</style>
