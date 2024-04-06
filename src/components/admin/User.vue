<script>
import AdminNav from "@/components/admin/AdminNav.vue";
import {instance} from "@/utils/request.js";
import {ElMessage, ElMessageBox} from "element-plus";

export default {
  name: "User",
  components: {AdminNav},
  data() {
    return {
      uid: 0,
      username: '用户',
      avatarUrl: 'https://oss.lewisliugl.cn/avatar/default.svg',
      users: [],
    };
  },
  mounted() {
    const user = JSON.parse(localStorage.getItem('user'));
    if (user) {
      this.uid = user.uid;
      this.avatarUrl = user.avatar;
      this.username = user.username;
    }

    // 获取用户列表
    const loadingInstance = this.$loading({
      lock: true,
      text: '正在加载用户列表，请稍候...',
      background: 'rgba(0, 0, 0, 0.7)',
    });
    instance.get('/users').then(response => {
      const data = response.data;
      for (const user of data) {
        this.users.push({
          uid: user.uid,
          username: user.username,
          email: user.email,
          avatar: 'https://oss.lewisliugl.cn/avatar/' + user.avatar,
          // avatar: 'https://cdn.jsdelivr.net/gh/islgl/img-hosting/imgs/anisight-logo.svg',
          role: user.role === 'Administrator' ? '管理员' : '用户',
        });
      }
      loadingInstance.close();
    }).catch(error => {
      loadingInstance.close();
      console.log(error);
    });
  },
  methods: {
    resetPassword(uid) {
      const loadingInstance = this.$loading({
        lock: true,
        text: '正在重置密码...',
        background: 'rgba(0, 0, 0, 0.7)',
      });
      const formData=new FormData();
      formData.append('password','pwd123');
      instance.put('/users/'+uid,formData).then(response => {
        loadingInstance.close();
        ElMessage.success('密码已成功重置为 pwd123');
      }).catch(error => {
        console.log(error);
        loadingInstance.close();
        ElMessage.error('密码重置失败')
      })
    },
    confirmDelUser(uid){
      ElMessageBox.confirm('此操作将永久删除该用户, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.deleteUser(uid);
      }).catch();
    },
    deleteUser(uid){
      const loadingInstance = this.$loading({
        lock: true,
        text: '正在删除用户...',
        background: 'rgba(0, 0, 0, 0.7)',
      });
      instance.delete('/users/'+uid).then(response => {
        loadingInstance.close();
        ElMessage.success('用户已删除');
        this.users = this.users.filter(user => user.uid !== uid);
      }).catch(error => {
        console.log(error);
        loadingInstance.close();
        ElMessage.error('用户删除失败')
      })
    },
    setAdmin(uid,role){
      console.log(role)
      if (role==='管理员'){
        ElMessage.warning('该用户已是管理员');
        return;
      }
      const loadingInstance = this.$loading({
        lock: true,
        text: '正在修改用户权限...',
        background: 'rgba(0, 0, 0, 0.7)',
      });
      const formData=new FormData();
      formData.append('role',1);
      instance.put('/users/'+uid,formData).then(response => {
        loadingInstance.close();
        ElMessage.success('用户权限修改成功');
      }).catch(error => {
        console.log(error);
        loadingInstance.close();
        ElMessage.error('用户权限修改失败')
      })
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
        <AdminNav active-index="users"></AdminNav>
      </el-aside>
      <el-container style="width: 88vw">
        <el-main>
          <el-table :data="users" style="width: 100%" stripe>
            <el-table-column type="index" label="UID" width="150px"/>
            <el-table-column prop="username" label="用户名" width="200px" sortable/>
            <el-table-column prop="email" label="邮箱" width="250px"/>
            <el-table-column prop="avatar" label="头像" width="200px">
              <template #default="scope">
                <el-image :src="scope.row.avatar" style="width: 50px; height: 50px"/>
              </template>
            </el-table-column>
            <el-table-column prop="role" label="角色" width="150px" sortable></el-table-column>
            <el-table-column prop="action" label="操作">
              <template #default="scope">
                <el-button type="text" @click="resetPassword(scope.row.uid)">重置密码</el-button>
                <el-button type="text" @click="setAdmin(scope.row.uid,scope.row.role)">设置管理员</el-button>
                <el-button type="text" style="color: #F56E6E" @click="confirmDelUser(scope.row.uid)">删除用户</el-button>
              </template>
            </el-table-column>
          </el-table>
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

.el-table {
  font-family: Times, serif;
  font-size: medium;
}
</style>