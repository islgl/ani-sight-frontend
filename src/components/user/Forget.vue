<template>
  <el-container>
    <el-header>
      <h1>忘记密码</h1>
    </el-header>
    <el-main>
      <el-card>
        <el-form label-width="auto">
          <el-form-item label="邮箱">
            <el-input type="text" placeholder="请输入邮箱" v-model="email"></el-input>
          </el-form-item>
          <el-form-item label="新密码">
            <el-input type="password" placeholder="请输入新密码" v-model="password"></el-input>
          </el-form-item>
          <el-form-item label="确认新密码">
            <el-input type="password" placeholder="请再次输入新密码" v-model="confirmPassword"></el-input>
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
        <el-button type="primary" @click="checkAndUpdate" class="update-btn">修改密码</el-button>
        <el-button type="text" class="login" @click="toLogin">登录</el-button>
      </el-card>
    </el-main>
  </el-container>
</template>

<script>
import {instance} from "@/utils/request.js";
import {ElMessage} from "element-plus";
import router from "@/router";

export default {
  data() {
    return {
      email: '',
      password: '',
      confirmPassword: '',
      verifyCode: '',
      count: 0,
    }
  },
  methods: {
    toLogin() {
      router.push('/login');
    },
    getVerifyCode() {
      if (!isEmailValid(this.email)) {
        return;
      }
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
        console.error(error);
        ElMessage.error("验证码发送失败，请稍后重试")
      })
    },
    checkAndUpdate() {
      if (isEmailValid(this.email) && isPasswordValid(this.password) && isConfirmPasswordValid(this.password, this.confirmPassword)
          && isVerifyCodeValid(this.verifyCode)) {
        updatePwd(this.email, this.password, this.confirmPassword, this.verifyCode)
      }

    }
  }
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
    ElMessage.warning('请输入新密码')
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

const updatePwd = (email, password, confirmPassword, verifyCode) => {
  const formData = new FormData();
  formData.append('email', email);
  formData.append('newPassword', password);
  formData.append('confirmPassword', confirmPassword);
  formData.append('verifyCode', verifyCode);

  instance.post('/users/resetpwd', formData).then(response => {
    ElMessage.success("密码修改成功，请前往登录");
    router.push('/login');
  }).catch(error => {
    ElMessage.error(error.message);
  })
}


</script>

<style scoped>
.el-container {
  width: 95vw;
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
  margin-right: 40px;
}

.update-btn {
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