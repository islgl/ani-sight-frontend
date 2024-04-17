<template>
  <el-container class="root">
    <el-header>
      <Header style="height: 8vh" :username="username" :avatar="avatarUrl"></Header>
    </el-header>
    <el-container style="height: 92vh">
      <el-aside style="width: 10vw">
        <Nav active-index="edge"/>
      </el-aside>
      <el-container style="width: 88vw">
        <el-main>
          边缘计算模块完善中...
        </el-main>
        <el-footer>
          <Footer/>
        </el-footer>
      </el-container>
    </el-container>
  </el-container>
</template>

<script>

import Nav from "@/components/Nav.vue";
import Footer from "@/components/Footer.vue";

export default {
  name: "Edge",
  components: {Footer, Nav},
  data() {
    return {
      uid: 0,
      username: '用户',
      avatarUrl: 'https://oss.lewisliugl.cn/avatar/default.svg',
    }
  }

}
</script>

<style scoped>
.root {
  height: 100vh;
  width: 100vw;
}
</style>
