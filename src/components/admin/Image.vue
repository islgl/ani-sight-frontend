<script>
import AdminNav from "@/components/admin/AdminNav.vue";
import {instance} from "@/utils/request.js";
import {formatTimestamp} from "@/utils/utils.js";
import {ElMessage} from "element-plus";

export default {
  name: "Image",
  components: {AdminNav},
  data() {
    return {
      uid: 0,
      username: '用户',
      avatarUrl: 'https://oss.lewisliugl.cn/avatar/default.svg',
      images:[]
    };
  },
  mounted() {
    const user = JSON.parse(localStorage.getItem('user'));
    if (user) {
      this.uid = user.uid;
      this.avatarUrl = user.avatar;
      this.username = user.username;
    }

    // 获取图片列表
    const loadingInstance = this.$loading({
      lock: true,
      text: '正在加载图片列表，请稍候...',
      background: 'rgba(0, 0, 0, 0.7)',
    });
    instance.get('/images').then(response => {
      const data = response.data;
      for (const image of data) {
        this.images.push({
          id: image.id,
          name: image.name,
          user: image.uid,
          time: formatTimestamp(image.timestamp),
          image: 'https://oss.lewisliugl.cn/images/' + image.name
        });
      }
      loadingInstance.close();
    }).catch(error => {
      loadingInstance.close();
      console.log(error);
    });
  },
  methods:{
    deleteImage(id){
      const loadingInstance = this.$loading({
        lock: true,
        text: '正在删除图片，请稍候...',
        background: 'rgba(0, 0, 0, 0.7)',
      });
      instance.delete('/images/'+id).then(response => {
        loadingInstance.close();
        ElMessage.success('图片删除成功');
        this.images = this.images.filter(image => image.id !== id);
      }).catch(error => {
        loadingInstance.close();
        ElMessage.error('图片删除失败');
        console.log(error);
      });
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
          <el-table :data="images" style="width: 100%" stripe>
            <el-table-column prop="id" label="图片编号" width="150px"/>
            <el-table-column prop="name" label="文件名"/>
            <el-table-column prop="user" label="上传用户"/>
            <el-table-column prop="time" label="上传时间"/>
            <el-table-column prop="image" label="图片" width="200px">
              <template #default="scope">
                <el-image :src="scope.row.image" style="height: 80px"/>
              </template>
            </el-table-column>
            <el-table-column label="操作" width="200px">
              <template #default="scope">
                <el-button type="danger" @click="deleteImage(scope.row.id)">删除</el-button>
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
</style>