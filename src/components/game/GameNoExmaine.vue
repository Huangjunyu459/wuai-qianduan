<template>
  <div>
    <!-- 面包屑导航区域 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>游戏管理</el-breadcrumb-item>
      <el-breadcrumb-item>未审核游戏</el-breadcrumb-item>
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
              @click="findGameByGameNameNoExamine(queryInfo)"
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
        <el-table-column label="上传的作者id" prop="authorId" />
        <el-table-column label="所属分类" prop="categoryId">
          <template slot-scope="{ row }">
            <div v-show="row.categoryId === 2">游戏</div>
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
                @click="removeGameById(row.id,row.authorId)"
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

    <!-- 修改游戏对话框 -->
    <el-dialog
      title="审核"
      :visible.sync="editDialogVisivle"
      width="50%"
      @close="editDialogClosed"
    >
      <el-form
        ref="editFormRef"
        :model="editForm"
        label-width="80px"
      >
        <el-form-item label="百度云盘" prop="bdSrc">
          <el-input v-model="editForm.bdSrc" />
        </el-form-item>
        <el-form-item label="提取码" prop="bdCode">
          <el-input v-model="editForm.bdCode" />
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data() {
    //  游戏id验证规则
    var checckGame = (rule, value, cb) => {
      //  验证的正则表达式
      const regGame = /^[0-9]+$/
      if (regGame.test(value)) {
        //    合法的游戏id
        return cb()
      }

      cb(new Error('游戏id只能是数字'))
    }

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
      total: 0,

      //    控制修改对话框的显示与隐藏
      editDialogVisivle: false,
      //    查询到的游戏信息保存对象
      editForm: {
        bdSrc: '',
        bdCode: ''
      }
    }
  },
  created() {
    this.getGameList()
  },
  methods: {
    async getGameList() {
      const { data: res } = await this.$http.get('/game/findAllGameNoExamine')
      if (res.statue !== 200) {
        return this.$message.error('获取游戏列表失败')
      }
      this.gameList = res.data.gameList
      this.total = res.data.gameList.length
    },
    async pagingQueryNoExamine() {
      const { data: res } = await this.$http.get(
        `/game/pagingQueryNoExamine?gameName=${this.queryInfo.query}&index=${this.queryInfo.index}&size=${this.queryInfo.size}`
      )
      console.log(res)
      if (res.statue !== 200) {
        return this.$message.error('获取游戏列表失败')
      }
      this.gameList = res.data.gameIPage.records
      this.total = res.data.gameIPage.total
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
    //  根据游戏名称模糊查询
    async findGameByGameNameNoExamine(queryInfo) {
      const { data: res } = await this.$http.get(
        `/game/findGameByGameNameNoExamine?gameName=${queryInfo.query}`
      )
      console.log(res)
      if (res.statue !== 200) {
        return this.$message.error('不存在该游戏')
      }
      this.gameList = res.data.gameList
      this.total = res.data.gameList.length
    },
    //  展示编辑游戏的对话框
    async showEditDialog(id) {
      const { data: res } = await this.$http.get('/game/getByIdNoExamine?id=' + id)
      this.editForm = res.data.game
      this.editDialogVisivle = true
    },
    //  监听修改游戏对话框的关闭事件
    editDialogClosed() {
      this.$refs.editFormRef.resetFields()
    },
    //    根据 id 审核对应的游戏
    async examine(id) {
      //    弹框询问用户是否过审
      const confirmResult = await this.$confirm(
        '游戏已过审, 是否继续?',
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
        '/game/examine?id=' + id
      )
      if (res.statue !== 200) {
        return this.$message.error('审核游戏失败')
      }
      this.$message.success('审核游戏成功')
      // 分页功能有bug 先不使用 this.pagingQueryNoExamine()
    },

    //    根据 id 删除对应的游戏
    async removeGameById(id, authorId) {
      //    弹框询问用户是否删除数据
      const confirmResult = await this.$confirm(
        '此操作将永久删除该游戏, 是否继续?',
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
        `/game/removeGameById?id=${id}&authorId=${authorId}`
      )
      if (res.statue !== 200) {
        return this.$message.error('删除游戏失败')
      }
      this.$message.success('删除游戏成功')
      // 分页功能有bug 先不使用 this.pagingQueryNoExamine()
    }
  }
}
</script>

<style lang="less" scoped>
</style>
