<script>
import AdminNav from "@/components/admin/AdminNav.vue";

export default {
  name: "Image",
  components: {AdminNav},
  data() {
    return {
      uid: 0,
      username: '用户',
      avatarUrl: 'https://oss.lewisliugl.cn/avatar/default.svg',
    };
  },
  mounted() {
    const user = JSON.parse(localStorage.getItem('user'));
    if (user) {
      this.uid = user.uid;
      this.avatarUrl = user.avatar;
      this.username = user.username;
    }
  }
}
</script>

<template>
  <el-container class="root">
    <el-header>
      <Header style="height: 8vh" :username="username" :avatar="avatarUrl"></Header>
    </el-header>
    <el-container style="height: 92vh">
      <el-aside style="width: 10vw">
        <AdminNav active-index="images"></AdminNav>
      </el-aside>
      <el-container style="width: 88vw">
        <el-main>

        </el-main>
        <el-footer>
          <Footer/>
        </el-footer>
      </el-container>
    </el-container>
  </el-container>
</template>

<style scoped>
.root {
  height: 100vh;
  width: 100vw;
}
</style>