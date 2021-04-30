<template>
  <div>
    <!-- 面包屑导航区域 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>音频管理</el-breadcrumb-item>
      <el-breadcrumb-item>未审核音频</el-breadcrumb-item>
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
              @click="findMusicBySongNoExamine(queryInfo)"
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
                @click="removeMusicById(row.id,row.authorId)"
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

    <!-- 修改音频对话框 -->
    <el-dialog
      title="预览"
      :visible.sync="editDialogVisivle"
      width="50%"
      @close="editDialogClosed"
    >
      <el-form
        ref="editFormRef"
        :model="editForm"
        label-width="100px"
      >
        <el-form-item label="歌手名">
          <el-input v-model="editForm.singer" />
        </el-form-item>
        <el-form-item label="歌曲名">
          <el-input v-model="editForm.song" />
        </el-form-item>
        <el-form-item label="阿里云地址">
          <audio class="myAudio" :src="editForm.ossSrc" controls="controls" />
          <!-- <el-input v-model="editForm.ossSrc" /> -->
        </el-form-item>
        <el-form-item label="点赞数">
          <el-input v-model="editForm.love" />
        </el-form-item>
      </el-form>
    </el-dialog>
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
      total: 0,
      //    控制修改对话框的显示与隐藏
      editDialogVisivle: false,
      //    查询到的音频信息保存对象
      editForm: {
        singer: '',
        song: '',
        ossSrc: '',
        love: 0
      }
    }
  },
  created() {
    this.getMusicList()
  },
  methods: {
    async getMusicList() {
      const { data: res } = await this.$http.get('/music/findAllMusicNoExamine')
      if (res.statue !== 200) {
        return this.$message.error('获取音频列表失败')
      }
      this.musicList = res.data.musicList
      this.total = res.data.musicList.length
    },
    async pagingQueryNoExamine() {
      const { data: res } = await this.$http.get(
        `/music/pagingQueryNoExamine?song=${this.queryInfo.query}&index=${this.queryInfo.index}&size=${this.queryInfo.size}`
      )
      console.log(res)
      if (res.statue !== 200) {
        return this.$message.error('获取音频列表失败')
      }
      this.articleList = res.data.musicIPage.records
      this.total = res.data.musicIPage.total
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
    //  根据音频名称模糊查询
    async findMusicBySongNoExamine(queryInfo) {
      const { data: res } = await this.$http.get(
        `/music/findMusicBySongNoExamine?song=${queryInfo.query}`
      )
      console.log(res)
      if (res.statue !== 200) {
        return this.$message.error('不存在该音频')
      }
      this.musicList = res.data.musicList
      this.total = res.data.musicList.length
    },
    //  展示编辑音频的对话框
    async showEditDialog(id) {
      const { data: res } = await this.$http.get('/music/getByIdNoExamine?id=' + id)
      console.log(res)
      this.editForm = res.data.music
      this.editDialogVisivle = true
    },
    //  监听修改音频对话框的关闭事件
    editDialogClosed() {
      this.$refs.editFormRef.resetFields()
    },
    //  修改音频信息并提交
    editArticleInfo() {
      this.$refs.editFormRef.validate(async(valid) => {
        if (!valid) return
        //  发起修改音频信息的网络请求
        const { data: res } = await this.$http.post(
          '/article/updateArticleById',
          this.editForm
        )
        if (res.statue !== 200) {
          return this.$message.error('修改音频失败')
        }
        this.$message.success('修改音频成功')
        //  隐藏修改音频的对话框
        this.editDialogVisivle = false
        //  分页功能有bug this.pagingQueryNoExamine()
      })
    },
    //    根据 id 审核对应的音频
    async examine(id) {
      //    弹框询问用户是否过审
      const confirmResult = await this.$confirm(
        '音频已过审, 是否继续?',
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
        '/music/examine?id=' + id
      )
      if (res.statue !== 200) {
        return this.$message.error('审核音频失败')
      }
      this.$message.success('审核音频成功')
      // 分页功能有bug 先不使用 this.pagingQueryNoExamine()
    },

    //    根据 id 删除对应的音频
    async removeMusicById(id, authorId) {
      //    弹框询问用户是否删除数据
      const confirmResult = await this.$confirm(
        '此操作将永久删除该音频, 是否继续?',
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
        `/music/removeMusicById?id=${id}&authorId=${authorId}`
      )
      if (res.statue !== 200) {
        return this.$message.error('删除音频失败')
      }
      this.$message.success('删除音频成功')
      //  分页功能有bug this.pagingQueryNoExamine()
    }
  }
}
</script>

<style lang="less" scoped>
</style>
