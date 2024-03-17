<template>
  <el-container class="root">
    <el-image src="https://oss.lewisliugl.cn/assets/rainbow-title.svg" class="logo"/>
    <el-card class="card">
      <el-row style="height: 38vh;width: 40vw">
        <el-col :span="10">
          <div class="banner">
            <h1 class="welcome">Welcome</h1>
            <p class="text">基于深度大模型的野生动物识别系统</p>
          </div>
        </el-col>
        <el-col :span="14">
          <div class="form">
            <h1 class="title">用户登录</h1>
            <el-form label-width="auto">
              <el-form-item label="用户名/邮箱">
                <el-input placeholder="请输入用户名或邮箱" type="text" v-model="usernameOrEmail"></el-input>
              </el-form-item>
              <el-form-item label="密码">
                <el-input type="password" placeholder="请输入密码" v-model="password" show-password></el-input>
              </el-form-item>
              <el-button type="primary" @click="checkAndLogin" class="login-btn">登录</el-button>
              <el-button type="primary" @click="toRegister" class="register-btn">注册</el-button>
            </el-form>
            <el-divider border-style="dashed"/>
            <el-button type="text" @click="toForget" class="forget-btn">忘记密码？</el-button>
          </div>
        </el-col>
      </el-row>
    </el-card>
    <el-footer style="position: absolute; bottom: 0;">
      <Footer/>
    </el-footer>
  </el-container>
</template>

<style scoped>
.root {
  width: 100vw;
  height: 100vh;
  align-items: center;
  flex-direction: column;
}

.logo {
  width: 20vw;
  margin-top: 18vh;
}

.card {
  margin-top: 5vh;
  width: 40vw;
  height: 38vh;
  display: flex;
  justify-content: center;
  align-items: center;
}

.card .banner {
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  background-size: cover; /* 自适应缩放并填充整个区域 */
  background-position: center; /* 图片在背景中的位置 */
  background-repeat: no-repeat; /* 禁止重复 */
  background-image: url("https://cdn.jsdelivr.net/gh/islgl/img-hosting/imgs/202403171926495.jpg");
}

.card .banner .welcome {
  font-size: 3rem;
  color: #fff;
  text-align: center;
  text-shadow: 0 0 10px #000;
  font-weight: bold;
  letter-spacing: 5px;
  text-transform: uppercase;
  animation: blink 1s infinite;
}

.card .banner .text {
  color: #fff;
  text-align: center;
  text-shadow: 0 0 10px #000;
  letter-spacing: 3px;
}

.card .form {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  flex-direction: column;
}

.card .form .title {
  margin-top: 2vh;
  font-family: shuhei,sans-serif;
}

.el-form {
  margin-top: 5vh;
  width: 80%;
}

.el-button{
  border: none;
  border-radius: 8px;
  width: 8vw;
  height: 4vh;
  transition: .3s;
}

.login-btn{
  font-family: monospace;
  background-color: #3b82f6;
  color: #fff;
  margin-right: 2vw;
}

.login-btn:hover {
  box-shadow: 0 0 0 5px #3b83f65f;
}


.register-btn {
  font-family: monospace;
  background-color: #f3f7fe;
  color: #3b82f6;

}

.register-btn:hover {
  background-color: #3b82f6;
  box-shadow: 0 0 0 5px #3b83f65f;
  color: #fff;
}

.forget-btn{
  color: #72767b;
  font-size: 16px;
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
    router() {
      return router
    },
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
        console.error(error);
        ElMessage.error(error.message);
      })
}

</script>