<template>
  <el-container class="root">
    <el-image src="https://oss.lewisliugl.cn/assets/rainbow-title.svg" class="logo"/>
    <el-card class="card">
      <div class="form">
        <h1 class="title">管理员登录</h1>
        <el-form label-width="auto">
          <el-form-item label="用户名/邮箱">
            <el-input placeholder="请输入用户名或邮箱" type="text" v-model="usernameOrEmail"/>
          </el-form-item>
          <el-form-item label="密码">
            <el-input type="password" placeholder="请输入密码" v-model="password" show-password/>
          </el-form-item>
        </el-form>
        <el-button type="primary" @click="checkAndLogin" class="login-btn">登录</el-button>
      </div>
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
  width: 25vw;
  margin-top: 15vh;
}

.card {
  margin-top: 5vh;
  width: 40vw;
  height: 45vh;
  justify-content: center;
  align-items: center;
  display: flex;
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
  font-family: shuhei, sans-serif;
}

.el-form {
  margin-top: 5vh;
  width: 100%;
}

.el-button {
  margin-top: 2vh;
  border: none;
  border-radius: 8px;
  width: 10vw;
  height: 4vh;
  transition: .3s;
}

.el-input {
  width: 15vw;
}

.login-btn {
  font-family: monospace;
  background-color: #3b82f6;
  color: #fff;
//margin-right: 2vw;
}

.login-btn:hover {
  box-shadow: 0 0 0 5px #3b83f65f;
}
</style>

<script>
import {ElMessage} from "element-plus";
import {instance} from "@/utils/request.js";
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
  instance.post('/users/login', formData)
      .then(response => {
        const data = response.data;
        if (data.role !== 'Administrator') {
          ElMessage.error("管理员不存在");
        } else {
          ElMessage.success("登录成功");
          localStorage.setItem('user', JSON.stringify(response.data));
          router.push('/admin/users');
        }
      })
      .catch(error => {
        console.error(error);
        ElMessage.error(error.message);
      })
}

</script>