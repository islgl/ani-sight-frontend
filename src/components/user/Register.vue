<template>
  <el-container>
    <el-header>
      <h1>用户注册</h1>
    </el-header>
    <el-main>
      <el-card>
        <el-form>
          <el-form-item label="用户名">
            <el-input placeholder="请输入用户名" type="text" v-model="usernameOrEmail"></el-input>
          </el-form-item>
          <el-form-item label="密码">
            <el-input type="password" placeholder="请输入密码" v-model="password"></el-input>
          </el-form-item>
          <el-button type="primary" @click="check" :plain="true">登录</el-button>
          <el-button type="primary">注册</el-button>
          <el-button link type='info' key="info" class="forget-pwd">忘记密码</el-button>
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


</style>