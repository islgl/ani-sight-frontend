<template>
  <el-container>
    <el-header>
      <h1>用户注册</h1>
    </el-header>
    <el-main>
      <el-card>
        <el-form label-width="auto">
          <el-form-item label="用户名">
            <el-input placeholder="请输入用户名" type="text" v-model="username"></el-input>
          </el-form-item>
          <el-form-item label="邮箱">
            <el-input type="text" placeholder="请输入邮箱" v-model="email"></el-input>
          </el-form-item>
          <el-form-item label="密码">
            <el-input type="password" placeholder="请输入密码" v-model="password"></el-input>
          </el-form-item>
          <el-form-item label="确认密码">
            <el-input type="password" placeholder="请再次输入密码" v-model="confirmPassword"></el-input>
          </el-form-item>
          <el-row>
            <el-col span="10">
              <el-form-item label="邮箱验证码">
                <el-input type="text" placeholder="请输入验证码" class="verify-input" v-model="verifyCode"></el-input>
              </el-form-item>
            </el-col>
            <el-col span="12">
              <el-button type="primary" class="get-code-btn" :disabled="count>0" @click="getVerifyCode">
                获取验证码{{ count > 0 ? '(' + count + ')' : '' }}
              </el-button>
            </el-col>
          </el-row>
        </el-form>
        <el-button type="primary" @click="checkAndRegister" class="register-btn">注册</el-button>
        <el-button type="text" class="login" @click="toLogin">已有账号？立即登录</el-button>
      </el-card>
    </el-main>
  </el-container>
</template>

<style scoped>
.el-container {
  width: 85vw;
  height: 70vh;
  justify-content: center;
  align-items: center;
}

.el-card {
  width: 450px;
  margin: 0 auto;
  padding: 20px;
}

.el-row {
  margin-bottom: 20px;
}

.el-col {
  border-radius: 4px;
}

.login {
  float: right;
}

.register-btn {
  margin-left: 50px;
  width: 100px;
}

.verify-input {
  width: 140px;
}

.get-code-btn {
  margin-left: 25px;
  width: 120px;
}


</style>

<script>
import {ElMessage} from "element-plus";
import {instance} from "@/utils/request.js"
import router from "@/router/index.js";

export default {
  data() {
    return {
      username: '',
      email: '',
      password: '',
      confirmPassword: '',
      verifyCode: '',
      count: 0
    }
  },
  methods: {
    checkAndRegister() {
      if (isUsernameValid(this.username) && isEmailValid(this.email) && isPasswordValid(this.password)
          && isConfirmPasswordValid(this.password, this.confirmPassword) && isVerifyCodeValid(this.verifyCode)) {
        register(this.username, this.email, this.password, this.confirmPassword, this.verifyCode)
      }
    },
    toLogin() {
      router.push('/login')
    },
    getVerifyCode() {
      instance.get('/users/email-verify', {
        params: {
          email: this.email
        }
      }).then(response => {
        if (response.status === 'success') {
          console.log(response.message);
          ElMessage.success("验证码已发送至邮箱，5min内有效");
          // 禁用按钮1min
          this.count = 60;
          const timer = setInterval(() => {
            this.count--;
            if (this.count === 0) {
              clearInterval(timer);
            }
          }, 1000)
        }
      }).catch(error => {
        console.log(error);
        ElMessage.error("验证码发送失败，请稍后重试")
      })
    }

  }
}

const isUsernameValid = username => {
  if (username === '') {
    ElMessage.warning('请输入用户名')
    return false
  } else {
    if (username.length < 4 || username.length > 16) {
      ElMessage.warning('用户名长度应在4-16位之间')
      return false
    }
  }
  const specialCharacters = "!@#$%^&*()_+{}|:<>?`-=[]\\;',./~";
  for (const c of username) {
    if (specialCharacters.includes(c)) {
      ElMessage.warning('用户名不能包含特殊字符')
      return false;
    }
  }
  return true;

}

const isEmailValid = email => {
  if (email === '') {
    ElMessage.warning('请输入邮箱')
    return false;
  }
  const emailRegex = /^[a-zA-Z0-9_+&*-]+(?:\.[a-zA-Z0-9_+&*-]+)*@(?:[a-zA-Z0-9-]+\.)+[a-zA-Z]{2,7}$/;
  if (!emailRegex.test(email)) {
    ElMessage.warning('邮箱格式不正确')
    return false;
  }
  return true;
};

const isPasswordValid = password => {
  if (password === '') {
    ElMessage.warning('请输入密码')
    return false;
  } else {
    if (password.length < 6 || password.length > 16) {
      ElMessage.warning('密码长度应在6-16位之间')
      return false;
    }
  }
  return true;
}

const isConfirmPasswordValid = (password, confirmPassword) => {
  if (password !== confirmPassword) {
    ElMessage.warning('两次输入的密码不一致')
    return false;
  }
  return true;
}

const isVerifyCodeValid = verifyCode => {
  if (verifyCode === '') {
    ElMessage.warning('请输入验证码')
    return false;
  } else {
    if (verifyCode.length !== 6) {
      ElMessage.warning('验证码长度应为6位')
      return false;
    }
  }
  return true;
}

const register = (username, email, password, confirmPassword, verifyCode) => {
  const formData = new FormData();
  formData.append('username', username);
  formData.append('email', email);
  formData.append('password', password);
  formData.append('confirmPassword', confirmPassword);
  formData.append('verifyCode', verifyCode);

  instance.post('/users/register', formData).then(response => {
    ElMessage.success("注册成功，请前往登录");
    router.push('/login')
  }).catch(error => {
    ElMessage.error(error.message)
  })
}
</script>