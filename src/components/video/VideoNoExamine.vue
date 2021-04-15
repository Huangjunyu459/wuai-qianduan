<template>
  <div>
    <!-- 面包屑导航区域 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>视频管理</el-breadcrumb-item>
      <el-breadcrumb-item>未审核视频</el-breadcrumb-item>
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
            @clear="getVideoList"
          >
            <el-button
              slot="append"
              icon="el-icon-search"
              @click="findVideoByVideoNameNoExamine(queryInfo)"
            />
          </el-input>
        </el-col>
      </el-row>

      <!-- 视频列表区域 -->
      <el-table :data="videoList" border stripe>
        <el-table-column label="序号" type="index" />
        <el-table-column label="视频id" prop="id" />
        <el-table-column label="视频名" prop="videoName" />
        <el-table-column label="阿里云地址" prop="ossSrc" />
        <el-table-column label="上传的作者id" prop="authorId" />
        <el-table-column label="所属分类" prop="categoryId">
          <template slot-scope="{ row }">
            <div v-show="row.categoryId === 3">视频</div>
          </template>
        </el-table-column>
        <el-table-column label="点赞数" prop="love" />
        <el-table-column label="创建时间" prop="createTime" />
        <el-table-column label="修改时间" prop="updateTime" />
        <el-table-column label="操作" width="300px">
          <template slot-scope="{ row }">
            <!-- 按钮提示 -->
            <el-tooltip
              effect="dark"
              content="预览"
              placement="top"
              :enterable="false"
            >
              <!-- 预览按钮 -->
              <el-button
                type="primary"
                icon="el-icon-edit"
                size="mini"
                @click="showEditDialog(row.id)"
              >预览</el-button>
            </el-tooltip>
            <el-tooltip
              effect="dark"
              content="审核通过"
              placement="top"
              :enterable="false"
            >
              <!-- 审核通过按钮 -->
              <el-button
                type="success"
                icon="el-icon-edit"
                size="mini"
                @click="examine(row.id)"
              >通过</el-button>
            </el-tooltip>
            <el-tooltip
              effect="dark"
              content="审核不通过"
              placement="top"
              :enterable="false"
            >
              <!-- 审核不通过按钮 -->
              <el-button
                type="danger"
                icon="el-icon-delete"
                size="mini"
                @click="removeVideoById(row.id)"
              >不通过</el-button>
            </el-tooltip>
          </template>
        </el-table-column>
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

    <!-- 修改视频对话框 -->
    <el-dialog
      title="预览"
      :visible.sync="editDialogVisivle"
      width="80%"
      @close="editDialogClosed"
    >
      <el-form
        ref="editFormRef"
        :model="editForm"
        label-width="100px"
      >
        <video class="videoPreview" :src="editForm.ossSrc" controls="controls" />
      </el-form>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data() {
    return {
      //  获取视频列表的参数对象
      queryInfo: {
        query: '',
        //  当前的页数
        index: 1,
        //  当前每页显示多少条数据
        size: 5
      },
      //    接受返回的视频列表结果
      videoList: [],
      total: 0,
      //    控制修改对话框的显示与隐藏
      editDialogVisivle: false,
      //    查询到的视频信息保存对象
      editForm: {
        ossSrc: ''
      }
    }
  },
  created() {
    this.getVideoList()
  },
  methods: {
    async getVideoList() {
      const { data: res } = await this.$http.get('/video/findAllVideoNoExamine')
      if (res.statue !== 200) {
        return this.$message.error('获取视频列表失败')
      }
      this.videoList = res.data.videoList
      this.total = res.data.videoList.length
    },
    async pagingQueryNoExamine() {
      const { data: res } = await this.$http.get(
        `/video/pagingQueryNoExamine?videoName=${this.queryInfo.query}&index=${this.queryInfo.index}&size=${this.queryInfo.size}`
      )
      if (res.statue !== 200) {
        return this.$message.error('获取视频列表失败')
      }
      this.videoList = res.data.videoIPage.records
      this.total = res.data.videoIPage.total
    },
    //  监听 pagesize 改变的事件
    handleSizeChange(newSize) {
      this.queryInfo.size = newSize
      this.pagingQueryNoExamine()
    },
    //  监听 页码值 改变的事件
    handleCurrentChange(newPage) {
      this.queryInfo.index = newPage
      this.pagingQueryNoExamine()
    },
    //  根据视频名称模糊查询
    async findVideoByVideoNameNoExamine(queryInfo) {
      const { data: res } = await this.$http.get(
        `/video/findVideoByVideoNameNoExamine?videoName=${queryInfo.query}`
      )
      console.log(res)
      if (res.statue !== 200) {
        return this.$message.error('不存在该视频')
      }
      this.videoList = res.data.videoList
      this.total = res.data.videoList.length
    },
    //  展示编辑视频的对话框
    async showEditDialog(id) {
      const { data: res } = await this.$http.get('/video/getByIdNoExamine?id=' + id)
      console.log(res)
      this.editForm = res.data.video
      this.editDialogVisivle = true
    },
    //  监听修改视频对话框的关闭事件
    editDialogClosed() {
      this.$refs.editFormRef.resetFields()
    },
    //    根据 id 审核对应的视频
    async examine(id) {
      //    弹框询问用户是否过审
      const confirmResult = await this.$confirm(
        '视频已过审, 是否继续?',
        '提示',
        {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }
      ).catch((err) => err)

      //  如果用户确认过审，则返回值为字符串 confirm
      //   如果用户取消过审，则返回值为字符串 cancel
      //  console.log(confirmResult)
      if (confirmResult !== 'confirm') {
        return this.$message.info('已取消过审')
      }
      const { data: res } = await this.$http.get(
        '/video/examine?id=' + id
      )
      if (res.statue !== 200) {
        return this.$message.error('审核视频失败')
      }
      this.$message.success('审核视频成功')
      // 分页功能有bug 先不使用 this.pagingQueryNoExamine()
    },

    //    根据 id 删除对应的视频
    async removeVideoById(id) {
      //    弹框询问用户是否删除数据
      const confirmResult = await this.$confirm(
        '此操作将永久删除该视频, 是否继续?',
        '提示',
        {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }
      ).catch((err) => err)

      //  如果用户确认删除，则返回值为字符串 confirm
      //   如果用户确认删除，则返回值为字符串 cancel
      //  console.log(confirmResult)
      if (confirmResult !== 'confirm') {
        return this.$message.info('已取消删除')
      }
      const { data: res } = await this.$http.delete(
        '/video/removeVideoById?id=' + id
      )
      if (res.statue !== 200) {
        return this.$message.error('删除视频失败')
      }
      this.$message.success('删除视频成功')
      //  分页功能有bug this.pagingQueryNoExamine()
    }
  }
}
</script>

<style lang="less" scoped>
.videoPreview{
  width: 100%;
  height: 100%;
}
</style>
