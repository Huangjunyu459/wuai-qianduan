<template>
  <div class="login_container">
    <div class="login_box">
      <!-- 头像区域 -->
      <div class="avatar_box">
        <img src="../assets/logo.png">
      </div>
      <!-- 登录表单区域 -->
      <el-form
        ref="loginFormRef"
        :model="loginForm"
        :rules="loginFormRules"
        label-width="0px"
        class="login_form"
      >
        <!-- 用户名 -->
        <el-form-item prop="adminName">
          <el-input
            v-model="loginForm.adminName"
            prefix-icon="iconfont  icon-yonghu"
          />
        </el-form-item>
        <!-- 密码 -->
        <el-form-item prop="password">
          <el-input
            v-model="loginForm.password"
            prefix-icon="iconfont icon-mima"
            type="password"
          />
        </el-form-item>
        <!-- 按钮区域 -->
        <el-form-item class="btns">
          <el-button type="primary" @click="login">登录</el-button>
          <el-button type="info" @click="resetLoginForm">重置</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      //  登录表单的数据绑定对象
      loginForm: {
        adminName: '',
        password: ''
      },
      //  这是表单的验证规则对象
      loginFormRules: {
        //  验证用户名是否合法
        adminName: [
          { required: true, message: '请输入登录名称', trigger: 'blur' }
          // { min: 3, max: 5, message: '长度在 3 到 5 个字符', trigger: 'blur' }
        ],
        //  验证密码是否合法
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    //  重置登录表单
    resetLoginForm: function() {
      this.$refs.loginFormRef.resetFields()
    },
    //  登录功能
    login: function() {
      this.$refs.loginFormRef.validate(async valid => {
        if (!valid) return
        const result = await this.$http.post('/admin/login', this.loginForm)
        const { data: res } = await this.$http.post('/admin/login', this.loginForm)
        if (res.statue !== 200) return this.$message.error('登陆失败')
        this.$message.success('登陆成功')
        //  1、讲登录成功之后的 token 保存到客户端的 seesionStorage 中
        //  1.1、项目中除了登录之外的其他API接口，必须在登录之后才能访问
        //  1.2、token 值应在当前网站打开期间有效，所以 token 保存在 sessionStorage 中
        window.sessionStorage.setItem('token', res.statue)
        //  2、通过编程式导航跳转到后台页面，路由地址是 /home
        this.$router.push('/home')
      })
    }
  }
}
</script>

<style lang="less"   scoped>
.login_container {
  background-color: #2b4b6b;
  height: 100%;
}

.login_box {
  width: 500px;
  height: 350px;
  background-color: #fff;
  border-radius: 3px;
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);

  .avatar_box {
    width: 50px;
    height: 50px;
    border: 1px solid #eee;
    border-radius: 50%;
    padding: 10%;
    box-shadow: 0 0 10px #eee;
    position: absolute;
    left: 50%;
    transform: translate(-50%, -50%);
    background-color: #fff;
    img {
      width: 100%;
      height: 100%;
      border-radius: 50%;
      background-color: #eee;
    }
  }
}

.login_form {
  position: absolute;
  bottom: 0;
  width: 100%;
  padding: 0 20px;
  box-sizing: border-box;
}

.btns {
  display: flex;
  justify-content: flex-end;
}
</style>
