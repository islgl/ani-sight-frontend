<template>
  <el-container class="root">
    <el-header>
      <el-row>
        <el-col :span="2">
          <el-image style="width: 100px; margin-top: 15px;" src="https://oss.lewisliugl.cn/assets/logo-title.svg"/>
        </el-col>
        <el-col :span="19">
          <el-menu mode="horizontal" active-text-color="#20a0ff" router>
            <el-menu-item index="1" route="/home">首页</el-menu-item>
            <el-menu-item index="2" route="/history">历史记录</el-menu-item>
            <el-menu-item index="3" route="/star">我的收藏</el-menu-item>
            <el-menu-item index="4" route="/about">关于</el-menu-item>
          </el-menu>
        </el-col>
        <el-col :span="3">
          <el-container class="avatar-container">
            <el-avatar size="medium" :src="avatarUrl"/>
            <el-menu mode="horizontal" :ellipsis="false" style="border-bottom: none" @select="index => {
              if (index === '5-2') {
                this.logout();
              }
            }" router>
              <el-sub-menu>
                <template #title>{{ usernameInStorage }}</template>
                <el-menu-item index="5-1" route="/profile">个人资料</el-menu-item>
                <el-menu-item index="5-2">退出</el-menu-item>
              </el-sub-menu>
            </el-menu>
          </el-container>
        </el-col>
      </el-row>
    </el-header>
    <el-main>
      <el-container class="profile-container">
        <el-col span="4" class="avatar-col">
          <el-container direction="vertical" class="avatar-container">
            <el-avatar :src="avatarUrl" style="width: 200px;height: 200px"/>
            <el-upload :http-request="updateAvatar" :auto-upload="true" :show-file-list="false">
              <el-button type="primary" style="margin-top: 50px;width: 100px;" class="update-avatar-btn">修改头像
              </el-button>
            </el-upload>
          </el-container>
        </el-col>
        <el-col span="20">
          <el-form label-position="top" style="margin-left: 100px">
            <el-form-item label="UID">
              <p style="text-decoration: underline; font-size: 15px;">{{ uid }}</p>
            </el-form-item>
            <el-form-item label="用户名">
              <el-input v-model="username" size="large" class="profile-input"/>
              <el-button type="success" class="update-profile-btn" @click="updateUsername">修改用户名</el-button>
            </el-form-item>
            <el-form-item label="邮箱">
              <el-input v-model="email" size="large" class="profile-input"/>
              <el-button type="success" class="update-profile-btn" @click="showNewEmailDialog">修改邮箱
              </el-button>
            </el-form-item>
            <el-button type="warning" style="margin-top: 30px" @click="showUpdatePwdDialog">修改密码</el-button>
            <el-button type="danger" style="margin-top: 30px;margin-left: 50px" @click="showDelDialog">
              注销账户
            </el-button>
          </el-form>
        </el-col>
        <el-dialog v-model="newEmailDialogVisible" title="验证新邮箱" width="300px">
          <el-form>
            <el-form-item label="邮箱验证码">
              <el-input type="text" placeholder="请输入验证码" v-model="verifyCode"></el-input>
            </el-form-item>
            <el-button type="primary" :disabled="count>0" @click="getVerifyCode">
              获取验证码{{ count > 0 ? '(' + count + ')' : '' }}
            </el-button>
            <el-button type="primary" @click="updateEmail" style="float: right">确认</el-button>
          </el-form>
        </el-dialog>

        <el-dialog v-model="delDialogVisible" title="注销账户" width="400px">
          <el-alert
              title="注销账户后，您的所有数据将被清除，且无法恢复"
              type="error"
              show-icon
              :closable="false"
          />
          <el-form-item label="验证邮箱" style="margin-top: 10px">
            <el-input type="text" placeholder="请输入验证码" v-model="verifyCode"></el-input>
          </el-form-item>
          <el-button type="primary" :disabled="count>0" @click="getVerifyCode">
            获取验证码{{ count > 0 ? '(' + count + ')' : '' }}
          </el-button>
          <el-button type="danger" @click="deleteUser" style="float: right">确认注销</el-button>
        </el-dialog>

        <el-dialog v-model="updatePwdDialogVisible" title="修改密码" width="400px">
          <el-form label-position="right"
                   label-width="100px">
            <el-form-item label="旧密码">
              <el-input type="password" placeholder="请输入旧密码" v-model="oldPwd"></el-input>
            </el-form-item>
            <el-form-item label="新密码">
              <el-input type="password" placeholder="请输入新密码" v-model="newPwd"></el-input>
            </el-form-item>
            <el-form-item label="确认新密码">
              <el-input type="password" placeholder="请再次输入新密码" v-model="confirmPwd"></el-input>
            </el-form-item>
            <el-button type="primary" @click="updatePwd" style="margin-left: 140px">确认修改</el-button>
          </el-form>
        </el-dialog>
      </el-container>
    </el-main>
  </el-container>
</template>
<script>
import {upload} from "@/utils/oss";
import {logout} from "@/utils/utils.js";
import {instance} from "@/utils/request";
import {ElMessage} from "element-plus";


export default {
  data() {
    return {
      mainUrl: 'https://oss.lewisliugl.cn/assets/banner.svg',
      avatarUrl: 'https://oss.lewisliugl.cn/avatar/default.svg',
      username: '用户',
      email: 'email',
      uid: 0,
      usernameInStorage: '用户',
      count: 0,
      verifyCode: '',
      newEmailDialogVisible: false,
      delDialogVisible: false,
      updatePwdDialogVisible: false,
      oldPwd: '',
      newPwd: '',
      confirmPwd: ''
    }
  },
  mounted() {
    const user = JSON.parse(localStorage.getItem('user'));
    if (user) {
      this.avatarUrl = user.avatar;
      this.uid = user.uid;
      this.username = user.username;
      this.usernameInStorage = user.username;
      this.email = user.email;
    }
  },
  methods: {
    logout,
    updateAvatar(item) {
      const file = item.file;
      const suffix = file.name.split('.').pop();
      const filename = this.uid + '.' + suffix;
      const dir = 'avatar';
      return upload(filename, dir, file).then((res) => {
        this.avatarUrl = res.url;
        const user = JSON.parse(localStorage.getItem('user'));
        user.avatar = res.url;
        localStorage.setItem('user', JSON.stringify(user));
        return updateProfile(this.uid, 'avatar', {
          value: filename
        });
      }).then((res) => {
        ElMessage.success('头像更新成功');
        console.log(res);
      }).catch((err) => {
        console.error(err);
        ElMessage.error(err);
      })
    },
    updateUsername() {
      const user = JSON.parse(localStorage.getItem('user'));
      const currentUsername = user.username;
      if (this.username === currentUsername) {
        ElMessage.warning('用户名未改变');
        return;
      }
      if (isUsernameValid(this.username)) {
        updateProfile(this.uid, 'username', {
          value: this.username
        }).then((res) => {
          ElMessage.success('用户名更新成功');
          user.username = this.username;
          this.usernameInStorage = this.username;
          localStorage.setItem('user', JSON.stringify(user));
        }).catch((err) => {
          console.error(err);
          ElMessage.error(err);
        })
      }
    },
    showNewEmailDialog() {
      const user = JSON.parse(localStorage.getItem('user'));
      const currentEmail = user.email;
      if (this.email === currentEmail) {
        ElMessage.warning('邮箱未改变');
        return;
      }
      if (isEmailValid(this.email)) {
        this.verifyCode = '';
        this.newEmailDialogVisible = true;
      }
    },
    showUpdatePwdDialog() {
      this.newPwd = '';
      this.confirmPwd = '';
      this.oldPwd = '';
      this.updatePwdDialogVisible = true;
    },
    showDelDialog() {
      this.verifyCode = '';
      this.delDialogVisible = true;
    },
    updateEmail() {
      const user = JSON.parse(localStorage.getItem('user'));
      updateProfile(this.uid, 'email', {
        value: this.email,
        verifyCode: this.verifyCode
      }).then((res) => {
        ElMessage.success('邮箱更新成功');
        user.email = this.email;
        localStorage.setItem('user', JSON.stringify(user));
        this.newEmailDialogVisible = false;
      }).catch((err) => {
        console.error(err);
        ElMessage.error(err);
      })
      this.verifyCode = '';
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
        console.log(error);
        ElMessage.error("验证码发送失败，请稍后重试")
      })
    },
    deleteUser() {
      if (this.verifyCode === '' || this.verifyCode === null) {
        ElMessage.warning('请输入验证码');
        return;
      }
      const user = JSON.parse(localStorage.getItem('user'));
      instance.delete('/users/signout', {
        params: {
          uid: user.uid,
          verifyCode: this.verifyCode
        }
      }).then((res) => {
        ElMessage.success('账户注销成功');
        logout();
      }).catch((err) => {
        console.error(err);
        ElMessage.error(err);
      })
    },
    updatePwd() {
      if (isPasswordValid(this.newPwd) && isConfirmPasswordValid(this.newPwd, this.confirmPwd) && isPasswordValid(this.oldPwd)) {
        const user = JSON.parse(localStorage.getItem('user'));
        let formData = new FormData();
        formData.append('uid', user.uid);
        formData.append('oldPwd', this.oldPwd);
        formData.append('newPwd', this.newPwd);
        formData.append('confirmPwd', this.confirmPwd);
        instance.put('/users/update-pwd', formData).then((res) => {
          console.log(res);
          ElMessage.success('密码修改成功，请重新登录');
          logout();
        }).catch((err) => {
          console.error(err);
          ElMessage.error(err);
        })
      }
    }
  }
}

const updateProfile = (uid, field, data) => {
  return instance.put('/users' + '/' + uid + '/' + field, data).then((res) => {
    console.log(res);
    return Promise.resolve();
  }).catch((err) => {
    console.error(err);
    return Promise.reject(err);
  })
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
  const specialCharacters = "!@#$%^&*()_+{}|:<>?`-=[]\\;',./~ ";
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
}

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
  if (confirmPassword === '') {
    ElMessage.warning('请再次输入密码')
    return false;
  }
  if (password !== confirmPassword) {
    ElMessage.warning('两次输入的密码不一致')
    return false;
  }
  return true;
}
</script>

<style scoped>
* {
  overflow: hidden;
}

.root {
  height: 100vh;
  width: 100vw;
}

.avatar-container {
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 10px;
}

.profile-container {
  display: flex;
  margin-top: 100px;
  margin-left: 200px;
}

.avatar-col {
  margin-left: 100px;
}

.profile-input {
  width: 300px;
}

.update-profile-btn {
  margin-left: 20px;
  width: 120px;
  display: flex;
  justify-content: center;
  align-items: center;
}

.profile-title {
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>