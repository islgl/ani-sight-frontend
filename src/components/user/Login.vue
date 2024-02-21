<template>
  <el-container>
    <el-header>
      <h1>用户登录</h1>
    </el-header>
    <el-main>
      <el-card>
        <el-form label-width="auto">
          <el-form-item label="用户名/邮箱">
            <el-input placeholder="请输入用户名或邮箱" type="text" v-model="usernameOrEmail"></el-input>
          </el-form-item>
          <el-form-item label="密码">
            <el-input type="password" placeholder="请输入密码" v-model="password"></el-input>
          </el-form-item>
          <el-button type="primary" @click="checkAndLogin" class="login-btn">登录</el-button>
          <el-button type="text" class="text-btn" @click="toForget">忘记密码</el-button>
          <el-button type="text" @click="toRegister" class="text-btn">注册</el-button>
        </el-form>
      </el-card>
    </el-main>
  </el-container>
</template>

<style scoped>
.el-container {
  width: 85vw;
  height: 50vh;
  justify-content: center;
  align-items: center;
}

.el-card {
  width: 400px;
  margin: 0 auto;
  padding: 20px;
}

.text-btn {
  float: right;
}

.login-btn {
  margin-left: 40px;
  width: 100px;
}

</style>

<script>
import {ElMessage} from "element-plus";
import {instance} from "@/utils/request.js";
import {URL_PREFIX} from "./config";
import router from "@/router";

export default {
  data() {
    return {
      usernameOrEmail: '',
      password: '',
    }
  },
  methods: {
    checkAndLogin() {
      // true if email, false if username
      const userType = this.usernameOrEmail.includes('@');
      // 用户名邮箱验证
      if (!userType) {
        if (!isUsernameValid(this.usernameOrEmail)) {
          return;
        }
      } else {
        if (!isEmailValid(this.usernameOrEmail)) {
          return;
        }
      }
      // 密码验证
      if (!isPasswordValid(this.password)) {
        return;
      }
      login(this.usernameOrEmail, this.password);
    },
    toRegister() {
      router.push('/register');
    },
    toForget() {
      router.push('/forget');
    }
  }
}

const isUsernameValid = username => {
  if (username === '') {
    ElMessage.warning('请输入用户名或邮箱')
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

const login = (user, password) => {
  const formData = new FormData();
  formData.append('usernameOrEmail', user);
  formData.append('password', password);
  instance.post(URL_PREFIX + '/login', formData)
      .then(response => {
        ElMessage.success("登录成功");
        localStorage.setItem('user', JSON.stringify(response.data));
        router.push('/home');
      })
      .catch(error => {
        ElMessage.error(error.message);
      })
}

</script>