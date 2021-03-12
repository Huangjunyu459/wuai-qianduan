<template>
  <div class="setting">
    <el-tag class="mytag">我的头像</el-tag>
    <p>为了防止恶意上传，替换头像需要消耗30积分</p>
    <div class="avator-form">
      <div class="avator">
        <img
          src="https://2021article.oss-cn-hangzhou.aliyuncs.com/pic/ae2483538378479f84c66a6a89384e5c_%E9%BB%98%E8%AE%A4%E5%A4%B4%E5%83%8F.jpg"
          alt=""
        >
      </div>
      <div class="upload">
        <el-upload
          class="upload-demo"
          drag
          action="https://jsonplaceholder.typicode.com/posts/"
          multiple
        >
          <i class="el-icon-upload" />
          <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
        </el-upload>
      </div>
    </div>
    <el-tag class="mytag">我的资料</el-tag>
    <p>为了防止恶意行为，每次修改需要消耗30积分</p>
    <div class="update-form">
      <el-form
        ref="editFormRef"
        :model="editForm"
        :rules="editFormRules"
        label-width="70px"
      >
        <el-form-item label="昵称" prop="username">
          <el-input v-model="editForm.username" />
        </el-form-item>
        <el-form-item label="描述" prop="sign">
          <el-input
            v-model="editForm.sign"
            type="textarea"
            :autosize="{ minRows: 4, maxRows: 6 }"
            maxlength="300"
            show-word-limit
          />
        </el-form-item>
        <el-form-item label="新密码" prop="password">
          <el-input v-model="editForm.password" />
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="editForm.email" />
        </el-form-item>
      </el-form>
      <el-button
        class="ubtn"
        size="mini"
        round
        type="success"
        @click="editUserInfo"
      ><i class="el-icon-check">更新个人资料</i></el-button>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    //    邮箱验证规则
    var checkEmail = (rule, value, cb) => {
      //  验证邮箱的正则表达式
      const regEamil = /^\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/
      if (regEamil.test(value)) {
        //    合法的邮箱
        return cb()
      }

      cb(new Error('请输入合法的邮箱'))
    }

    //  密码验证规则
    var checkPassword = (rule, value, cb) => {
      //  验证密码的正则表达式
      const regEamil = /^[A-Za-z0-9]+$/
      if (regEamil.test(value)) {
        //    合法的密码
        return cb()
      }

      cb(new Error('密码由字母和数字构成'))
    }
    return {
      //    查询到的用户信息保存对象
      editForm: {
        username: '',
        password: '',
        email: ''
      },
      //    修改表单的验证规则对象
      editFormRules: {
        username: [
          { required: true, message: '请输入昵称', trigger: 'blur' },
          {
            min: 6,
            max: 20,
            message: '长度在 6 到 20 个字符',
            trigger: 'blur'
          }
        ],
        sign: [
          {
            min: 0,
            max: 300,
            message: '长度不能超过300个字符',
            trigger: 'blur'
          }
        ],
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' },
          { validator: checkPassword, trigger: 'blur' },
          {
            min: 6,
            max: 20,
            message: '长度在 6 到 20 个字符',
            trigger: 'blur'
          }
        ],
        email: [
          { required: true, message: '请输入邮箱', trigger: 'blur' },
          { validator: checkEmail, trigger: 'blur' },
          {
            min: 6,
            max: 20,
            message: '长度在 6 到 20 个字符',
            trigger: 'blur'
          }
        ]
      }
    }
  }
}
</script>

<style lang="less" scoped>
.setting {
  width: 100%;
  > p {
    color: rgb(85, 88, 95);
  }
}
.mytag {
  text-align: center;
  width: 100px;
  height: 40px;
  font-size: 15px;
  line-height: 40px;
  border-radius: 20px;
}
.avator-form {
  width: 100%;
  margin-bottom: 10px;
}
.avator {
  display: inline-block;
  width: 150px;
  height: 150px;
  border-radius: 75px;
  > img {
    width: 100%;
    height: 100%;
    border-radius: 75px;
  }
}
.upload {
  display: inline-block;
}
.update-form {
  width: 50%;
}
.ubtn{
  margin-left: 100px;
  width: 300px;
}
</style>
