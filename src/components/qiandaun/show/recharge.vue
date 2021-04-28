<template>
  <div class="contribution">
    <el-tag class="mytag"><i class="el-icon-edit">充值须知</i></el-tag>
    <div class="statement">
      <ol>
        <li>充值前请先联系客服购买激活码</li>
        <li>激活码一经出售，概不退还</li>
        <li>本站会员为终身会员制，请勿重复购买</li>
      </ol>
      <img src="../../../assets/wechat.jpg" alt="客服微信图">
    </div>
    <el-tag class="mytag"><i class="el-icon-edit">激活须知</i></el-tag>
    <el-tabs value="vip">
      <el-tab-pane label="充值区域" name="vip">
        <div>
          <el-form ref="rechargeFormRef" :model="rechargeForm" :rules="rechargeFormRules" label-width="100px" class="demo-ruleForm">
            <el-form-item label="激活码" prop="actCode">
              <el-input v-model="rechargeForm.actCode" />
            </el-form-item>
            <el-form-item hidden label="要激活的用户id">
              <el-input v-model="rechargeForm.userId" />
            </el-form-item>
          </el-form>
          <el-button
            class="ubtn"
            size="mini"
            round
            type="success"
            @click="recharge"
          ><i class="el-icon-check">激活会员</i></el-button>
        </div>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
export default {
  inject: ['reload'],
  data() {
    return {
      rechargeForm: {
        actCode: '',
        userId: ''
      },
      rechargeFormRules: {
        actCode: [
          { required: true, message: '激活码不能为空', trigger: 'blur' }
        ]

      }
    }
  },
  created() {
    this.fuzhi()
  },
  methods: {
    fuzhi() {
      this.rechargeForm.userId = this.$cookies.get('user').id
    },
    async recharge() {
      console.log(this.rechargeForm)
      const { data: res } = await this.$http.post(`/user/recharge`, this.rechargeForm)
      if (res.statue !== 200) {
        return this.$message.error('激活失败')
      }
      this.$refs.rechargeFormRef.resetFields()
      this.reload()
      return this.$message.success('激活会员成功')
    }
  }
}
</script>

<style lang="less" scoped>
.contribution {
  width: 100%;
}
.mytag {
  text-align: center;
  width: 100px;
  height: 40px;
  font-size: 15px;
  line-height: 40px;
  border-radius: 20px;
}
.ubtn{
  margin-left: 300px;
  width: 300px;
}
</style>
