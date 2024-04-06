<script>
import AdminNav from "@/components/admin/AdminNav.vue";
import {ElMessage, ElMessageBox} from "element-plus";
import {instance} from "@/utils/request.js";
import {formatTimestamp} from "@/utils/utils.js";

export default {
  name: "Record",
  components: {AdminNav},
  data() {
    return {
      uid: 0,
      username: '用户',
      avatarUrl: 'https://oss.lewisliugl.cn/avatar/default.svg',
      histories: []
    };
  },
  mounted() {
    const user = JSON.parse(localStorage.getItem('user'));
    if (user) {
      this.uid = user.uid;
      this.avatarUrl = user.avatar;
      this.username = user.username;
    }

    // 获取历史记录
    const url = '/histories';
    const loadingInstance = this.$loading({
      lock: true,
      text: '正在加载历史记录，请稍候...',
      background: 'rgba(0, 0, 0, 0.7)',
    });
    instance.get(url).then(response => {
      const data = response.data;
      for (const item of data) {
        this.histories.push({
          id: item.id,
          uid: item.uid,
          species: item.species,
          archived: item.star === 1,
          caption: item.caption,
          time: formatTimestamp(item.timestamp),
          det: 'https://oss.lewisliugl.cn/labels/' + item.imageName,
          seg: 'https://oss.lewisliugl.cn/masks/' + item.imageName.replace('.jpg', '.png'),
        });
      }
      loadingInstance.close();
    }).catch(error => {
      loadingInstance.close();
      console.log(error);
    });
  },
  methods: {
    deleteHistory(id) {
      ElMessageBox.confirm('此操作将永久删除该记录, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        const loadingInstance = this.$loading({
          lock: true,
          text: '正在删除记录，请稍候...',
          background: 'rgba(0, 0, 0, 0.7)',
        });
        instance.delete('/histories/' + id).then(response => {
          loadingInstance.close();
          ElMessage.success('删除成功');
          this.histories = this.histories.filter(item => item.id !== id);
        }).catch(error => {
          loadingInstance.close();
          console.log(error);
          ElMessage.error('删除失败，请重试');
        })
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
        <AdminNav active-index="records"></AdminNav>
      </el-aside>
      <el-container style="width: 88vw">
        <el-main>
          <el-table :data="histories" style="width: 100%" stripe>
            <el-table-column prop="id" label="记录编号" width="180" sortable></el-table-column>
            <el-table-column prop="uid" label="用户" width="180" sortable></el-table-column>
            <el-table-column prop="species" label="识别物种" width="180" sortable></el-table-column>
            <el-table-column prop="caption" label="文本描述"></el-table-column>
            <el-table-column prop="time" label="识别时间" sortable></el-table-column>
            <el-table-column prop="detection" label="识别结果">
              <template #default="scope">
                <el-image :src="scope.row.det" loading="lazy" style="height: 150px"/>
              </template>
            </el-table-column>
            <el-table-column prop="segmentation" label="分割结果">
              <template #default="scope">
                <el-image :src="scope.row.seg" loading="lazy" style="height: 150px"/>
              </template>
            </el-table-column>
            <el-table-column prop="delete" label="删除记录">
              <template #default="scope">
                <el-button type="danger" @click="deleteHistory(scope.row.id)">删除</el-button>
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